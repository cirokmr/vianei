"""Builds the trimmed web fonts in src/fonts/.

Google Fonts ships each family as a full variable font (latin subset):
Fraunces ~118 KB, Inter Tight ~44 KB. We only need part of the design space
and the glyphs Portuguese uses, so we instance and subset them:

  fraunces-display.woff2  opsz pinned at 72, wght 300–500, SOFT kept   (~40 KB)
  inter-tight.woff2       wght 400–600                                  (~20 KB)

opsz 72 (not 144): at the largest optical size the hairlines of a light
weight vanish and "e" reads as "c" at headline sizes.

Usage:
  pip install fonttools brotli
  python scripts/build-fonts.py fraunces path/to/Fraunces-latin.woff2
  python scripts/build-fonts.py inter    path/to/InterTight-latin.woff2

Sources (take the `latin` block's woff2 URL from the CSS):
  https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght,SOFT@9..144,100..900,0..100
  https://fonts.googleapis.com/css2?family=Inter+Tight:wght@100..900
Both families are licensed under the SIL Open Font License 1.1.
"""

import sys

from fontTools import subset
from fontTools.ttLib import TTFont
from fontTools.varLib import instancer

FONTS = {
    "fraunces": ("src/fonts/fraunces-display.woff2", {"opsz": 72, "wght": (300, 500)}),
    "inter": ("src/fonts/inter-tight.woff2", {"wght": (400, 600)}),
}

TEXT = "".join(chr(c) for c in range(0x20, 0x7F)) + (
    "ÀÁÂÃÇÉÊÍÓÔÕÚÜàáâãçéêíóôõúü–—‘’“”…·•©®°ªº€→←↓↑×"
)


def build(name: str, src: str) -> None:
    out, limits = FONTS[name]
    font = TTFont(src)

    # Subset first: some Google Fonts builds omit gvar data for .notdef,
    # which trips the subsetter if the font was instanced beforehand.
    options = subset.Options()
    options.flavor = "woff2"
    options.layout_features = ["kern", "liga", "calt", "ccmp", "locl", "mark", "mkmk", "tnum"]
    options.name_IDs = ["*"]
    options.notdef_outline = True

    subsetter = subset.Subsetter(options)
    subsetter.populate(text=TEXT)
    subsetter.subset(font)

    font = instancer.instantiateVariableFont(font, limits)
    font.flavor = "woff2"
    font.save(out)
    print(f"wrote {out}")


if __name__ == "__main__":
    build(sys.argv[1], sys.argv[2])
