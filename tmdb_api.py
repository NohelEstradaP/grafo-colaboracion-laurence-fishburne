"""Cliente mínimo del API de TMDB (v3) con cache en disco.

La primera vez que se pide algo se guarda la respuesta en cache/ como JSON; las
siguientes se leen de ahí. Con el cache del repositorio no hace falta API key.
"""
import json
import os
import time
from pathlib import Path

import requests

URL = "https://api.themoviedb.org/3"
GENERO_DOCUMENTAL = 99
PALABRAS_PROPIO = ("himself", "herself", "themselves", "self")


def _es_el_mismo(personaje):
    """True si el personaje es la persona interpretándose a sí misma ("Himself", "Self - Host", ...)."""
    palabras = personaje.lower().replace("(", " ").replace(")", " ").replace("-", " ").replace("/", " ").split()
    return any(p in PALABRAS_PROPIO for p in palabras)


class TMDBAPIUtils:
    def __init__(self, api_key=None, cache="cache"):
        self.key = api_key or os.getenv("TMDB_API_KEY")
        self.cache = Path(cache)
        self.cache.mkdir(parents=True, exist_ok=True)
        self.sesion = requests.Session()
        self.pedidos = 0

    def _pedir(self, endpoint, **params):
        nombre = endpoint.strip("/").replace("/", "_")
        if params:
            nombre += "_" + "_".join(f"{k}-{v}" for k, v in sorted(params.items())).replace(" ", "+")
        ruta = self.cache / f"{nombre}.json"
        if ruta.is_file():
            with open(ruta, encoding="utf-8") as f:
                return json.load(f)
        if not self.key:
            raise FileNotFoundError(f"{ruta} no está en el cache y TMDB_API_KEY no está definida")
        cabeceras = {"Authorization": f"Bearer {self.key}"} if self.key.startswith("eyJ") else {}
        if not cabeceras:
            params = {**params, "api_key": self.key}
        while True:
            resp = self.sesion.get(URL + endpoint, params=params, headers=cabeceras, timeout=30)
            if resp.status_code != 429:
                break
            time.sleep(float(resp.headers.get("Retry-After", 2)))
        resp.raise_for_status()
        datos = resp.json()
        self.pedidos += 1
        with open(ruta, "w", encoding="utf-8") as f:
            json.dump(datos, f, ensure_ascii=False)
        return datos

    def search_person(self, name):
        return self._pedir("/search/person", query=name)["results"]

    def get_movie_cast(self, movie_id, limit, exclude_ids=()):
        """Lista de diccionarios del elenco con 0 <= order <= limit-1, sin exclude_ids."""
        elenco = self._pedir(f"/movie/{movie_id}/credits").get("cast", [])
        fuera = set(exclude_ids)
        return [{"id": p["id"], "name": p["name"], "order": p["order"], "character": p.get("character")}
                for p in elenco if 0 <= p["order"] < limit and p["id"] not in fuera]

    def get_movie_credits_for_person(self, person_id, start_date, end_date):
        """Películas de la persona con release_date entre start_date y end_date (YYYY-MM-DD),
        sin documentales ni papeles de sí misma."""
        creditos = self._pedir(f"/person/{person_id}/movie_credits").get("cast", [])
        pelis = []
        for c in creditos:
            fecha = c.get("release_date")
            if not fecha or not (start_date <= fecha <= end_date):
                continue
            if GENERO_DOCUMENTAL in c.get("genre_ids", []) or _es_el_mismo(c.get("character") or ""):
                continue
            pelis.append({"id": c["id"], "title": c.get("title"), "release_date": fecha, "order": c.get("order")})
        return pelis
