// Diapositivas de la entrega individual — estilo Nordic Minimalism.
//   python presentacion/formulas.py
//   node presentacion/generar_presentacion.js   -> presentacion/presentacion.pptx
const fs = require("fs");
const path = require("path");
const pptxgen = require("pptxgenjs");

const AQUI = __dirname;
const figura = (f) => path.join(AQUI, "..", "figuras", f);
const ecuacion = (f) => path.join(AQUI, "formulas", f + ".png");

const C = { fondo: "F4F1EC", forma: "D9CFC4", texto: "3D3530", taupe: "8A7A6A", linea: "CFC4B8" };
const SERIF = "Georgia", SANS = "Arial", MONO = "Courier New";
const M = 0.8, AN = 13.333 - 2 * M;

const p = new pptxgen();
p.layout = "LAYOUT_WIDE";
p.title = "Laurence Fishburne: grafo de colaboración";
p.author = "Nohel Estrada";
p.theme = { headFontFace: SERIF, bodyFontFace: SANS };

p.defineSlideMaster({
  title: "NORDICO",
  background: { color: C.fondo },
  objects: [
    // tres puntos en tonos marrones (arriba a la izquierda)
    { rect: { x: M, y: 0.42, w: 0.11, h: 0.11, fill: { color: C.texto }, line: { color: C.texto } } },
    { rect: { x: M + 0.2, y: 0.42, w: 0.11, h: 0.11, fill: { color: C.taupe }, line: { color: C.taupe } } },
    { rect: { x: M + 0.4, y: 0.42, w: 0.11, h: 0.11, fill: { color: C.forma }, line: { color: C.forma } } },
    { line: { x: M, y: 6.82, w: AN, h: 0, line: { color: C.linea, width: 0.75 } } },
    { text: { text: "LAURENCE FISHBURNE · GRAFO DE COLABORACIÓN · NOHEL ESTRADA",
              options: { x: M, y: 6.92, w: 9, h: 0.25, fontFace: MONO, fontSize: 8.5, color: C.taupe, charSpacing: 5, margin: 0 } } },
    { placeholder: { options: { name: "title", type: "title", x: M, y: 0.75, w: AN, h: 0.85, fontFace: SERIF, fontSize: 32,
                                color: C.texto, margin: 0, valign: "middle", align: "left" }, text: "" } },
  ],
  slideNumber: { x: 12.0, y: 6.92, w: 0.5, h: 0.25, fontFace: MONO, fontSize: 9, color: C.taupe, align: "right" },
});

// mancha orgánica de fondo: dos óvalos grandes y muy transparentes
function mancha(s, x, y) {
  s.addShape(p.shapes.OVAL, { x, y, w: 5.2, h: 3.9, fill: { color: C.forma, transparency: 62 }, line: { type: "none" }, rotate: -18 });
  s.addShape(p.shapes.OVAL, { x: x + 1.4, y: y + 1.1, w: 3.6, h: 3.0, fill: { color: C.forma, transparency: 72 }, line: { type: "none" }, rotate: 24 });
}

function diapositiva(titulo, notas, conMancha = false) {
  const s = p.addSlide({ masterName: "NORDICO" });
  if (conMancha) mancha(s, 8.6, 3.2);
  s.addText(titulo, { placeholder: "title" });
  if (notas) s.addNotes(notas);
  return s;
}

const texto = (s, t, x, y, w, h, o = {}) => s.addText(t, { x, y, w, h, fontFace: SANS, fontSize: o.fs || 14, color: o.color || C.texto,
  bold: !!o.bold, italic: !!o.italic, valign: "top", margin: 0, isTextBox: true, align: o.align || "left" });
const rotulo = (s, t, x, y, w) => s.addText(t.toUpperCase(), { x, y, w, h: 0.25, fontFace: MONO, fontSize: 9, color: C.taupe,
  charSpacing: 5, margin: 0, isTextBox: true });

