/* Katalog produk, solusi (beranda), dan detail artikel. Data ada di js/data.js (dibuat oleh build.py). */
(function () {
  const BASE = document.body.dataset.base || "";
  const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
  const bucket = (s) => String(s);
  /* Gambar produk: pakai path persis dari js/data.js (p.img). Ekstensi tidak diubah. */
  const imgSrc = (p) => BASE + p.img;
  /* Produk tanpa foto (series baru & accessories): placeholder konsisten dengan fallback gambar existing */
  const media = (p) => p.img ? `<img src="${imgSrc(p)}" alt="${esc(p.name)}" loading="lazy" decoding="async">` : `<span class="imgfb" role="img" aria-label="${esc(p.name)}">${esc(p.name)}</span>`;
  /* Badge teks nama brand di atas nama produk (logo gambar brand sudah tidak dipakai lagi) */
  const brandLogo = (b) => `<span class="pbrand">${esc(b)}</span>`;
  /* p.href / p.cta opsional: menimpa tujuan link & teks tombol (dipakai kartu beranda yang menuju halaman merek).
     p.metaHtml / p.extraHtml opsional: HTML siap pakai (sudah di-escape) di atas judul & di bawah deskripsi. */
  /* Judul kartu produk (nama tipe/model) memakai H2 */
  const card = (p, hTag = p.hTag || "h2") => {
    const href = p.href || `${BASE}product-detail/${p.id}.html`;
    return `<article class="pcard">
    <a class="pimg" href="${href}" data-name="${esc(p.name)}">${media(p)}</a>
    <div class="pb">${brandLogo(p.brand)}${p.type === "accessory" && p.acat ? `<span class="pacat">${esc(p.acat)}</span>` : ""}${p.metaHtml || ""}<${hTag}>${esc(p.name)}</${hTag}>${p.desc ? `<p class="pdesc">${esc(p.desc)}</p>` : ""}${p.extraHtml || ""}
    <a class="btn btn-o" href="${href}">${esc(p.cta || "Lihat Detail")}</a></div></article>`;
  };
  const ARROW = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';
  const BRANDS = ["Samsung", "LG", "Hikvision"];
  const group = (list) => BRANDS.map((b) => {
    const it = list.filter((p) => p.brand === b); if (!it.length) return "";
    const k = b.toLowerCase();
    return `<section class="bsec" aria-label="${b}"><div class="bhd"><h2 class="bname bn-${k}">${b.toUpperCase()}</h2><a class="bmore" data-b="${b}" href="${BASE}products.html#${k}">Lihat Semua ${ARROW}</a></div>
      <div class="pgrid">${it.map((p) => card(p)).join("")}</div></section>`;
  }).join("");
  const EMPTY = `<div class="empty"><svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4M8.5 11h5"/></svg><h2>Produk tidak ditemukan</h2><p>Coba gunakan kata kunci lain.</p><button type="button" class="btn btn-o" data-reset>Reset pencarian</button></div>`;
  const norm = (s) => String(s).toLowerCase().replace(/[^a-z0-9]/g, "");

  /* Deskripsi seri produk, ditulis lebih SEO friendly (mengandung brand + nama seri + kata kunci terkait) */
  const SERIES_SEO_DESC = {
    "Samsung|qet": "Digital signage Samsung QE-T Series hadir dengan layar 4K UHD, cocok untuk kebutuhan promosi toko, lobi kantor, hingga papan informasi digital.",
    "Samsung|kmc": "Samsung Kiosk KMC Series berbasis Windows, pilihan tepat untuk self-service kiosk, mesin antrian, dan layar interaktif berbasis sentuh.",
    "Samsung|accessories": "Aksesori pendukung digital signage Samsung, mulai dari player box, floor stand, hingga wall mount untuk instalasi yang lebih rapi dan aman.",
    "LG|uh7j": "Digital signage LG UH7J Series dengan panel IPS UHD brightness tinggi, ideal untuk signage indoor 24/7 di mal, kantor, dan ruang publik.",
    "LG|uh5j": "Digital signage LG UH5J Series menawarkan layar UHD 4K dengan harga kompetitif, cocok untuk kebutuhan digital signage komersial sehari-hari.",
    "LG|ul3j": "Digital signage LG UL3J Series dirancang untuk aplikasi advertising dan video wall dengan tampilan UHD yang tajam dan tahan pemakaian panjang.",
    "Hikvision|wall-mounted": "Digital signage Hikvision Wall-mounted Series, didesain tipis dan ringkas untuk dipasang di dinding sebagai papan informasi atau penunjuk arah.",
    "Hikvision|floor-standing": "Digital signage Hikvision Floor Standing Series, solusi display berdiri untuk lobi mal, toko ritel, dan ruang pamer (showroom).",
    "Hikvision|servers-boxes": "Digital Signage Server dan Box Hikvision untuk mengelola serta memutar konten pada layar digital signage dan video wall LCD/LED Anda.",
  };

  /* Fallback gambar: bila file gagal dimuat, tampilkan latar netral + nama produk (bukan ikon rusak) */
  const fallback = (im) => {
    if (im.dataset.fb) return; im.dataset.fb = "1";
    const box = im.closest(".pimg, .pdimg"); if (!box) return;
    const name = box.dataset.name || im.alt || "";
    im.outerHTML = `<span class="imgfb" role="img" aria-label="${esc(name)}">${esc(name)}</span>`;
  };
  document.addEventListener("error", (e) => { if (e.target && e.target.tagName === "IMG") fallback(e.target); }, true);

  /* Halaman detail: gambar sama dengan kartu (diambil dari data, berdasarkan nama file halaman) */
  const pdImg = document.querySelector(".pdimg img");
  if (pdImg) {
    const pid = location.pathname.split("/").pop().replace(/\.html?$/, ""), p = (window.PRODUCTS || []).find((x) => x.id === pid);
    if (p && p.img) { pdImg.parentNode.dataset.name = p.name; pdImg.src = imgSrc(p); }
    if (pdImg.complete && pdImg.naturalWidth === 0 && pdImg.getAttribute("src")) fallback(pdImg);
  }

  /* ---- Katalog ---- */
  const grid = document.getElementById("grid");
  if (grid) {
    const d = grid.dataset, all = window.PRODUCTS;
    const show = (list) => {
      grid.innerHTML = list.length ? list.map((p) => card(p)).join("") : `<p class="empty">Produk tidak ditemukan. Ubah filter atau hubungi kami untuk rekomendasi.</p>`;
      bindWA();
    };
    if (d.featured) {
      /* Kartu beranda mewakili merek (bukan satu model): judul & deskripsi per merek, ditulis memuat
         kata kunci "digital signage + merek" dan seri yang benar-benar ada di js/data.js */
      const BRAND_CARD = {
        Samsung: { name: "Digital Signage Samsung", desc: "Smart Signage 4K UHD 43–55 inci dan kiosk 24 inci untuk retail, restoran, dan lobi kantor." },
        LG: { name: "Digital Signage LG", desc: "UHD Signage panel IPS 43–55 inci untuk lobi perusahaan, ruang meeting, dan area publik." },
        Hikvision: { name: "Digital Signage Hikvision", desc: "Display 43–65 inci dan Signage Box untuk kampus, perkantoran, dan fasilitas publik." }
      };
      /* Nama pendek chip seri (aksesori tidak ditampilkan sebagai chip) */
      const SHORT = { qet: "QE-T 4K", kmc: "Kiosk KM24C", uh7j: "UH7J", uh5j: "UH5J", ul3j: "UL3J", "wall-mounted": "Wall-mounted", "floor-standing": "Floor Standing", "servers-boxes": "Signage Box" };
      const list = d.featured.split(",").map((id) => all.find((p) => p.id === id)).filter(Boolean).map((p) => {
        const k = p.brand.toLowerCase(), n = all.filter((x) => x.brand === p.brand).length;
        const chips = (window.SERIES[p.brand] || []).filter((s) => SHORT[s.id]).map((s) => `<a href="${BASE}products.html#${k}/${s.id}">${esc(SHORT[s.id])}</a>`).join("");
        return { ...p, hTag: "h2", ...(BRAND_CARD[p.brand] || {}),
          metaHtml: `<span class="fmeta">${n} produk · Garansi resmi</span>`,
          extraHtml: chips ? `<div class="fchips">${chips}</div>` : "",
          /* Arahkan ke halaman produk merek tersebut, bukan detail model */
          href: `${BASE}products.html#${k}`, cta: `Lihat Produk ${p.brand}` };
      });
      grid.innerHTML = list.length ? list.map((p) => card(p)).join("") : `<p class="empty">Produk tidak ditemukan. Ubah filter atau hubungi kami untuk rekomendasi.</p>`;
      bindWA();
    }
    else if (d.related) {
      /* Terkait: series yang sama dulu, lalu produk sejenis (display/aksesori) dari brand yang sama */
      const c = all.find((p) => p.id === d.related), same = all.filter((p) => p.brand === c.brand && p.id !== c.id);
      const rel = [...same.filter((p) => p.series === c.series), ...same.filter((p) => p.series !== c.series && p.type === c.type)];
      show(rel.slice(0, 2));
    }
    else if (d.brand) {
      /* Halaman brand lama dipertahankan hanya untuk kompatibilitas: arahkan ke katalog terpadu */
      location.replace(BASE + "products.html#" + d.brand.toLowerCase());
    }
    else {
      const q = document.getElementById("q"), fs = document.getElementById("fs"), fcEl = document.getElementById("fc"), fc = fcEl || { value: "" }, count = document.getElementById("count"), rst = document.getElementById("reset");
      const chips = [...document.querySelectorAll("#brandChips button")];
      const block = document.getElementById("seriesBlock"), nav = document.getElementById("seriesNav"), lbl = document.getElementById("seriesLabel");
            if (matchMedia("(max-width:640px)").matches) q.placeholder = "Cari produk atau brand...";

      /* Series per brand: dari window.SERIES + series tak terdaftar (fallback, produk tidak hilang) */
      const seriesFor = (brand) => {
        const items = all.filter((p) => p.brand === brand), reg = ((window.SERIES || {})[brand] || []).slice();
        items.forEach((p) => { const id = p.series || "other"; if (!reg.some((x) => x.id === id)) reg.push({ id, name: id === "other" ? "Lainnya" : id }); });
        return reg.filter((x) => items.some((p) => (p.series || "other") === x.id));
      };
      let brand = BRANDS[0], series = "", want = "";
      /* State dari URL: #samsung, #samsung/qmc, #hikvision/accessories (juga ?brand=LG dari tautan lama) */
      const readState = () => {
        let parts = []; try { parts = decodeURIComponent(location.hash.replace(/^#/, "")).toLowerCase().split("/"); } catch (e) {}
        const legacy = (new URLSearchParams(location.search).get("brand") || "").toLowerCase();
        brand = BRANDS.find((b) => b.toLowerCase() === parts[0]) || BRANDS.find((b) => b.toLowerCase() === legacy) || BRANDS[0];
        const list = seriesFor(brand);
        series = (list.find((x) => x.id === parts[1]) || list[0] || { id: "" }).id;
        want = list.some((x) => x.id === parts[1]) ? parts[1] : "";
      };
      /* Seri tampil menurun dalam satu halaman; tautan #brand/seri menggulir ke seri tersebut.
         requestAnimationFrame (x2) memastikan DOM dari run() sudah selesai di-paint sebelum scroll dihitung,
         supaya saat datang dari halaman lain (mis. klik navbar di index.html) scroll langsung tepat & produk langsung terlihat. */
      const toSeries = () => {
        if (!want) return toTop();
        requestAnimationFrame(() => requestAnimationFrame(() => {
          const el = document.getElementById("series-" + want);
          if (el) el.scrollIntoView({ block: "start" });
        }));
      };
      /* Bug fix: setelah ganti merek, layar tetap di posisi scroll lama (mis. bawah daftar Samsung) sehingga
         daftar merek baru tampak "macet". Gulir kembali ke kotak filter bila pengguna sudah melewatinya. */
      const toTop = () => {
        const f = document.getElementById("filters");
        if (f && f.getBoundingClientRect().top < 0) f.scrollIntoView({ behavior: "smooth", block: "start" });
      };
      let skip = false;
      const setHash = (h) => { if (location.hash === "#" + h) return; skip = true; location.hash = h; };

      /* Pill "Pilih Seri Produk": hanya menggulir ke seri terkait. Tidak ada state aktif/biru permanen; warna biru hanya lewat :hover (CSS). */
      nav.addEventListener("click", (e) => {
        const b = e.target.closest("button[data-s]"); if (!b) return;
        const el = document.getElementById("series-" + b.dataset.s); if (!el) return;
        el.scrollIntoView({ behavior: "smooth", block: "start" }); setHash(brand.toLowerCase() + "/" + b.dataset.s);
      });
      const run = () => {
        const t = q.value.trim().toLowerCase(), toks = t.split(/\s+/).filter(Boolean), searching = !!t;
        const list = seriesFor(brand);
        chips.forEach((c) => { const on = !searching && c.dataset.v === brand; c.classList.toggle("on", on); c.setAttribute("aria-pressed", on); });
        const extra = (p) => (!fs.value || String(p.size) === fs.value) && (!fc.value || p.cat === fc.value);
        const active = !!(t || fs.value || fc.value);
        rst.hidden = !active;
        if (searching) {
          /* Pencarian lintas brand & series (perilaku existing) */
          const res = all.filter((p) => {
            if (!extra(p)) return false;
            const plain = `${p.name} ${p.brand} ${p.cat} ${p.acat || ""} ${p.model || ""} ${p.resl || ""} ${p.size || ""}`.toLowerCase(), compact = norm(plain);
            return toks.every((k) => plain.includes(k) || compact.includes(norm(k)));
          });
          block.hidden = true;
          count.textContent = `Menampilkan ${res.length} dari ${all.length} produk`;
          grid.innerHTML = res.length ? group(res) : EMPTY;
          return;
        }
        if (!list.length) { block.hidden = true; grid.innerHTML = EMPTY; return; }
        let shown = 0, total = 0; const present = [];
        const html = list.map((cur) => {
          const inSeries = all.filter((p) => p.brand === brand && (p.series || "other") === cur.id), res = inSeries.filter(extra);
          total += inSeries.length; shown += res.length;
          if (!res.length) return "";
          present.push(cur);
          const sizes = [...new Set(inSeries.filter((p) => p.size).map((p) => p.size))].sort((a, b) => a - b).map((n) => n + '"').join(", ");
          const seo = SERIES_SEO_DESC[brand + "|" + cur.id];
          const countInfo = cur.id === "accessories" || cur.id === "servers-boxes" ? `${inSeries.length} produk tersedia.` : `${inSeries.length} model tersedia${sizes ? " dengan pilihan ukuran " + sizes : ""}.`;
          const info = seo ? `${esc(seo)} ${esc(countInfo)}` : (cur.id === "accessories" ? `${inSeries.length} aksesori ${esc(brand)}. Kompatibilitas dengan model display tertentu perlu dikonfirmasi.` : `${inSeries.length} model tersedia${sizes ? " dengan pilihan ukuran " + sizes : ""}.`);
          return `<section class="sgroup" id="series-${esc(cur.id)}" aria-label="${esc(brand + " " + cur.name)}"><div class="shead"><h2>${esc(brand + " " + cur.name)}</h2><p>${info}</p></div><div class="pgrid">${res.map((p) => card(p)).join("")}</div></section>`;
        }).join("");
        count.textContent = active ? `Menampilkan ${shown} dari ${total} produk` : "";
        grid.removeAttribute("role"); grid.removeAttribute("aria-labelledby");
        grid.innerHTML = html || EMPTY;
        lbl.textContent = "Pilih Seri Produk " + brand;
        nav.innerHTML = present.map((x) => `<button type="button" data-s="${esc(x.id)}" aria-controls="series-${esc(x.id)}">${esc(x.name.toUpperCase())}</button>`).join("");
        block.hidden = !present.length;
      };
      const reset = () => { q.value = fs.value = fc.value = ""; run(); };
      const go = (b, s) => { q.value = ""; brand = b; const l = seriesFor(b); series = (l.find((x) => x.id === s) || l[0] || { id: "" }).id; setHash(s ? b.toLowerCase() + "/" + series : b.toLowerCase()); run(); toTop(); };
      chips.forEach((c) => c.addEventListener("click", () => go(c.dataset.v)));
      [q, fs, fcEl].filter(Boolean).forEach((el) => el.addEventListener("input", run));
      rst.addEventListener("click", reset);
      grid.addEventListener("click", (e) => {
        if (e.target.closest("[data-reset]")) { reset(); return; }
        const m = e.target.closest(".bmore"); if (m) { e.preventDefault(); fs.value = fc.value = ""; go(m.dataset.b); }
      });
      document.getElementById("filters").addEventListener("submit", (e) => { e.preventDefault(); run(); grid.scrollIntoView({ behavior: "smooth", block: "start" }); });
      /* Tautan navbar/footer ke #brand saat sudah di halaman ini: reset pencarian & tampilkan brand tsb */
      window.addEventListener("hashchange", () => { if (skip) { skip = false; return; } q.value = fs.value = fc.value = ""; readState(); run(); toSeries(); });
      /* Bug fix: klik link navbar/dropdown produk (products.html#samsung dst) saat hash URL tidak berubah
         (mis. sudah di #samsung lalu klik "Digital Signage Samsung" lagi) tidak memicu event hashchange,
         sehingga grid produk tampak tidak berubah/"tidak langsung muncul". Tangani klik link tsb secara eksplisit. */
      document.addEventListener("click", (e) => {
        const a = e.target.closest('a[href*="products.html#"]'); if (!a) return;
        const hash = a.getAttribute("href").split("#")[1] || "";
        if ("#" + hash !== location.hash) return; // hash beda: biarkan browser & listener hashchange yang menangani
        e.preventDefault();
        q.value = fs.value = fc.value = "";
        readState(); run(); toSeries();
      });
      readState(); run(); toSeries();
    }
  }

  /* ---- Solusi (beranda) ---- */
  const sol = document.getElementById("solutions");
  /* Kartu solusi: tiap kartu menuju produk yang relevan (x.href), teks petunjuk (x.cta) muncul saat hover */
  if (sol) sol.innerHTML = window.SOLUTIONS.map((x) => `<a class="solc" href="${BASE}${x.href || "products.html"}" aria-label="${esc(x.cta || "Lihat produk")}: ${esc(x.title)}"><img src="${BASE}${x.img}" alt="${esc(x.title)}" loading="lazy"><div class="sol-t"><h3>${esc(x.title)}</h3><p>${esc(x.desc)}</p><span class="sol-more">${esc(x.cta || "Lihat produk")} <span aria-hidden="true">→</span></span></div></a>`).join("");

  /* ---- Artikel: data dari window.ARTICLES (js/data.js) ---- */
  const ART_ARROW = " →";
  const blocks = (list) => list.map((b) => {
    if (typeof b === "string") return `<p>${b}</p>`;
    if (b.h) return `<h2>${b.h}</h2>`;
    if (b.ul) return `<ul>${b.ul.map((i) => `<li>${i}</li>`).join("")}</ul>`;
    if (b.tip) return `<aside class="atip"><strong>Tips</strong><p>${b.tip}</p></aside>`;
    if (b.table) return `<div class="atable"><table><thead><tr>${b.table.head.map((h) => `<th scope="col">${h}</th>`).join("")}</tr></thead><tbody>${b.table.rows.map((r) => `<tr>${r.map((c, i) => i ? `<td>${c}</td>` : `<th scope="row">${c}</th>`).join("")}</tr>`).join("")}</tbody></table></div>`;
    return "";
  }).join("");

  const ag = document.getElementById("artgrid");
  /* Listing: daftar horizontal dengan pencarian & filter kategori. Artikel kategori Retail disembunyikan dari daftar (tetap ada untuk halaman detail). */
  const LIST_MAX = 4, LIST_HIDE = ["Retail"];
  if (ag) {
    const items = window.ARTICLES.filter((a) => !LIST_HIDE.includes(a.cat)).slice(0, LIST_MAX);
    const qEl = document.getElementById("artq"), catBox = document.getElementById("artcats");
    let cat = "";
    const draw = () => {
      const q = (qEl ? qEl.value : "").trim().toLowerCase();
      const list = items.filter((a) => (!cat || a.cat === cat) && (!q || `${a.title} ${a.excerpt} ${a.cat}`.toLowerCase().includes(q)));
      ag.innerHTML = list.length ? list.map((a) => `<article class="acard">
    <a class="athumb" href="article-detail.html?a=${a.id}" tabindex="-1" aria-hidden="true"><img src="${BASE}${a.img}" alt="" loading="lazy"></a>
    <div class="abody"><div class="ameta"><time>${a.date}</time></div>
    <h2><a href="article-detail.html?a=${a.id}">${a.title}</a></h2><p>${a.excerpt}</p>
    <a class="abtn" href="article-detail.html?a=${a.id}">Baca Selengkapnya${ART_ARROW}</a></div></article>`).join("") : '<p class="aempty">Tidak ada artikel yang cocok.</p>';
    };
    if (catBox) {
      const cats = [...new Set(items.map((a) => a.cat))];
      catBox.innerHTML = `<option value="">Semua</option>` + cats.map((c) => `<option value="${esc(c)}">${esc(c)}</option>`).join("");
      catBox.addEventListener("change", () => { cat = catBox.value; draw(); });
    }
    if (qEl) qEl.addEventListener("input", draw);
    draw();

    /* Postingan Terbaru: daftar link singkat ke artikel terbaru, independen dari filter pencarian/kategori di atas */
    const recentBox = document.getElementById("artrecent");
    if (recentBox) {
      const RECENT_MAX = 5;
      const recent = window.ARTICLES.filter((a) => !LIST_HIDE.includes(a.cat)).slice(0, RECENT_MAX);
      recentBox.innerHTML = recent.map((a) => `<li><a href="article-detail.html?a=${a.id}">${esc(a.title)}</a></li>`).join("");
    }
  }

  /* ---- Detail artikel ---- */
  const art = document.getElementById("art");
  if (art) {
    const a = window.ARTICLES.find((x) => x.id === new URLSearchParams(location.search).get("a")) || window.ARTICLES[0];
    document.title = a.title + " | Cahaya Mustika Internesia";
    const bc = document.getElementById("artCrumb"); if (bc) bc.textContent = a.title;
    art.innerHTML = `<header class="ahd"><div class="ameta"><time>${a.date}</time></div><h1>${a.title}</h1><p class="aintro">${a.intro}</p></header>
      <figure class="ahero"><img src="${BASE}${a.img}" alt="${esc(a.title)}"></figure>
      <div class="abodytxt">${blocks(a.body)}<section class="aconc"><h2>Kesimpulan</h2><p>${a.conclusion}</p></section></div>`;
    bindWA();
  }
})();
