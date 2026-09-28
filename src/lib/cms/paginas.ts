/** Pages directly under `root`, plus deeper ones whose parent page doesn't exist. */
export function topLevel<T extends { caminho: string }>(paginas: T[], root: string) {
  const caminhos = new Set(paginas.map((p) => p.caminho));
  return paginas.filter((p) => {
    let parent = p.caminho.slice(0, p.caminho.lastIndexOf("/"));
    while (parent !== root && parent.length > root.length && !caminhos.has(parent)) {
      parent = parent.slice(0, parent.lastIndexOf("/"));
    }
    return parent === root;
  });
}