function lista(s, items, x, y, w, h, fs = 14) {
  s.addText(items.map((t, i) => ({ text: t, options: { bullet: { indent: 14 }, breakLine: i < items.length - 1, paraSpaceAfter: 8 } })),
    { x, y, w, h, fontFace: SANS, fontSize: fs, color: C.texto, valign: "top", margin: 0, isTextBox: true });
}

function numero(s, valor, pie, x, y, w) {
  s.addText(valor, { x, y, w, h: 0.9, fontFace: SERIF, fontSize: 44, color: C.texto, margin: 0, isTextBox: true });
  texto(s, pie, x, y + 0.92, w, 0.7, { fs: 12, color: C.taupe });
}

function eq(s, nombre, x, y, wMax, escala = 0.72) {
  const b = fs.readFileSync(ecuacion(nombre));
  let w = (b.readUInt32BE(16) / 200) * escala, h = (b.readUInt32BE(20) / 200) * escala;
  if (w > wMax) { h *= wMax / w; w = wMax; }
  s.addImage({ path: ecuacion(nombre), x, y, w, h, altText: nombre });
  return y + h;
}

function foto(s, archivo, x, y, wMax, hMax) {
  const b = fs.readFileSync(figura(archivo));
  const r = b.readUInt32BE(16) / b.readUInt32BE(20);
  let w = wMax, h = w / r;
  if (h > hMax) { h = hMax; w = h * r; }
  s.addImage({ path: figura(archivo), x, y, w, h });
  return { w, h };
}

function cuadro(s, filas, x, y, w, anchos, fs = 13) {
  s.addTable(filas.map((f, i) => f.map((c) => ({ text: String(c), options: {
    fontFace: i === 0 ? MONO : SANS, fontSize: i === 0 ? 9 : fs, color: i === 0 ? C.taupe : C.texto, charSpacing: i === 0 ? 3 : 0,
    margin: [5, 6, 5, 0], valign: "middle",
    border: [{ type: "none" }, { type: "none" }, { pt: 0.75, color: i === 0 ? C.taupe : C.linea }, { type: "none" }] } }))),
    { x, y, w, colW: anchos, rowH: 0.4 });
}

// ------------------------------------------------------------------------------------------------ diapositivas
// 1 · portada
{
  const s = p.addSlide({ masterName: "NORDICO" });
  mancha(s, 7.4, 2.4);
  rotulo(s, "Análisis y Ciencia de Datos · Entrega individual", M, 1.5, 10);
  s.addText("Laurence Fishburne y sus colaboradores", { x: M, y: 1.9, w: 10.5, h: 1.8, fontFace: SERIF, fontSize: 46,
    color: C.texto, margin: 0, valign: "top", isTextBox: true });
  texto(s, "Un grafo visto como kernel: de los créditos de TMDB al espectro del Laplaciano", M, 3.75, 9, 0.6, { fs: 17, color: C.taupe });
  texto(s, "Nohel Estrada", M, 5.0, 6, 0.4, { fs: 16 });
  texto(s, "Universidad del Istmo de Guatemala · 6 de noviembre de 2026", M, 5.4, 9, 0.4, { fs: 13, color: C.taupe });
}

// 2 · kernel
{
  const s = diapositiva("La idea: A = BBᵀ es un kernel",
    "B es actores por películas. A = BBᵀ cuenta películas compartidas. En el bosque de la parte grupal dos filas se parecen si caen en las mismas hojas; aquí dos actores se parecen si salen en las mismas películas. Cada película es una hoja.", true);
  let y = eq(s, "B", M, 1.95, AN);
  y = eq(s, "A", M, y + 0.3, AN);
  y = eq(s, "bosque", M, y + 0.35, AN);
  texto(s, "Bosque: filas que caen en la misma hoja.  Grafo: actores que salen en la misma película.",
    M, y + 0.45, 7.2, 0.9, { fs: 15, italic: true });
}

