import math, re
from trace import mask_for, marching, rdp, to_path, im
from PIL import Image

W, H, GROUND = 1600, 640, 612

def trace_tree(box, thr, x, width, base_y, min_area=6, eps=0.45):
    """Traces a tree silhouette and places it so its crop bottom sits at base_y - trunk extension handled by caller."""
    m, s = mask_for(box, thr)
    cs = marching(m)
    bw, bh = box[2] - box[0], box[3] - box[1]
    k = width / (bw * s)
    top_y = base_y - bh * s * k
    paths = []
    for c in cs:
        if len(c) < 10: continue
        area = abs(sum(c[i][0] * c[i-1][1] - c[i-1][0] * c[i][1] for i in range(len(c)))) / 2
        if area < min_area * s * s: continue
        if c[0] == c[-1]: c = c[:-1]
        far = max(range(len(c)), key=lambda i: (c[i][0]-c[0][0])**2 + (c[i][1]-c[0][1])**2)
        simp = rdp(c[: far + 1], eps * s)[:-1] + rdp(c[far:] + [c[0]], eps * s)[:-1]
        paths.append(to_path(simp, k, k, x, top_y))
    # dark runs in the bottom row: trunks to extend down to the ground
    px = m.load(); Wm, Hm = m.size; y = Hm - 2
    runs, start = [], None
    for xx in range(Wm):
        dark = px[xx, y] > 0
        if dark and start is None: start = xx
        if (not dark or xx == Wm - 1) and start is not None:
            end = xx; 
            if end - start >= 2 * s: runs.append((x + start * k, x + end * k))
            start = None
    return "".join(paths), runs, top_y

def keep_trunks(runs, frac):
    if not runs: return runs
    widest = max(b - a for a, b in runs)
    return [(a, b) for a, b in runs if b - a >= frac * widest]

def trunks(runs, from_y, to_y):
    """Bare trunk below the traced crown: same width at the seam, a gentle taper
    outward and a small flare at the foot."""
    d = ""
    for a, b in runs:
        w = b - a
        h = to_y - from_y
        d += (f"M{a:.1f} {from_y - 7:.1f}"
              f"C{a - w*0.02:.1f} {from_y + h*0.5:.1f} {a - w*0.06:.1f} {to_y - h*0.12:.1f} {a - w*0.22:.1f} {to_y:.1f}"
              f"L{b + w*0.22:.1f} {to_y:.1f}"
              f"C{b + w*0.06:.1f} {to_y - h*0.12:.1f} {b + w*0.02:.1f} {from_y + h*0.5:.1f} {b:.1f} {from_y - 7:.1f}Z")
    return d

def smooth(pts):
    d = f"M{pts[0][0]:.1f} {pts[0][1]:.1f}"
    for i in range(len(pts) - 1):
        p0 = pts[i-1] if i else pts[i]; p1, p2 = pts[i], pts[i+1]; p3 = pts[i+2] if i + 2 < len(pts) else p2
        d += f" C{p1[0]+(p2[0]-p0[0])/6:.1f} {p1[1]+(p2[1]-p0[1])/6:.1f} {p2[0]-(p3[0]-p1[0])/6:.1f} {p2[1]-(p3[1]-p1[1])/6:.1f} {p2[0]:.1f} {p2[1]:.1f}"
    return d

ridge = lambda x: GROUND - 70 - 26 * math.sin(x / 300 + 0.6) - 9 * math.sin(x / 83)
layers = {}
layers["hill"] = smooth([(x, ridge(x)) for x in range(-40, W + 80, 80)])
layers["ground"] = f"M0 {GROUND}L{W} {GROUND}"

# far tree (cup-shaped crown), on the ridge
d, runs, top = trace_tree((388, 272, 532, 392), 130, 80, 236, ridge(160) + 4)
layers["far"] = d; layers["far_trunk"] = trunks(keep_trunks(runs, 0.9), ridge(160) + 4, ridge(160) + 30)

# right pair, partly out of frame (hides the crop edge where it touched its neighbour)
base = GROUND - 170
d, runs, top = trace_tree((842, 222, 1106, 402), 120, 1210, 520, base)
layers["pair"] = d; layers["pair_trunk"] = trunks(keep_trunks(runs, 0.3), base, GROUND)

# main tree: the flat umbrella crown
base = GROUND - 200
d, runs, top = trace_tree((100, 315, 310, 398), 135, 440, 720, base)
layers["main"] = d; layers["main_trunk"] = trunks(keep_trunks(runs, 0.9), base, GROUND)

layers = {k: re.sub(r"-?[0-9]+[.][0-9]+", lambda m: str(round(float(m.group()))), v) for k, v in layers.items()}
import json
json.dump({"w": W, "h": H, "layers": layers}, open("scene.json", "w"))
def g(name, fill, opacity=1):
    return (f'<g fill="{fill}" opacity="{opacity}"><path fill-rule="evenodd" d="{layers[name]}"/>'
            f'<path d="{layers[name + "_trunk"]}"/></g>')
svg = [f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}"><rect width="{W}" height="{H}" fill="#f4efe6"/>',
       f'<path d="{layers["hill"]}" fill="none" stroke="#1c2616" stroke-width="1.2" opacity=".35"/>',
       g("far", "#556621", .55), g("pair", "#1c2616", .85), g("main", "#1c2616"),
       f'<path d="{layers["ground"]}" stroke="#1c2616" stroke-width="1.4"/>', "</svg>"]
open("scene.svg", "w").write("".join(svg))
print({k: len(v) for k, v in layers.items()})
