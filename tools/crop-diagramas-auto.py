#!/usr/bin/env python3
"""Recorta diagramas Playmaker X detectando as barras de cabeçalho (caixa escura do número).
Uso: crop-diagramas-auto.py FONTE.pdf HEADERS.txt SAIDA_DIR [--dpi 200]
HEADERS.txt: linhas 'pP:linha:N chamada' (pdftotext -raw), na ordem do PDF; dá o número de cada cabeçalho detectado.
Gera verify-headers-*.png (recorte do cabeçalho + número esperado) para verificação visual."""
import sys, os, re, subprocess, tempfile, hashlib, json
from PIL import Image, ImageChops, ImageDraw
src, hdr, out = sys.argv[1:4]; dpi = int(sys.argv[sys.argv.index('--dpi')+1]) if '--dpi' in sys.argv else 200
print('fonte sha256', hashlib.sha256(open(src, 'rb').read()).hexdigest())
exp = {}
for l in open(hdr):
    m = re.match(r'p(\d+):\d+:(\d+) (.+)', l.strip())
    if m and not re.match(r'(Step|PSR)\b', m.group(3)): exp.setdefault(int(m.group(1)), []).append((int(m.group(2)), m.group(3)))
tmp = tempfile.mkdtemp(); subprocess.run(['pdftoppm', '-r', str(dpi), '-png', src, f'{tmp}/p'], check=True)
os.makedirs(out, exist_ok=True); hs = []; smap = {}
for i, f in enumerate(sorted(os.listdir(tmp)), 1):
    im = Image.open(f'{tmp}/{f}').convert('RGB'); W, H = im.size; g = im.convert('L'); px = g.load(); x = int(W*.03)
    starts = [y for y in range(1, H) if px[x, y] < 80 and px[x, y-1] >= 80 and all(px[x, y+k] < 80 for k in range(0, 20) if y+k < H)]
    # agrupa starts próximos (mesma barra)
    bars = [];
    for y in starts:
        if not bars or y - bars[-1] > 200: bars.append(y)
    assert len(bars) == len(exp.get(i, [])), (i, bars, exp.get(i))
    for j, y0 in enumerate(bars):
        y1 = (bars[j+1] - 12) if j+1 < len(bars) else H - 1
        c = im.crop((0, max(0, y0-4), W, y1))
        bbox = ImageChops.difference(c, Image.new('RGB', c.size, 'white')).point(lambda v: 255 if v > 12 else 0).getbbox()
        c = c.crop(bbox); n, call = exp[i][j]; smap[n] = [i, j]
        c.save(f'{out}/jogada-{n:02d}.webp', 'WEBP', quality=82, method=6)
        h = c.crop((0, 0, int(c.width*.8), int(c.height*.075))); h = h.resize((560, int(560*h.height/h.width)))
        lab = Image.new('RGB', (640, h.height), 'white'); lab.paste(h, (80, 0)); ImageDraw.Draw(lab).text((4, h.height//3), f'esp {n}', fill='red'); hs.append(lab)
        print(n, c.size, os.path.getsize(f'{out}/jogada-{n:02d}.webp'))
json.dump(smap, open('slot-map-auto.json', 'w'))
for k in range(0, len(hs), 20):
    part = hs[k:k+20]; o = Image.new('RGB', (640, sum(p.height for p in part)), 'white'); y = 0
    for p in part: o.paste(p, (0, y)); y += p.height
    o.save(f'verify-headers-{k//20}.png')