// 3 · construcción
{
  const s = diapositiva("Construcción del grafo (I.4)",
    "Cuenta una película si salió entre 1975 y 2025 y el actor tiene order menor que 5. Se agrega la semilla, el elenco principal de cada película suya, y luego las aristas: una por película y por pareja entre nodos del grafo.");
  numero(s, "231", "actores en el grafo", M, 1.9, 2.7);
  numero(s, "1 187", "aristas (películas compartidas)", M + 2.95, 1.9, 2.7);
  numero(s, "230", "grado de Fishburne, la semilla", M + 5.9, 1.9, 2.7);
  numero(s, "297", "respuestas del API en cache (JSON)", M + 8.85, 1.9, 2.7);
  rotulo(s, "Reglas", M, 3.9, 5.5);
  lista(s, ["limit = 5 y ventana 1975-01-01 a 2025-12-31", "(a) semilla · (b) elenco con order < 5 · (c) aristas desde los créditos",
            "Una arista por película y por pareja; no se agregan nodos en (c)", "Sin documentales (género 99) ni papeles de sí mismo"],
    M, 4.25, 5.6, 2.4, 13.5);
  rotulo(s, "Mayor grado", 6.9, 3.9, 5);
  cuadro(s, [["Actor", "Grado", "Ponderado"], ["Laurence Fishburne", 230, 252], ["Keanu Reeves", 27, 44], ["Angela Bassett", 27, 31],
             ["Andy Garcia", 25, 28], ["Kevin Bacon", 24, 27]], 6.9, 4.25, 5.6, [3.0, 1.2, 1.4]);
}

// 4 · código
{
  const s = diapositiva("Graph y TMDBAPIUtils (I.2 – I.3)",
    "Graph usa una lista de adyacencia: adj[a][b] = peso; al agregar (a,b) se actualizan las dos entradas, así (a,b) y (b,a) son la misma arista. TMDBAPIUtils guarda cada respuesta en un JSON y la lee de ahí; con el cache el notebook corre sin API key.", true);
  rotulo(s, "graph.py", M, 1.95, 5.5);
  lista(s, ["Lista de adyacencia: adj[a][b] = peso", "add_node((id, nombre)) ignora id repetidos",
            "add_edge(a, b) actualiza adj[a][b] y adj[b][a]", "total_edges = Σ |vecinos| / 2",
            "max_degree_nodes: todos los empatados", "adjacency(): matriz A y orden de los id"], M, 2.3, 5.4, 3.8, 14);
  rotulo(s, "tmdb_api.py", 6.7, 1.95, 5.5);
  lista(s, ["Una sesión de requests y un JSON por respuesta en cache/", "get_movie_cast: 0 ≤ order < limit, sin exclude_ids",
            "get_movie_credits_for_person: filtro de fechas propio", "Fuera documentales y papeles de “Himself / Self”",
            "API key solo por variable de entorno"], 6.7, 2.3, 5.2, 3.8, 14);
}

// 5 · figura
{
  const s = diapositiva("El grafo (I.5)",
    "Kamada–Kawai. Rojo: la semilla. Tamaño por grado; grosor por películas en común. Se ve el grupo denso de Matrix cerca del centro.");
  const { w } = foto(s, "grafo_fishburne.png", M, 1.75, 7.2, 4.95);
  lista(s, ["Rojo: Laurence Fishburne", "Tamaño: grado", "Grosor de la arista: películas en común",
            "Kamada–Kawai acerca a los que comparten más"], M + w + 0.4, 2.0, AN - w - 0.4, 3, 14);
}

