export function isLeaf(node) {
    return !!node.value && !node.children;
}
  
export function isGroup(node) {
    return Array.isArray(node.children);
}