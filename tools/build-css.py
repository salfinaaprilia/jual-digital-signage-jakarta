"""Bangun CSS gabungan + splash yang ditanam di <head> (untuk skor PageSpeed).

Edit file sumber seperti biasa (css/style.css, css/responsive.css, css/accent.css,
css/polish.css, css/splash.css, js/splash.js), lalu jalankan dari folder proyek:

    python tools/build-css.py

Hasil:
  - css/site.min.css          = style + responsive + accent           (semua halaman)
  - css/site-product.min.css  = style + responsive + polish + accent  (halaman detail produk)
  - splash.css & splash.js ditanam ulang di <head> semua halaman HTML
  - theme WordPress (wordpress theme/cahaya-mustika-signage) ikut diperbarui:
    file CSS/JS sumber disalin, lalu dibuat site.min.css & site-product.min.css (+ wp.css)
"""
import glob
import os
import re
import shutil

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
THEME = os.path.join(ROOT, 'wordpress theme', 'cahaya-mustika-signage')


def read(path):
    return open(path, encoding='utf-8').read()


def minify(css):
    css = re.sub(r'/\*[\s\S]*?\*/', '', css)          # komentar
    css = re.sub(r'\s+', ' ', css)                     # spasi/baris baru
    css = re.sub(r'\s*([{};,])\s*', r'\1', css)        # spasi di sekitar { } ; ,
    css = css.replace(';}', '}')
    return css.strip() + '\n'


def bundle(base, files, out):
    css = ''.join('/* %s */\n%s\n' % (f, read(os.path.join(base, 'css', f))) for f in files)
    head = '/* FILE HASIL BUILD - jangan diedit. Edit: %s lalu jalankan: python tools/build-css.py */\n' % ', '.join(files)
    open(os.path.join(base, 'css', out), 'w', encoding='utf-8', newline='\n').write(head + minify(css))


MAIN = ['style.css', 'responsive.css', 'accent.css']
PRODUCT = ['style.css', 'responsive.css', 'polish.css', 'accent.css']

# ---------- 1. Versi HTML statis ----------
bundle(ROOT, MAIN, 'site.min.css')
bundle(ROOT, PRODUCT, 'site-product.min.css')

splash_css = minify(read(os.path.join(ROOT, 'css', 'splash.css'))).strip()
splash_js = read(os.path.join(ROOT, 'js', 'splash.js')).strip()

LINK = r'<link href="((?:\.\./)?)css/(?:splash|style|responsive|polish|accent|site|site-product)(?:\.min)?\.css" rel="stylesheet">\n'
pages = [p for p in glob.glob(os.path.join(ROOT, '**', '*.html'), recursive=True)
         if os.sep + 'wordpress theme' + os.sep not in p and os.sep + '.git' + os.sep not in p]
for p in pages:
    s = read(p)
    rel = os.path.relpath(p, ROOT).replace(os.sep, '/')
    prefix = '../' if '/' in rel else ''
    product = rel.startswith('product-detail/')
    # Buang blok lama (link CSS terpisah, splash lama/inline lama), lalu tulis ulang dalam satu urutan
    m = re.search(r'( *)(?:' + LINK + r'|<style id="splash-css">.*?</style>\n|<script (?:id="splash-js">.*?|src="(?:\.\./)?js/splash\.js"></script>)\n)', s, re.S)
    if not m:
        print('LEWATI (pola head tidak ditemukan):', rel)
        continue
    ind = m.group(1)
    start = m.start()
    s = re.sub(r' *' + LINK, '', s)
    s = re.sub(r' *<style id="splash-css">.*?</style>\n', '', s, flags=re.S)
    s = re.sub(r' *<script id="splash-js">.*?</script>\n', '', s, flags=re.S)
    s = re.sub(r' *<script src="(?:\.\./)?js/splash\.js"></script>\n', '', s)
    block = (f'{ind}<style id="splash-css">{splash_css}</style>\n'
             f'{ind}<link href="{prefix}css/{"site-product" if product else "site"}.min.css" rel="stylesheet">\n'
             f'{ind}<script id="splash-js">window.CMI_SPLASH_BASE="{prefix}";\n{splash_js}\n</script>\n')
    # Sisipkan di posisi blok pertama yang dihapus (setelah link font & preload)
    head_before = s[:start]
    s = head_before + block + s[start:]
    open(p, 'w', encoding='utf-8', newline='').write(s)
print('HTML diperbarui:', len(pages))

# ---------- 2. Theme WordPress ----------
if os.path.isdir(THEME):
    for f in ('style.css', 'responsive.css', 'polish.css', 'accent.css', 'splash.css'):
        shutil.copy2(os.path.join(ROOT, 'css', f), os.path.join(THEME, 'css', f))
    shutil.copy2(os.path.join(ROOT, 'js', 'splash.js'), os.path.join(THEME, 'js', 'splash.js'))
    bundle(THEME, MAIN + ['wp.css'], 'site.min.css')
    bundle(THEME, PRODUCT + ['wp.css'], 'site-product.min.css')
    print('Theme diperbarui:', THEME)
