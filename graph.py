"""Grafo no dirigido con pesos, guardado como lista de adyacencia (dict de dicts)."""
import numpy as np


class Graph:
    def __init__(self):
        self.names = {}
        self.adj = {}

    def add_node(self, node):
        node_id, name = node
        if node_id in self.names:
            return
        self.names[node_id] = name
        self.adj[node_id] = {}

    def add_edge(self, a, b):
        # (a, b) y (b, a) son la misma arista: se actualizan las dos entradas
        assert a != b and a in self.adj and b in self.adj
        w = self.adj[a].get(b, 0) + 1
        self.adj[a][b] = w
        self.adj[b][a] = w

    def total_nodes(self):
        return len(self.adj)

    def total_edges(self):
        return sum(len(v) for v in self.adj.values()) // 2

    def max_degree_nodes(self):
        grados = {n: len(v) for n, v in self.adj.items()}
        top = max(grados.values(), default=0)
        return {n: g for n, g in grados.items() if g == top}

    def adjacency(self):
        orden = list(self.adj)
        fila = {n: i for i, n in enumerate(orden)}
        A = np.zeros((len(orden), len(orden)))
        for a, vecinos in self.adj.items():
            for b, w in vecinos.items():
                A[fila[a], fila[b]] = w
        return A, orden