// 6 · laplacianos
{
  const s = diapositiva("Laplacianos y componentes (I.6 a)",
    "La forma cuadrática vᵀLv es suma de A_ab(v_a − v_b)², así que es cero solo si v es constante en cada componente: hay un valor propio 0 por componente. Para un aislado, poner 0 en D^(-1/2) deja un 1 en la diagonal de L_sym (valor propio 1); por eso usamos D^(-1/2) L D^(-1/2). En este grafo no hay aislados ni con ni sin la semilla.");
  let y = eq(s, "L", M, 1.9, AN);
  y = eq(s, "Lsym", M, y + 0.22, AN);
  y = eq(s, "cuadratica", M, y + 0.22, AN);
  y = eq(s, "convencion", M, y + 0.22, AN);
  cuadro(s, [["Grafo", "BFS", "λ < 1e-8", "Aislados", "networkx"], ["Con la semilla", 1, 1, 0, 1], ["Sin la semilla", 1, 1, 0, 1]],
    M, y + 0.35, 7.5, [2.3, 1.2, 1.4, 1.3, 1.3]);
  texto(s, "Todos los coprotagonistas comparten otra película con alguien del grafo: quitar a Fishburne no deja a nadie suelto.",
    8.6, y + 0.4, 3.9, 1.4, { fs: 13, italic: true });
}

// 7 · brecha
{
  const s = diapositiva("Brecha espectral (I.6 b)",
    "Con la semilla λ2 = 0.282 y la mayor brecha está en k = 1: conexo y sin separación clara. Sin la semilla λ2 cae a 0.062: quitar el hub muestra lo débil de la unión entre grupos. La semilla mantiene todo conexo por construcción, pero L_sym divide cada arista entre la raíz de los grados y sus aristas pesan poco.");
  const { w, h } = foto(s, "valores_propios.png", M, 1.75, 7.0, 4.2);
  eq(s, "brecha", M, 1.75 + h + 0.15, 7.0);
  const x = M + w + 0.5;
  numero(s, "0.282", "λ₂ con la semilla (mayor brecha: k = 1)", x, 1.9, AN - w - 0.5);
  numero(s, "0.062", "λ₂ sin la semilla (mayor brecha: k = 2)", x, 3.6, AN - w - 0.5);
  texto(s, "Para agrupar usamos la siguiente brecha: k = 4.", x, 5.3, AN - w - 0.5, 0.6, { fs: 13, italic: true });
}

// 8 · comunidades
{
  const s = diapositiva("Clustering espectral (I.6 c): k = 4",
    "Ng–Jordan–Weiss: los k vectores propios de los valores propios más pequeños, filas a norma 1 y k-means. Las comunidades corresponden a una franquicia (Matrix), una época (los 70 y 80), el cine afroamericano de los 90 y 2000 y los thrillers de Hollywood.");
  const y = eq(s, "njw", M, 1.85, AN);
  cuadro(s, [["n", "Actores de mayor grado", "Películas más repetidas", "¿Qué es?"],
             [62, "Fishburne · Keanu Reeves · Nicolas Cage", "Matrix Reloaded · Matrix Revolutions · Osmosis Jones", "Franquicia"],
             [98, "Andy Garcia · Kevin Bacon · Sam Neill", "All the King's Men · Bobby Z · Passengers", "Thrillers y dramas"],
             [53, "Angela Bassett · Wesley Snipes · Blair Underwood", "What's Love Got to Do with It · Akeelah and the Bee", "Cine afroamericano 90–2000"],
             [18, "Alfre Woodard · Clarence Williams III · Jeff Goldblum", "Cornbread, Earl and Me (1975) · For Us, the Living (1983)", "Su primera época"]],
    M, y + 0.35, AN, [0.6, 3.9, 4.6, 2.63], 12.5);
}

// 9 · figura de comunidades
{
  const s = diapositiva("Las comunidades en el grafo",
    "Mismo layout que la figura del grafo, coloreado por comunidad.");
  const { w } = foto(s, "comunidades_fishburne.png", M, 1.75, 7.2, 4.95);
  texto(s, "Cada color es una de las 4 comunidades de la tabla anterior; todas se tocan a través de Fishburne (el nodo más grande).",
    M + w + 0.4, 2.0, AN - w - 0.4, 2, { fs: 15, italic: true });
}

