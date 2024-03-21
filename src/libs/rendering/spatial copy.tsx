  type Rect = {
    minX: number
    maxX: number
    minY: number
    maxY: number
  }
  type Point = {
    maxX: number
    maxY: number
  }
  type Node = (Leaf | Branch)[]
  class Root { 
    entries: Node
    parent = null;
    constructor () {
        this.entries = [];
    }
  }
  // Hierarchy organizational
  class Branch {
    area: Rect
    entries: Node
    height: number = 1
    parent!: Branch | Root
    constructor (area: Rect, entries: Node) {
        this.area = area;
        this.entries = entries;
    }
  }
  // Data object
  class Leaf {
    area: Rect
    parent!: Branch | Root 
    value: TextureObject
    constructor (area: Rect, value: any) {
        this.area = area;
        this.value = value;
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
    #tree: Root;
    get tree() { return this.#tree; }
    constructor (capacity: number = 9) {
        if (capacity < 2) throw console.error("Error: R-Tree minimium capacity must be greater than 1");
        this.#maxCapacity = capacity;
        this.#minCapacity = Math.ceil(capacity / 2);
        this.#tree = new Root();
    }
    /**
     * Resolve the entry as a point or rect
     */
    #resolveEntry(entry: Rect | Point) {
      return "minX" in entry ? {
        minX: entry.minX, 
        maxX: entry.maxX, 
        minY: entry.minY, 
        maxY: entry.maxY
      } : {
        minX: entry.maxX, 
        maxX: entry.maxX, 
        minY: entry.maxY, 
        maxY: entry.maxY
      };
    }
    /** 
     * Convert the leaf or branch to a higher order node
     * 
     * Example: `Leaf -> Branch[Leaf]` or `Branch[Branch[]]`
    */
    #toHigherOrder = (node: Leaf | Branch) => {
        const branch = new Branch(node.area, [node]);
        node.parent = branch;
        // Track tree height as grows
        if (node instanceof Branch) {
          branch.height = node.height + 1;
        }
        return branch;
    }
    /**
     * Check if the node as reached the max capacity
     */
    #freeSpace = (node: Node) => {
        return node.length <= this.#maxCapacity;
    }
    #calculateArea = (rect: Rect) => {
        return Math.abs(rect.maxX - rect.minX) * Math.abs(rect.minY - rect.maxY);
    }
    /**
     * Get the most optimal branch
     * 
     * Note - branch option order doesnt matter
     * @param oldBranch - branch first option
     * @param newBranch - branch second option
     * @param leaf - the leaf to be added to a branch
     * @returns 
     */
    #optimalBranch = (oldBranch: Branch, newBranch: Branch, leaf: Rect) => {
        // Compare the pontential enlargement effect of the leaf and get branch with the least
        const newBranchArea = this.#calculateArea(newBranch.area);
        const newBranchAreaWithLeaf = this.#calculateArea(this.#adjustArea(newBranch.area, leaf));
        const oldBranchArea = this.#calculateArea(oldBranch.area);
        const oldBranchAreaWithLeaf = this.#calculateArea(this.#adjustArea(oldBranch.area, leaf));
        const oldEnlargement = oldBranchAreaWithLeaf - oldBranchArea;
        const newEnlargement = newBranchAreaWithLeaf - newBranchArea;
        if (oldEnlargement === newEnlargement) {
            return Math.min(newBranchArea, oldBranchArea) === newBranchArea ? newBranch : oldBranch;
        } else {
            return Math.min(newEnlargement, oldEnlargement) === newEnlargement ? newBranch : oldBranch;
        }
    }
    /**
     * Adjust the area of the bounding region to include the search region
     */
    #adjustArea = (areaBR: Rect, searchBR: Rect) => {
        const minX = Math.min(areaBR.minX, searchBR.minX);
        const maxX = Math.max(areaBR.maxX, searchBR.maxX);
        const minY = Math.min(areaBR.minY, searchBR.minY);
        const maxY = Math.max(areaBR.maxY, searchBR.maxY);
        return {
            minX: minX,
            maxX: maxX,
            minY: minY,
            maxY: maxY
        }
    }
    /**
     * Determine if areas match
     */
    #compareArea = (area1: Rect, area2: Rect) => {
        return area1.minX === area2.minX &&
               area1.minY === area2.minY &&
               area1.maxX === area2.maxX &&
               area1.maxY === area2.maxY;
    }
    /**
     * Determine if an bounding region is containing the search region 
     */
    #contain = (areaBR: Rect, searchBR: Rect) => {
        return areaBR.minX <= searchBR.minX &&
               areaBR.minY <= searchBR.minY &&
               areaBR.maxX >= searchBR.maxX &&
               areaBR.maxY >= searchBR.maxY;
    }
    /**
     * Determine if an bounding region is intersecting with the search region 
     */
    #intersect = (areaBR: Rect, searchBR: Rect) => {
        return areaBR.minX <= searchBR.maxX &&
               areaBR.maxX >= searchBR.minX &&
               areaBR.minY <= searchBR.maxY &&
               areaBR.maxY >= searchBR.minY;
    }
    /**
     * Add a child to a to-be parent node
     * 
     * Note - Tree may grow in height as new nodes are added
     * @param branch - child parent to-be
     * @param child - child to add to parent to-be
     */
    #add = (branch: Branch | Root, child: Leaf | Branch ) => {
        child.parent = branch;
        branch.entries.push(child);  
        if (branch instanceof Branch) {
          branch.area = this.#adjustArea(branch.area, child.area);
          // Track tree height as grows
          if (child instanceof Branch) {
            if (child.height === branch.height) {
                branch.height++;
            }
        }
        }
    }
    /**
     * Choose the most optimal branch to add the new leaf to
     * 
     * Note - The root node is always returned if no branching is available
     * @param newLeaf - the potential new leaf to be added to the entries in a branch or root node
     */
    #chooseLeaf = (newLeaf: Leaf) => {
        const find = (node: Branch | Root ): Branch | Root => {
            let branch: Branch | null = null;
            for (const child of node.entries) {
                if (child instanceof Leaf) {
                    return node;
                } else {
                    branch = branch ? this.#optimalBranch(branch, child, newLeaf.area) : child;
                }
            }
            if (branch) {
                return find(branch);
            } else {
                return node;
            }
        }
        return find(this.#tree);
    }
    /**
     * Split a node into two seperate nodes based on "quadratic splitting alogrithm" 
     * @param node - node to be split
     */
    #quadsplit = (node: Node) => {
        // Check for the most wasteful adjustment 
        const inefficieny = (entry1: Leaf | Branch, entry2: Leaf | Branch) => {
            const entries = this.#adjustArea(entry1.area, entry2.area)
            return this.#calculateArea(entries) - this.#calculateArea(entry1.area) - this.#calculateArea(entry2.area);
        }
        // Review and get the best branches
        const optimalBranches = () => {
            let greatestArea = Number.NEGATIVE_INFINITY;
            let group1: Leaf | Branch;
            let group2: Leaf | Branch;
            let i = 0;
            let j = i + 1;
            while (j < node.length) {
                const newArea = inefficieny(node[i], node[j])
                if (Math.max(newArea, greatestArea) !== greatestArea) {
                    greatestArea = newArea;
                    group1 = node[i];
                    group2 = node[j];
                }
                j++;
                if (j > node.length) {
                    i++;
                    j = i + 1
                }
            }
            return [this.#toHigherOrder(group1!), this.#toHigherOrder(group2!)];
        }
        // Disperse entry into respective branches
        const [branch1, branch2] = optimalBranches();
        // Track avaliable entries left
        // minus 2 since both nodes are already assigned one for initial grouping
        let availableEntries = node.length - 2;
        while (node.length > 0) {
            const entry = node.pop()!;
            // Skip already dispered nodes that are assigned to a group previously
            if (entry === branch1.entries[0] || entry === branch2.entries[0]) continue;
            // Check if remainder of entries is needed to bring group to minimum entries needed
            if ((branch1.entries.length >= this.#minCapacity) && (this.#minCapacity - branch2.entries.length === availableEntries)) {
                this.#add(branch2, entry);
                continue;
            } else if ((branch2.entries.length >= this.#minCapacity) && (this.#minCapacity - branch1.entries.length === availableEntries)) {
                this.#add(branch1, entry);
                continue;
            }
            const branch1Area = this.#calculateArea(branch1.area);
            const branch2Area = this.#calculateArea(branch2.area);
            const branch1AreaChange = this.#calculateArea(this.#adjustArea(branch1.area,entry.area)) - branch1Area;
            const branch2AreaChange = this.#calculateArea(this.#adjustArea(branch2.area,entry.area)) - branch2Area;
            if (branch1AreaChange === branch2AreaChange) {
                let bestBranch = branch1;
                switch (true) {
                    // 1. Add entry to smallest area branch
                    case branch1Area !== branch2Area:
                        bestBranch = Math.min(branch1Area, branch2Area) === branch1Area ? bestBranch : branch2;
                        this.#add(bestBranch, entry);
                        break;
                    // 2. Add entry to fewer entries branch
                    case branch1.entries.length !== branch2.entries.length:
                        bestBranch = branch1.entries.length < branch2.entries.length ? bestBranch : branch2;
                        this.#add(bestBranch, entry);
                        break;           
                    // 3. Add entry to any branch
                    default:
                        this.#add(bestBranch, entry);
                        break;
                }
            } else {
                // Add entry to smallest enlargement branch
                const bestBranch = Math.min(branch1AreaChange, branch2AreaChange) === branch1AreaChange ? branch1 : branch2;
                this.#add(bestBranch, entry);
            }
            availableEntries--;
        }
        return [branch1, branch2];
    }
    /**
     * Validate the rest of the tree by splitting any parents that have overflowed from entries
     */
    #adjustTree = (node: Branch | Root) => {
        if (node.parent !== null) {
          const parent = node.parent;
          if (!this.#freeSpace(parent.entries)) {
            // Split parent nodes
            const [branch1, branch2] = this.#quadsplit(parent.entries);
            this.#adjustSplitNode(branch1, branch2, parent);
          } else {
            // Re-Verify bounding regions and heights
            if (parent instanceof Branch) {
              for (const entry of parent.entries) {
                parent.area = this.#adjustArea(parent.area, entry.area);
              }
            }
            this.#adjustTree(parent);
          }
        }
    }
    /**
     * Adjust the nodes that were split to adapt to the old node spot
     * @param node1 - The first node from split
     * @param node2 - The second node from split
     * @param parent - The parent to-be of the new nodes
     */
    #adjustSplitNode = (node1: Branch, node2: Branch, parent: Branch | Root) => {
      // Point to the old node parent
      node1.parent = parent;
      node2.parent = parent;
      // Add new node to old node parent
      if (parent.entries.length !== 0) {
        // Reassign old index from parent as first split node
        for (let i = 0; i < parent.entries.length; i++) {
          // Entry should always be a type Branch in this situation
          const node = parent.entries[i] as Branch;
          if (node.entries.length === 0) {
            parent.entries[i] = node1;
            break;
          }
        }
      } else {
        console.log("Did not reuse parent node")
        this.#add(parent, node1);
      }
      this.#add(parent, node2);
    }
    /**
     * Find the leaf nodes
     * @param entries - the array that holds the branch or leaf entries
     * @param results - the array to return with all leaf entries found in search region
     * @param area - the search region
     */
    #findLeaf = (area: Rect, entries: Node = this.#tree.entries, results: Leaf[] = []) => {
      for (const node of entries) {
        if (node instanceof Leaf) {
              if (this.#contain(node.area, area) || this.#intersect(node.area, area)) {
                  results.push(node);
              }
          } else { 
              if (this.#contain(node.area, area) || this.#intersect(node.area, area)) {
                  this.#findLeaf(area, node.entries, results);
              }
          }
      }
      return results;
    }
    /**
     * Find the branch node on same height level or root
     * @param entries - the array that holds the branch entries
     * @param area - the search region
     * @param height - the tree height level to find
     */
    #findBranch = (area: Rect, height: number, entries: Node = this.#tree.entries)  => {
      for (const node of entries) {
          if (node instanceof Branch) {
              if (node.height === height) {
                return node.parent;
              } else {
                this.#findBranch(area, height, node.entries)
              }
          } else {
            break;
          }
      }
      // No empty branch found
      return this.#tree;
    }
    #condenseTree = (branch: Branch | Root, removedNodes: Branch[] = []) => {
      if (branch instanceof Branch) {
        const parent = branch.parent;
        if (branch.entries.length < this.#minCapacity) {
          // Remove the node from parent for later re-insert into tree
          for (let i = 0; i < parent.entries.length; i++) {
            if (parent.entries[i] === branch) {
              // Disregard reinserting an empty node
              if (branch.entries.length !== 0) {
                removedNodes.push(branch);
              }
              parent.entries.splice(i, 1);
              break;
            }
          }
        } else {
          // Recompute the bounding region for node
          for (const entry of branch.entries) {
            branch.area = this.#adjustArea(branch.area, entry.area);
          }
        }
        this.#condenseTree(branch.parent, removedNodes);
      }
      return removedNodes;
    }
    /**
     * Search the tree for entries that collide with the search region
     * @param options - an optional object of params:
     */
    search = (searchBR: Rect | Point, options?: any) => {
        const area = this.#resolveEntry(searchBR);
        return this.#findLeaf(area);
    }
    /**
     * Insert an entry into the tree
     * @param node - the node to insert the child into 
     * @param child - the child branch/leaf to add to node
     * @param parent - the parent of the node
     */
    #insert = (node: Branch | Root, child: Leaf | Branch, parent: Branch | Root) => {
        this.#add(node, child);
        if (!this.#freeSpace(node.entries)) {
            // Splitnode
            const [branch1, branch2] = this.#quadsplit(node.entries);
            console.log(branch1, branch2)
            this.#adjustSplitNode(branch1, branch2, parent);
            this.#adjustTree(branch1);
        } else {
          this.#adjustTree(node);
        }
    }
    insert = (entry: Rect | Point, value: any) => {
        const area = this.#resolveEntry(entry);
        const leaf = new Leaf(area, value);
        const node = this.#chooseLeaf(leaf);
        // Get root node only if tree is empty
        const parent = node instanceof Root ? node : node.parent;
        this.#insert(node, leaf, parent)
    }
    delete = (entry: Rect | Point) => {
        const area = this.#resolveEntry(entry);
        // Get leaf node parent
        const result = this.search(area, {exact: true});
        if (result) {
          const parent = result[0].parent;
          // Find the leaf node to delete
          for (let i = 0; i < parent.entries.length; i++) {
            if (this.#compareArea(area, parent.entries[i].area)) {
              parent.entries.splice(i, 1);
              break;
            }
          }
          const removedNodes = this.#condenseTree(parent);
          // Reinsert nodes
          for (const node of removedNodes) {
            // Find the spot to place branch
            const branch = this.#findBranch(node.area, node.height)
            if (branch) {
              // Get root node only if reached root
              const parent = branch instanceof Root ? branch : branch.parent;
              this.#insert(branch, node, parent)
            }
          }
        }
    }
    clear = () => {
      this.#tree = new Root();
    }
}
export {
    RTree
}