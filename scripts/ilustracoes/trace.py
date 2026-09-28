"""Trace real araucária silhouettes from the caminhada photo into SVG contours (pure Python + PIL)."""
import json, math, os, sys
from PIL import Image, ImageFilter, ImageOps

SRC = os.path.join(os.path.dirname(__file__), "../../public/fotos/caminhada.webp")
im = Image.open(SRC).convert("L")

def mask_for(box, thr, scale=4, blur=0.45):
    crop = im.crop(box)
    w, h = crop.size
    big = crop.resize((w * scale, h * scale), Image.LANCZOS).filter(ImageFilter.GaussianBlur(blur * scale / 2))
    # 1 = tree (dark), 0 = sky
    return big.point(lambda v: 255 if v < thr else 0), scale

def marching(mask):
    W, H = mask.size
    px = mask.load()
    g = lambda x, y: 1 if 0 <= x < W and 0 <= y < H and px[x, y] else 0
    segs = {}
    # edges keyed by start point, cell corners at integer coords, points at midpoints
    for y in range(-1, H):
        for x in range(-1, W):
            a, b, c, d = g(x, y), g(x + 1, y), g(x + 1, y + 1), g(x, y + 1)
            idx = a * 8 + b * 4 + c * 2 + d
            if idx in (0, 15):
                continue
            T = (x + 0.5, y); R = (x + 1, y + 0.5); B = (x + 0.5, y + 1); L = (x, y + 0.5)
            table = {1: [(L, B)], 2: [(B, R)], 3: [(L, R)], 4: [(R, T)], 5: [(L, T), (R, B)], 6: [(B, T)], 7: [(L, T)],
                     8: [(T, L)], 9: [(T, B)], 10: [(T, R), (B, L)], 11: [(T, R)], 12: [(R, L)], 13: [(R, B)], 14: [(B, L)]}
            for s, e in table[idx]:
                segs.setdefault(s, []).append(e)
    contours = []
    while segs:
        start = next(iter(segs))
        path = [start]; cur = start
        while cur in segs:
            nxt = segs[cur].pop()
            if not segs[cur]: del segs[cur]
            path.append(nxt); cur = nxt
            if cur == start: break
        contours.append(path)
    return contours

def rdp(pts, eps):
    if len(pts) < 3: return pts
    (x1, y1), (x2, y2) = pts[0], pts[-1]
    dx, dy = x2 - x1, y2 - y1; n = math.hypot(dx, dy) or 1e-9
    dmax, idx = 0, 0
    for i in range(1, len(pts) - 1):
        d = abs(dy * pts[i][0] - dx * pts[i][1] + x2 * y1 - y2 * x1) / n
        if d > dmax: dmax, idx = d, i
    if dmax > eps:
        return rdp(pts[: idx + 1], eps)[:-1] + rdp(pts[idx:], eps)
    return [pts[0], pts[-1]]

def to_path(pts, sx, sy, ox, oy):
    P = [(ox + x * sx, oy + y * sy) for x, y in pts]
    if len(P) < 3: return ""
    # smooth closed curve through midpoints (quadratic)
    d = []
    mid = lambda a, b: ((a[0] + b[0]) / 2, (a[1] + b[1]) / 2)
    m0 = mid(P[-1], P[0])
    d.append(f"M{m0[0]:.1f} {m0[1]:.1f}")
    for i in range(len(P)):
        p, q = P[i], P[(i + 1) % len(P)]
        m = mid(p, q)
        d.append(f"Q{p[0]:.1f} {p[1]:.1f} {m[0]:.1f} {m[1]:.1f}")
    return "".join(d) + "Z"

def trace(box, thr, dest, min_area=6, eps=0.45):
    """box in photo px; dest=(x, y, width) in illustration units for the box."""
    m, s = mask_for(box, thr)
    cs = marching(m)
    bw = box[2] - box[0]
    k = dest[2] / (bw * s)
    out = []
    for c in cs:
        if len(c) < 12: continue
        area = abs(sum(c[i][0] * c[i - 1][1] - c[i - 1][0] * c[i][1] for i in range(len(c)))) / 2
        if area < min_area * s * s: continue
        if c[0] == c[-1]: c = c[:-1]
        # closed loop: split at the point farthest from the start, simplify both halves
        far = max(range(len(c)), key=lambda i: (c[i][0]-c[0][0])**2 + (c[i][1]-c[0][1])**2)
        simp = rdp(c[: far + 1], eps * s)[:-1] + rdp(c[far:] + [c[0]], eps * s)[:-1]
        out.append((area, to_path(simp, k, k, dest[0], dest[1])))
    out.sort(key=lambda t: -t[0])
    return [p for _, p in out]

if __name__ == "__main__":
    box = tuple(int(v) for v in sys.argv[1].split(","))
    thr = int(sys.argv[2])
    paths = trace(box, thr, (0, 0, 800))
    bw, bh = box[2] - box[0], box[3] - box[1]
    H = 800 * bh / bw
    svg = f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 {H:.0f}" fill="#1c2616" fill-rule="evenodd" stroke="none"><rect width="800" height="{H:.0f}" fill="#f4efe6" stroke="none"/>' + f'<path d="{"".join(paths)}"/>'  + "</svg>"
    open(sys.argv[3], "w").write(svg)
    print(len(paths), "contours", sum(len(p) for p in paths), "chars")
