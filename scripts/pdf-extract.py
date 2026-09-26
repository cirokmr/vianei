"""Extracts a page range from a PDF and recompresses its images.

Used for material the team sends that is larger than what the site needs,
e.g. a booklet that is one chapter of a bigger publication.

  pip install pypdf pillow
  python scripts/pdf-extract.py SOURCE.pdf 175-190 data/wp-export/complementos/out.pdf

Page numbers are the PDF's own (1-based), as shown by a PDF viewer.
Images are capped at 1800px on the long side and re-encoded as JPEG q72;
text and vector graphics are untouched.
"""

import os
import sys

from pypdf import PdfReader, PdfWriter


def main(src: str, pages: str, out: str) -> None:
    first, last = (int(n) for n in pages.split("-"))
    reader = PdfReader(src)
    if not 1 <= first <= last <= len(reader.pages):
        sys.exit(f"intervalo {pages} fora do documento (1-{len(reader.pages)})")

    writer = PdfWriter()
    for index in range(first - 1, last):
        writer.add_page(reader.pages[index])

    for page in writer.pages:
        for image in page.images:
            img = image.image
            if img.mode not in ("RGB", "L"):
                img = img.convert("RGB")
            img.thumbnail((1800, 1800))
            image.replace(img, quality=72)

    writer.compress_identical_objects(remove_duplicates=True, remove_unreferenced=True)
    writer.write(out)
    print(f"{out}: páginas {first}-{last}, {os.path.getsize(src) // 1024} KB → {os.path.getsize(out) // 1024} KB")


if __name__ == "__main__":
    main(*sys.argv[1:4])
