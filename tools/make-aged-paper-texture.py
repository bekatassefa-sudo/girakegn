"""Seamless aged-paper texture (pure Pillow). Everything is built on a torus
(3x3 tiling before blur/resize, then the centre is cropped) so the tile repeats invisibly."""
import random, sys
from PIL import Image, ImageChops, ImageDraw, ImageFilter

S = 1024
random.seed(19720)  # 1972 E.C. :)

def seamless_resize(small, size=S):
    w = small.size[0]
    big = Image.new("L", (w * 3, w * 3))
    for i in range(3):
        for j in range(3):
            big.paste(small, (i * w, j * w))
    big = big.resize((size * 3, size * 3), Image.BICUBIC)
    return big.crop((size, size, size * 2, size * 2))

def seamless_blur(img, r):
    w = img.size[0]
    big = Image.new(img.mode, (w * 3, w * 3))
    for i in range(3):
        for j in range(3):
            big.paste(img, (i * w, j * w))
    return big.filter(ImageFilter.GaussianBlur(r)).crop((w, w, w * 2, w * 2))

def octave(cells, sigma=64):
    return seamless_resize(Image.effect_noise((cells, cells), sigma).convert("L"))

def stretch(img, lo, hi):
    lo_v, hi_v = img.getextrema()
    span = max(1, hi_v - lo_v)
    return img.point(lambda v: int(lo + (v - lo_v) * (hi - lo) / span))

# 1) mottling: several octaves of smooth noise
mottle = octave(5)
for cells, w in ((10, .45), (24, .4), (60, .38), (150, .34), (320, .28)):
    mottle = Image.blend(mottle, octave(cells), w)
mottle = stretch(mottle, 100, 180)

# 2) grime blotches: where a mid-frequency field is dark, add rough crackle and darken
field = stretch(Image.blend(Image.blend(octave(7), octave(18), .5), octave(60), .3), 0, 255)
mask = field.point(lambda v: 210 if v < 85 else (int((115 - v) / 30 * 210) if v < 115 else 0))
mask = seamless_blur(mask, 2.5)
crackle = stretch(octave(380, 100), 0, 255).point(lambda v: 255 - v if v > 128 else v * 2)
grime = ImageChops.multiply(mottle, stretch(crackle, 95, 255))
mottle = Image.composite(stretch(grime, 60, 160), mottle, mask)
# fine pitting everywhere (the emblem paper is pitted all over, not just in blotches)
pits = stretch(octave(420, 110), 0, 255).point(lambda v: 160 if v < 40 else 255)
mottle = ImageChops.multiply(mottle, seamless_blur(pits, .6))

# 3) foxing: clusters of small brown specks
fox = Image.new("L", (S, S), 255)
d = ImageDraw.Draw(fox)
for _ in range(70):
    cx, cy = random.randrange(S), random.randrange(S)
    for _ in range(random.randint(6, 40)):
        x = (cx + random.gauss(0, 26)) % S; y = (cy + random.gauss(0, 26)) % S
        r = random.choice((1, 1, 1.5, 2, 2.5, 3.5))
        d.ellipse((x - r, y - r, x + r, y + r), fill=random.randint(60, 150))
fox = seamless_blur(fox, .7)
mottle = ImageChops.multiply(mottle, fox)

# 4) a few water-stain rings
rings = Image.new("L", (S, S), 255)
d = ImageDraw.Draw(rings)
for _ in range(4):
    cx, cy, rr = random.randrange(S), random.randrange(S), random.randint(60, 170)
    for dx in (-S, 0, S):
        for dy in (-S, 0, S):
            d.ellipse((cx + dx - rr, cy + dy - rr * .8, cx + dx + rr, cy + dy + rr * .8), outline=165, width=3)
rings = seamless_blur(rings, 3.5)
mottle = ImageChops.multiply(mottle, rings)

# 5) faint creases: wandering lighter lines with a dark edge
crease = Image.new("L", (S, S), 0)
d = ImageDraw.Draw(crease)
for _ in range(5):
    x, y = random.randrange(S), random.randrange(S)
    ang = random.uniform(0, 6.283)
    import math
    pts = []
    for step in range(120):
        ang += random.gauss(0, .08)
        x += math.cos(ang) * 9; y += math.sin(ang) * 9
        pts.append((x % S, y % S))
    for a, b in zip(pts, pts[1:]):
        if abs(a[0] - b[0]) < 50 and abs(a[1] - b[1]) < 50:
            d.line([a, b], fill=random.randint(50, 90), width=2)
crease = seamless_blur(crease, 1.1)
mottle = ImageChops.add(mottle, crease)

# 6) fine paper grain
grain = stretch(Image.effect_noise((S, S), 40).convert("L"), 205, 255)
mottle = ImageChops.multiply(mottle, grain)

# colour: map grey → a warm umber ramp (dark grime → worn tan), then lighten by `lift`
lift = float(sys.argv[1]) if len(sys.argv) > 1 else 0.62   # site uses 0.62
stops = [(0, (24, 16, 10)), (70, (48, 34, 23)), (130, (72, 53, 37)), (190, (98, 74, 51)), (255, (128, 99, 70))]
def ramp(ch):
    lut = []
    for v in range(256):
        for (a, ca), (b, cb) in zip(stops, stops[1:]):
            if a <= v <= b:
                t = (v - a) / (b - a); lut.append(min(255, int((ca[ch] + (cb[ch] - ca[ch]) * t) * lift))); break
    return lut
L = mottle
rgb = Image.merge("RGB", [L.point(ramp(0)), L.point(ramp(1)), L.point(ramp(2))])
out = sys.argv[2] if len(sys.argv) > 2 else "aged.png"
rgb.save(out)
px = list(rgb.resize((64, 64)).get_flattened_data()) if hasattr(rgb, "get_flattened_data") else list(rgb.resize((64, 64)).getdata())
print("average colour #%02x%02x%02x" % tuple(sum(p[i] for p in px) // len(px) for i in range(3)))
