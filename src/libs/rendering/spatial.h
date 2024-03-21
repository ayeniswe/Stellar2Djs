#include <iostream>
#include <vector>
#include <memory>
#include <any>
#include <optional>
#include <math.h>
#include <random>
#ifndef SPATIAL_H
#define SPATIAL_H
// The MBR minimum bounding region 
// that wraps a collection of rectangles
struct Bound {
    double minX;
    double maxX;
    double minY;
    double maxY;
    Bound (double minX, double maxX, double minY, double maxY);
    Bound ();
};
// The record object stored for retrieval 
class Node {
    public:
        Bound bounds;
        // The height of the tree
        int height;
        // Determines if the level is a leaf node
        // which always contains a collection of `Record`
        bool leaf;
        // A pointer to a `Node` that holds this `Node`
        // within its collection
        Node* parent;
        // A collection of `Node`
        std::vector<Node> children;
        // A arbitrary record value Note: Only exist when `leaf=true`
        std::any value;
        Node(std::vector<Node>);
        Node(Bound bounds, std::any value);
        Node();
};
class RTree {
    Node tree;
    // The minimum entries require in a collection
    int min;
    // The maximum entries allowed in a collection
    int max;
    // The new MBR bounds from merging bounds together
    Bound adjustBounds(const Bound b1, const Bound b2);
    // When reaching a fork upon exploring tree decide on most optimal sibling/subtree
    Node chooseSubtree(const Node& sibling, const Node& child, Bound bounds);
    // Retrieves the node that will always contain a collection of records
    std::shared_ptr<Node> chooseLeafNode(const Bound bounds);
    // Determine optimal seeds to create two seperate nodes after splitting
    // Method used: least wasted space
    std::tuple<int, int> pickSeeds(const Node node);
    // Distribute node entries between node and a newNode generated from the node that was split
    void pickNext(std::shared_ptr<Node> node, std::shared_ptr<Node> newNode, std::vector<Node> children);
    // Propagate up tree to maintain balance
    void adjustTree(std::shared_ptr<Node> node, std::shared_ptr<Node> newNode);
    bool contain(Bound b1, Bound b2);
    bool intersect(Bound b1, Bound b2);
    std::shared_ptr<Node> splitNode(std::shared_ptr<Node> node);
    int calculateArea(const Bound bounds);
    void addNode(std::shared_ptr<Node> node, const Node& child);
    public:
        RTree(const int max);
        std::vector<std::any> all();
        std::vector<std::any> search(Bound bounds);
        void clear();
        void insert(Bound bounds, std::any value);
        void remove(Bound bounds);
        void printBounds(std::shared_ptr<Node> node, int i);
        void printBounds(Node node, int i);
};
#endif // SPATIAL_H