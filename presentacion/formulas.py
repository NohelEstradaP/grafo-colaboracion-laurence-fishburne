"""Genera las fórmulas de las diapositivas (PNG con mathtext) en presentacion/formulas/."""
from pathlib import Path

import matplotlib

matplotlib.use("Agg")
import matplotlib.pyplot as plt  # noqa: E402

plt.rcParams["mathtext.fontset"] = "cm"
COLOR = "#3D3530"  # marrón cálido del estilo Nordic
SALIDA = Path(__file__).resolve().parent / "formulas"
T = r"^{\mathsf{T}}"

FORMULAS = {
    "B": r"B_{am}=\mathbf{1}\{\mathrm{el\ actor\ }a\mathrm{\ sale\ en\ la\ pel\acute{\i}cula\ }m\}",
    "A": rf"A=BB{T}\ \ \mathrm{{(fuera\ de\ la\ diagonal)}},\qquad A_{{ab}}=\sum_m B_{{am}}B_{{bm}}",
    "diag": rf"(BB{T})_{{aa}}=\sum_m B_{{am}}^2=\#\,\mathrm{{pel\acute{{\i}}culas\ que\ cuentan\ para\ }}a",
    "L": r"L=D-A,\qquad D=\mathrm{diag}(d_1,\dots,d_n),\qquad d_a=\sum_b A_{ab}",
    "Lsym": r"L_{\mathrm{sym}}=I-D^{-1/2}AD^{-1/2}",
    "cuadratica": rf"v{T}Lv=\dfrac{{1}}{{2}}\sum_{{a,b}}A_{{ab}}(v_a-v_b)^2\ \geq\ 0",
    "convencion": r"d_a=0:\quad D^{-1/2}_{aa}:=0\ \ \mathrm{y}\ \ L_{\mathrm{sym}}=D^{-1/2}LD^{-1/2}"
                  r"\ \Rightarrow\ \lambda=0\ \mathrm{para\ el\ aislado}",
    "componentes": r"\#\,\mathrm{componentes}=\#\{k:\ \lambda_k(L_{\mathrm{sym}})<10^{-8}\}",
    "brecha": r"k^{*}=\arg\max_{1\leq k\leq 14}\ (\lambda_{k+1}-\lambda_k)",
    "njw": r"U=[v_1,\dots,v_k]\in\mathbb{R}^{n\times k},\quad u_a\leftarrow\dfrac{u_a}{\|u_a\|},\quad"
           r"k\mathrm{-means\ sobre\ las\ filas\ }u_a",
    "fiedler": r"L_{\mathrm{sym}}v_2=\lambda_2v_2,\qquad S^{+}=\{a:\ v_{2a}\geq 0\},\quad S^{-}=\{a:\ v_{2a}<0\}",
    "centralidad": r"A\,v=\lambda_{\max}\,v,\qquad c_a=\dfrac{|v_a|}{\max_b |v_b|}",
    "bosque": rf"S=\dfrac{{1}}{{T}}\sum_{{t=1}}^{{T}}Z_t\,\mathrm{{diag}}\!\left(\dfrac{{1}}{{|L|}}\right)Z_t{T}"
              rf"\quad\longleftrightarrow\quad A=BB{T}",
}


def main():
    SALIDA.mkdir(exist_ok=True)
    for nombre, tex in FORMULAS.items():
        fig = plt.figure(figsize=(0.01, 0.01))
        fig.text(0, 0, f"${tex}$", fontsize=26, color=COLOR)
        fig.savefig(SALIDA / f"{nombre}.png", dpi=200, transparent=True, bbox_inches="tight", pad_inches=0.04)
        plt.close(fig)
    print(f"{len(FORMULAS)} fórmulas en {SALIDA}")


if __name__ == "__main__":
    main()