// 10 · Fiedler
{
  const s = diapositiva("Vector de Fiedler (I.6 d): una periferia",
    "Sin la semilla, en la componente más grande (230 actores), el signo del vector de λ2 separa 15 actores de 215. El lado pequeño es el elenco de Red Heat, The Signal y un especial de Pee-wee. Solo 44 de 957 aristas cruzan. Fiedler minimiza el corte relativo al tamaño de cada lado: aísla al grupo menos conectado, no parte en mitades.", true);
  const y = eq(s, "fiedler", M, 1.9, AN);
  numero(s, "15", "lado positivo: Schwarzenegger, Jim Belushi, Peter Boyle (Red Heat, The Signal)", M, y + 0.4, 3.6);
  numero(s, "215", "lado negativo: Reeves, Bassett, Garcia, Bacon (Matrix, Mystic River)", M + 3.9, y + 0.4, 3.6);
  numero(s, "44 / 957", "aristas que cruzan el corte (4.6 %)", M + 7.8, y + 0.4, 3.6);
}

// 11 · centralidad
{
  const s = diapositiva("Centralidad (I.6 e): grado contra vector propio",
    "Comparten 3 de 5. El grado mide cuántos colaboradores distintos; el vector propio mide qué tan importantes son y cuántas películas comparte con ellos. Carrie-Anne Moss y Hugo Weaving entran por la trilogía de Matrix con Fishburne y Reeves.");
  const y = eq(s, "centralidad", M, 1.85, AN);
  cuadro(s, [["#", "Por grado", "Por vector propio"], [1, "Laurence Fishburne (230)", "Laurence Fishburne (1.000)"],
             [2, "Keanu Reeves (27)", "Keanu Reeves (0.483)"], [3, "Angela Bassett (27)", "Carrie-Anne Moss (0.304)"],
             [4, "Andy Garcia (25)", "Hugo Weaving (0.273)"], [5, "Kevin Bacon (24)", "Angela Bassett (0.255)"]],
    M, y + 0.35, 7.4, [0.5, 3.4, 3.5], 13.5);
  lista(s, ["Grado: cuántos contactos", "Vector propio: qué tan importantes son y cuánto se repiten (pesos)",
            "Verificado con networkx: correlación 1.0"], 8.6, y + 0.4, 3.9, 3, 13.5);
}

// 12 · puente
{
  const s = diapositiva("El puente (I.7): BBᵀ = A fuera de la diagonal",
    "B es 231 por 6 659. BBᵀ coincide con A fuera de la diagonal. En la diagonal está el número de películas que cuentan para cada actor. Analogía: cada película es una hoja; el bosque normaliza por el tamaño de la hoja y aquí L_sym normaliza por los grados.", true);
  let y = eq(s, "A", M, 1.9, AN);
  y = eq(s, "diag", M, y + 0.25, AN);
  numero(s, "231 × 6 659", "B: actores × películas", M, y + 0.45, 3.9);
  numero(s, "152", "mayor diagonal: Danny Trejo (Cage 107, Martin Sheen 103)", M + 4.3, y + 0.45, 3.9);
  texto(s, "Mismo kernel que el bosque: se parecen quienes comparten hojas (películas). El espectro marca dónde la conexión es débil.",
    M, y + 2.25, 7.6, 0.9, { fs: 14, italic: true });
}

// 13 · cierre
{
  const s = p.addSlide({ masterName: "NORDICO" });
  mancha(s, 7.4, 2.4);
  rotulo(s, "Para cerrar", M, 1.3, 6);
  s.addText("Gracias", { x: M, y: 1.65, w: 8, h: 1.1, fontFace: SERIF, fontSize: 52, color: C.texto, margin: 0, isTextBox: true });
  lista(s, ["A = BBᵀ: el grafo de colaboración es el kernel de un “bosque” de películas",
            "El grafo es conexo con y sin la semilla, pero λ₂ cae de 0.28 a 0.06 al quitarla",
            "Comunidades reales: Matrix, su primera época, cine afroamericano, thrillers",
            "Fiedler aísla la periferia (Red Heat); el vector propio premia a quien repite películas"],
    M, 3.0, 8.5, 2.6, 15);
}

p.writeFile({ fileName: path.join(AQUI, "presentacion.pptx") }).then((f) => console.log(f));
