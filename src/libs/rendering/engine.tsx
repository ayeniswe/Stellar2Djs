type Bound = {
  minX: number
  maxX: number
  minY: number
  maxY: number
}
class Record {
  bounds: Bound
  value: any
  constructor(bounds: Bound, value: any) {
    this.bounds = bounds;
    this.value = value;
  }
}
class Node  {
  bounds: Bound
  height: number
  leaf: boolean
  parent: Node | null
  children: (Node | Record)[]
  constructor (bounds: Bound, leaf: boolean, parent: Node | null, children: (Node | Record)[], height: number) {
      this.bounds = bounds;
      this.height = height;
      this.leaf = leaf;
      this.parent = parent;
      this.children = children;
  }
}
/**
 * R-Tree implementation
 * 
 * Spatial indexing data structure
 */
class RTree {
  #minCapacity;
  #maxCapacity;
  #tree: Node;
  get tree() { return this.#tree }
  constructor (capacity: number = 9) {
      if (capacity < 2) throw console.error("Error: R-Tree minimium capacity must be greater than 1");
      this.#maxCapacity = capacity;
      this.#minCapacity = Math.ceil(capacity / 2);
      this.#tree = this.#createNode([]);
  }
  #createNode = (children: (Node | Record)[]): Node => {
    return new Node(
      {
        minX: Infinity,
        maxX: -Infinity,
        minY: Infinity,
        maxY: -Infinity
      }, 
      true, 
      null, 
      children,
      1
    )
  }
  #addNode = (node: Node, child: Node | Record) => {
    node.children.push(child as any);
    node.bounds = this.#adjustBounds(node.bounds, child.bounds);
  }
  #contain = (bounds: Bound, search: Bound) => {
      return bounds.minX <= search.minX &&
             bounds.minY <= search.minY &&
             bounds.maxX >= search.maxX &&
             bounds.maxY >= search.maxY;
  }
  #intersect = (bounds: Bound, search: Bound) => {
      return bounds.minX <= search.maxX &&
             bounds.maxX >= search.minX &&
             bounds.minY <= search.maxY &&
             bounds.maxY >= search.minY;
  }
  #adjustBounds = (bounds: Bound, current: Bound) => {
    const minX = Math.min(bounds.minX, current.minX);
    const maxX = Math.max(bounds.maxX, current.maxX);
    const minY = Math.min(bounds.minY, current.minY);
    const maxY = Math.max(bounds.maxY, current.maxY);
    return {
        minX: minX,
        maxX: maxX,
        minY: minY,
        maxY: maxY
    }
  }
  #calculateArea = (bounds: Bound) => {
    return Math.abs(bounds.maxX - bounds.minX) * Math.abs(bounds.minY - bounds.maxY);
  }
  #chooseSubtree = (sibling: Node, child: Node, bounds: Bound) => {
    const childA = this.#calculateArea(child.bounds);
    const childAMerge = this.#calculateArea(this.#adjustBounds(child.bounds, bounds));
    const siblingA = this.#calculateArea(sibling.bounds);
    const siblingAMerge = this.#calculateArea(this.#adjustBounds(sibling.bounds, bounds));
    const siblingE = siblingAMerge - siblingA;
    const childE = childAMerge - childA;
    if (siblingE === childE) {
        return Math.min(childA, siblingA) === childA ? child : sibling;
    } else {
        return Math.min(childE, siblingE) === childE ? child : sibling;
    }
  }
  #chooseLeafNode = (bounds: Bound) => {
    let currentNode = this.#tree;
    while (currentNode.children[0] instanceof Node) {
      let sibling = currentNode.children[0];
      for (const child of currentNode.children as Node[]) {
        sibling = this.#chooseSubtree(sibling, child, bounds);
      }
      currentNode = sibling;
    }
    return currentNode;
  }
  #pickSeeds = (node: Node) => {
    let worstInefficiency = -Infinity;
    let indexes: number[] = [];
    for (let i = 0; i < node.children.length; i++) {
      for (let j = i + 1; j < node.children.length; j++) {
        const child = node.children[i];
        const sibling = node.children[j];
        const childA = this.#calculateArea(child.bounds);
        const siblingA = this.#calculateArea(sibling.bounds);
        const area = this.#calculateArea(this.#adjustBounds(child.bounds, sibling.bounds));
        const pairInefficiency = area - childA - siblingA
        if (pairInefficiency > worstInefficiency) {
          worstInefficiency = pairInefficiency;
          indexes = [Math.max(i, j), Math.min(i, j)];
        }
      }
    }
    return indexes;
  }
  #pickNext = (node: Node, newNode: Node, children: (Node | Record)[]) => {
    while (children.length > 0) {
      // Add to underfilled node
      if (this.#minCapacity - node.children.length === children.length) {
        const child = children.pop()!;
        this.#addNode(node, child);
        continue;
      } else if (this.#minCapacity - newNode.children.length === children.length) {
        const child = children.pop()!;
        this.#addNode(newNode, child);
        continue;
      }
      const child = children.pop()!;
      // Add to most optimal node by enlargement
      const nodeA = this.#calculateArea(this.#adjustBounds(node.bounds, child.bounds)) - this.#calculateArea(node.bounds);
      const newNodeA = this.#calculateArea(this.#adjustBounds(newNode.bounds, child.bounds)) - this.#calculateArea(newNode.bounds);
      if (nodeA === newNodeA) {
        // Add to node with smallest area
        if (this.#calculateArea(node.bounds) === this.#calculateArea(newNode.bounds)) {
          // Add to node with fewest children
          if (node.children.length === newNode.children.length) {
            // Add to child to either node
            this.#addNode(node, child);
          } else if (node.children.length < newNode.children.length) {
            this.#addNode(node, child);
          } else {
            this.#addNode(newNode, child);
          }
        } else if (this.#calculateArea(node.bounds) < this.#calculateArea(newNode.bounds)) {
          this.#addNode(node, child);
        } else {
          this.#addNode(newNode, child);
        }
      } else if (nodeA < newNodeA) {
        this.#addNode(node, child);
      } else {
        this.#addNode(newNode, child);
      }
    }
  }
  #splitNode = (node: Node) => {
    // Guttaman quadratic splitting
    const [s1, s2] = this.#pickSeeds(node);
    const newNode = this.#createNode(node.children.splice(s1, 1));
    newNode.bounds = newNode.children[0].bounds;
    newNode.height = node.height;
    newNode.leaf = node.leaf;
    newNode.parent = node.parent;
    const subChildren = node.children.splice(s2, 1);
    const remainingChildren = node.children.slice();
    node.children = subChildren;
    node.bounds = node.children[0].bounds;
    this.#pickNext(node, newNode, remainingChildren);
    return newNode;
  }
  #adjustTree = (node: Node, newNode?: Node) => {
    if (node.parent !== null) {
      const parent = node.parent;
      if (newNode) {
        this.#addNode(parent, newNode);
      }
      if (parent.children.length > this.#maxCapacity) {
        const newParent = this.#splitNode(parent);
        this.#adjustTree(parent, newParent);
      } else {
        this.#adjustTree(parent);
      }
    } else if (newNode) {
      // Grow tree taller
      this.#tree = this.#createNode([node, newNode]);
      this.#tree.leaf = false;
      this.#tree.height = node.height + 1;
      node.parent = this.#tree;
      newNode.parent = this.#tree;
    }
  }
  #findParent = (bounds: Bound) => {
    const siblings = [this.#tree];
    while (siblings.length > 0) {
      const sibling = siblings.pop()!;
      if (sibling.leaf) {
        return sibling;
      }
      for (const child of sibling.children as Node[]) {
          if (this.#contain(child.bounds, bounds) || this.#intersect(child.bounds, bounds)) {
            siblings.push(child);
          }
      }
    }
  }
  #insert = (node: Node | Record) => {
    let parent;
    if (node instanceof Record) {
      // Insert a record
      parent = this.#chooseLeafNode(node.bounds);
      parent.bounds = this.#adjustBounds(parent.bounds, node.bounds);
      const records = parent.children as Record[];
      records.push(node);
    } else {
      // Insert a parent node
      parent = this.#tree
      const siblings = [parent];
      while (siblings.length > 0) {
        let sibling = siblings.pop()!;
        if (node.height === sibling.height) {
          sibling.children.push(node)
          parent = sibling;
        } else {
          for (const child of sibling.children as Node[]) {
            sibling = this.#chooseSubtree(sibling, child, node.bounds);
          }
          siblings.push(sibling);
        }
      }
    }
    // Adjust tree to reflect changes
    if (parent.children.length > this.#maxCapacity) {
      const newNode = this.#splitNode(parent);
      this.#adjustTree(parent, newNode);
    } else {
      this.#adjustTree(parent);
    }
  }
  getData = () => {
    const data = [];
    const subTrees = [this.#tree];
    while (subTrees.length > 0) {
      const node = subTrees.pop()!;
      if (node.leaf) { 
        for (const record of node.children) {
          data.push(record);
        }
      } else {
        subTrees.push(...node.children as Node[]);
      }
    }
    return data;
  }
  clear = () => {
    this.#tree = this.#createNode([]);
  }
  insert = (bounds: Bound, value: any) => {
    this.#insert(new Record(bounds, value));
  }
  search = (bounds: Bound) => {
    const results = [];
    const siblings = [this.#tree];
    while (siblings.length > 0) {
      const sibling = siblings.pop()!;
      for (const child of sibling.children) {
        if (child instanceof Record) {
          if (this.#contain(child.bounds, bounds) || this.#intersect(child.bounds, bounds)) {
            results.push(child);
          }
        } else { 
          if (this.#contain(child.bounds, bounds) || this.#intersect(child.bounds, bounds)) {
            siblings.push(child);
          }
        }
      }
    }
    return results;
  }
  delete = (bounds: Bound) => {
    // Search for parent node of record to delete
    const parent = this.#findParent(bounds);
    if (parent) {
      // Delete matching entry
      parent.children = parent.children.filter((child) => {
        return JSON.stringify(child.bounds) !== JSON.stringify(bounds);
      }) as Node[]
      const removedChildren = this.#condenseTree(parent)
      // Reinsert removed children
      if (removedChildren.length != 0) {
        for (const node of removedChildren) {
          this.#insert(node);
        }
      }
    }
  }
  #condenseTree = (parent: Node, removedChildren: (Node | Record)[] = []) => {
    const pparent = parent.parent;
    // Check if at the root node 
    if (pparent) {
      if (parent.children.length < this.#minCapacity) {
        // Relocate nodes or records in underfilled node
        removedChildren.push(...parent.children.slice());
        // Remove underfilled node
        pparent.children = pparent.children.filter((child) => {
          return parent !== child;
        }) as Node[]
      } else {  
        // Readjust tree
        parent.bounds = {
            minX: Infinity,
            maxX: -Infinity,
            minY: Infinity,
            maxY: -Infinity
        }, 
        parent.children.forEach((child) => {
          parent.bounds = this.#adjustBounds(parent.bounds, child.bounds);
        })
      }
      this.#condenseTree(pparent, removedChildren)
    }
    return removedChildren
  }
}
export {
  RTree
}