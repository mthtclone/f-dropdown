export function getNodeAtPath(tree, path) {
    let current = { children: tree };
  
    for (const segment of path) {
      if (!current.children) return null;
      current = current.children.find(n => n.label === segment);
      if (!current) return null;
    }
  
    return current;
}