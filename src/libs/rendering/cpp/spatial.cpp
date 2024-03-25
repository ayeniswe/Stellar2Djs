#include "spatial.h"
Bound::Bound():
    minX(INFINITY),
    maxX(-INFINITY),
    minY(INFINITY),
    maxY(-INFINITY) {}
Bound::Bound(double minX, double maxX, double minY, double maxY):
    minX(minX),
    maxX(maxX),
    minY(minY),
    maxY(maxY) {}
Node::Node():
    leaf(true),
    children{},
    parent(nullptr),
    height(1) {
        Bound bounds;
        this->bounds = bounds;
    }
Node::Node(std::vector<Node> children):
    leaf(true),
    children(children),
    parent(nullptr),
    height(1) {
        Bound bounds;
        this->bounds = bounds;
    }
Node::Node(Bound bounds, std::any value):
    leaf(true),
    children({}),
    parent(nullptr),
    bounds(bounds),
    value(value),
    height(0) {}
RTree::RTree(const int max = 9) {
    if (max < 2) {
        throw std::invalid_argument("Error: R-Tree max capacity must be greater than 1");
    }
    this->max = max;
    this->min = ceil(this->max / 2);
}
bool RTree::contain(Bound b1, Bound b2) {
      return b1.minX <= b2.minX &&
             b1.minY <= b2.minY &&
             b1.maxX >= b2.maxX &&
             b1.maxY >= b2.maxY;
}
bool RTree::intersect(Bound b1, Bound b2) {
      return b1.minX <= b2.maxX &&
             b1.maxX >= b2.minX &&
             b1.minY <= b2.maxY &&
             b1.maxY >= b2.minY;
}
Bound RTree::adjustBounds(const Bound b1, const Bound b2) {
    Bound bounds;
    bounds.minX = std::min(b1.minX, b2.minX);
    bounds.maxX = std::max(b1.maxX, b2.maxX);
    bounds.minY = std::min(b1.minY, b2.minY);
    bounds.maxY = std::max(b1.maxY, b2.maxY);
    return bounds;
}
void RTree::addNode(std::shared_ptr<Node> node, const Node& child) {
    node->children.push_back(child);
    node->bounds = this->adjustBounds(node->bounds, child.bounds);
}
int RTree::calculateArea(const Bound bounds) {
    return std::abs(bounds.maxX - bounds.minX) * std::abs(bounds.minY - bounds.maxY);
}
Node RTree::chooseSubtree(const Node& sibling, const Node& child, const Bound bounds) {
    const int childA = this->calculateArea(child.bounds);
    const int childAMerge = this->calculateArea(this->adjustBounds(child.bounds, bounds));
    const int siblingA = this->calculateArea(sibling.bounds);
    const int siblingAMerge = this->calculateArea(this->adjustBounds(sibling.bounds, bounds));
    const int siblingE = siblingAMerge - siblingA;
    const int childE = childAMerge - childA;
    if (siblingE == childE) {
        return std::min(childA, siblingA) == childA ? child : sibling;
    } else {
        return std::min(childE, siblingE) == childE ? child : sibling;
    }
}
std::shared_ptr<Node> RTree::chooseLeafNode(const Bound bounds) {
    std::shared_ptr<Node> node = std::shared_ptr<Node>(&this->tree, [](Node*){});
    while (!node->leaf) {
        Node sibling = node->children[0];
        for (const Node child : node->children) {
            sibling = this->chooseSubtree(sibling, child, bounds);
        }
        node = std::make_shared<Node>(sibling);
    }
    return node;
}
std::tuple<int, int> RTree::pickSeeds(const Node node) {
    double worstInefficiency = -INFINITY;
    std::tuple<int, int> indexes;
    for (int i = 0; i < node.children.size(); i++) {
        for (int j = i + 1; j < node.children.size(); j++) {
            const Node child = node.children[i];
            const Node sibling = node.children[j];
            const int childA = this->calculateArea(child.bounds);
            const int siblingA = this->calculateArea(sibling.bounds);
            const int area = this->calculateArea(this->adjustBounds(child.bounds, sibling.bounds));
            const int pairIneffciency = area - childA - siblingA;
            if (pairIneffciency > worstInefficiency) {
                worstInefficiency = pairIneffciency;
                indexes = std::make_tuple(std::max(i, j), std::min(i, j));
            }
        }
    }
    return indexes;
}
void RTree::pickNext(std::shared_ptr<Node> node, std::shared_ptr<Node> newNode, std::vector<Node> children) {
    while (children.size() > 0) {
        // Add underfilled node
        if (this->min - node->children.size() == children.size()) {
            this->addNode(node, children.back());
            children.pop_back();
            continue;
        } else if (this->min - newNode->children.size() == children.size()) {
            this->addNode(newNode, children.back());
            children.pop_back();
            continue;
        }
        const Node child = children.back();
        children.pop_back();
        // Add to most optimal node by enlargement
        const int nodeA = this->calculateArea(this->adjustBounds(node->bounds, child.bounds)) - this->calculateArea(node->bounds);
        const int newNodeA = this->calculateArea(this->adjustBounds(newNode->bounds, child.bounds)) - this->calculateArea(newNode->bounds);
        if (nodeA == newNodeA) {
            // Add to node with smallest area
            if (this->calculateArea(node->bounds) == this->calculateArea(newNode->bounds)) {
                // Add to node with fewest children
                if (node->children.size() == newNode->children.size()) {
                    // Add to child to either node
                    this->addNode(node, child);
                } else if (node->children.size() < newNode->children.size()) {
                    this->addNode(node, child);
                } else {
                    this->addNode(newNode, child);
                }
            } else if (this->calculateArea(node->bounds) < this->calculateArea(newNode->bounds)) {
                this->addNode(node, child);
            } else {
                this->addNode(newNode, child);
            }
        } else if (nodeA < newNodeA) {
            this->addNode(node, child);
        } else {
            this->addNode(newNode, child);
        }
    }
}
std::shared_ptr<Node> RTree::splitNode(std::shared_ptr<Node> node) {
    // Guttaman quadratic splitting
    const auto [s1, s2] = this->pickSeeds(*node);
    // Create a new node from a node
    std::shared_ptr<Node> newNode = std::shared_ptr<Node>(new Node);
    this->addNode(newNode, node->children[s1]);
    auto itNode = node->children.begin() + s1;
    node->children.erase(itNode);
    newNode->height = node->height;
    newNode->leaf = node->leaf;
    newNode->parent = node->parent;
    // Reassign node entries
    std::vector<Node> remainingChildren = node->children;
    auto itRemaining = remainingChildren.begin() + s2;
    remainingChildren.erase(itRemaining);
    node->children = {node->children[s2]};
    node->bounds = node->children[s2].bounds;
    this->pickNext(node, newNode, remainingChildren);
    return newNode;
}
void RTree::adjustTree(std::shared_ptr<Node> node, std::shared_ptr<Node> newNode = nullptr) {
    if (node->parent) {
        std::shared_ptr<Node> parent = std::make_shared<Node>(*node->parent);
        if (newNode) {
            this->addNode(parent, *newNode);
        }
        if (parent->children.size() > this->max) {
            std::shared_ptr<Node> newParent = this->splitNode(parent);
            this->adjustTree(parent, newParent);
        } else {
            this->adjustTree(parent);
        }
    } else if (newNode) {
        // Assign nodes new parent
        newNode->parent = &this->tree;
        Node nodeValue = *node; // need to dereference since its possible it points to `this->tree`
        nodeValue.parent = &this->tree;
        // Grow tree taller
        this->tree.leaf = false;
        this->tree.height = node->height + 1;
        this->tree.children = std::vector<Node>{nodeValue, *newNode};
        // release shared pointers
        // node.reset();
        // newNode.reset();
    }
}
std::vector<std::any> RTree::all() {
    std::vector<std::any> records {};
    std::vector<Node> siblings {this->tree};
    Bound bounds(4, 8, 4, 8);
    while (siblings.size() > 0) {
        const Node sibling = siblings.back();
        siblings.pop_back();
        // if (this->contain(bounds, sibling.bounds)) {
        //     std::cout << sibling.bounds.minX << sibling.bounds.maxX << sibling.bounds.minY << sibling.bounds.maxY << std::endl;
        // }
        if (sibling.value.has_value()) {
            records.push_back(sibling.value);
        } else {
            siblings.insert(siblings.end(), sibling.children.begin(), sibling.children.end());
        }
    }
    return records;   
}
void RTree::clear() {
    Node newTree;
    this->tree = newTree;
}
void RTree::insert(Bound bounds, std::any value) {
    std::shared_ptr<Node> node = this->chooseLeafNode(bounds);
    node->bounds = this->adjustBounds(node->bounds, bounds);
    node->children.push_back(Node(bounds, value));
    std::cout << this->tree.height << node->height << std::endl;
    printBounds(node, 0);
    printBounds(node, 1);
    printBounds(node, 2);
    if (node->children.size() > this->max) {
        std::shared_ptr<Node> newNode = this->splitNode(node);
        this->adjustTree(node, newNode);
    } else {
        std::cout << &node << " " << &this->tree.children[0].children[1] << std::endl;
        this->adjustTree(node);
    }
}
std::vector<std::any> RTree::search(Bound bounds) {
    std::vector<std::any> records {};
    std::vector<Node> siblings {this->tree};
    while (siblings.size() > 0) {
        const Node sibling = siblings.back();
        siblings.pop_back();
        for (const Node child : sibling.children) {
            if (child.value.has_value()) {
                if (this->contain(child.bounds, bounds) || this->intersect(child.bounds, bounds)) {
                    records.push_back(child.value);
                }
            } else {
                if (this->contain(child.bounds, bounds) || this->intersect(child.bounds, bounds)) {
                    siblings.push_back(child);
                }
            }
        }
    }
    return records;
}
void RTree::remove(Bound bounds) {
    // TODO
}
void RTree::printBounds(std::shared_ptr<Node> node, int i) {
    std::cout << node->children[i].bounds.minX << node->children[i].bounds.maxX << node->children[i].bounds.minY << node->children[i].bounds.maxY << std::endl;
}
void RTree::printBounds(Node node, int i) {
    std::cout << node.children[i].bounds.minX << node.children[i].bounds.maxX << node.children[i].bounds.minY << node.children[i].bounds.maxY << std::endl;
}
int main() {
    // Create an RTree object
    RTree t(2);

    // Seed for random number generation
    std::random_device rd;
    std::mt19937 gen(rd());
    std::uniform_int_distribution<> dis(0, 2000); // Adjust range as needed

    // // Generate random bounds
    double minX = dis(gen);
    double maxX = dis(gen);
    double minY = dis(gen);
    double maxY = dis(gen);
    if (minX > maxX) std::swap(minX, maxX);
    if (minY > maxY) std::swap(minY, maxY);

    // Define bounds for random insertion
    Bound bounds(1, 2, 3, 4);
    Bound bounds2(4, 5, 4, 5);
    Bound bounds3(1, 3, 4, 5);
    Bound bounds4(4, 8, 4, 8);

    // Insert randomly generated values
    // for (int i = 0; i < 4; i++) {
    //     t.insert(bounds, i);
    // }
    t.insert(bounds, "EWe");
    t.insert(bounds2, "Ew");
    t.insert(bounds3, "EWe");
    t.insert(bounds4, "Ew");

    // Output the size of all inserted values
    std::cout << t.all().size() << std::endl;

    return 0;
}