# Laurence Fishburne: grafo de colaboración

Entrega individual — Proyecto final de Análisis y Ciencia de Datos, UNIS. Autor: Nohel Estrada.

- `fishburne.ipynb`: construcción del grafo (I.4), visualización (I.5), espectro de $L_{sym}$ (I.6) y $A=BB^\top$ (I.7).
- `graph.py`: clase `Graph` como lista de adyacencia con pesos.
- `tmdb_api.py`: clase `TMDBAPIUtils`; guarda cada respuesta en `cache/`.
- `cache/`: JSON del API. Con esto el notebook corre completo sin API key.
- `figuras/grafo_fishburne.png`: el grafo.

Parámetros: semilla Laurence Fishburne, `limit = 5`, películas del 1975-01-01 al 2025-12-31, sin documentales ni
papeles de sí mismo.

```bash
pip install -r requirements.txt
jupyter nbconvert --execute --to notebook --inplace fishburne.ipynb
```

Si se borra el cache, definir `TMDB_API_KEY` en el entorno (nunca se sube al repo).
