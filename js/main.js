/* ===== CAHAYA MUSTIKA INTERNESIA - main.js =====
   Data perusahaan (nomor WhatsApp, email, alamat, maps, sosial media) ada di js/config.js */
const WA_NUMBER = String(CONFIG.whatsapp || "").replace(/\D/g, "");
const WA_MESSAGE = CONFIG.whatsappMessage;
const waUrl = (t) => `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(t)}`;
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];

/* Isi otomatis dari config: data-cfg="email|address|phone|hours" */
$$("[data-cfg]").forEach((el) => {
  const v = CONFIG[el.dataset.cfg]; if (!v) return;
  el.textContent = v;
  if (el.tagName === "A" && el.dataset.cfg === "email") el.href = "mailto:" + v;
});
const map = $("#mapFrame"); if (map) map.src = CONFIG.mapsUrl;
const soc = $("[data-social]");
if (soc) soc.innerHTML = Object.entries(CONFIG.social).filter(([, u]) => u).map(([n, u]) => `<a href="${u}" target="_blank" rel="noopener">${n[0].toUpperCase() + n.slice(1)}</a>`).join("") || "<span>Segera hadir</span>";

/* Semua tombol WhatsApp: data-wa (pesan bisa diganti lewat data-msg) */
function bindWA() {
  $$("[data-wa]").forEach((a) => {
    a.href = waUrl(a.dataset.msg || WA_MESSAGE);
    a.target = "_blank"; a.rel = "noopener";
    if ("txt" in a.dataset) a.textContent = CONFIG.phone || WA_NUMBER;
  });
}
bindWA();

/* Navbar */
const nav = $("#nav"), menu = $("#menu"), burger = $("#burger"), dd = $(".dd"), ddBtn = $(".dd-btn");
/* scrollY dibaca di requestAnimationFrame (bukan langsung setelah DOM diubah) agar tidak memicu forced reflow */
let navTick = false;
const onScroll = () => {
  if (navTick) return; navTick = true;
  requestAnimationFrame(() => { navTick = false; nav.classList.toggle("sc", scrollY > 8); });
};
onScroll(); addEventListener("scroll", onScroll, { passive: true });
const closeMenu = () => { menu.classList.remove("open"); burger.setAttribute("aria-expanded", "false"); burger.setAttribute("aria-label", "Buka menu"); };
burger.addEventListener("click", () => {
  const o = menu.classList.toggle("open");
  burger.setAttribute("aria-expanded", o); burger.setAttribute("aria-label", o ? "Tutup menu" : "Buka menu");
});
ddBtn.addEventListener("click", (e) => { e.stopPropagation(); ddBtn.setAttribute("aria-expanded", dd.classList.toggle("open")); });
document.addEventListener("click", (e) => { if (!dd.contains(e.target)) { dd.classList.remove("open"); ddBtn.setAttribute("aria-expanded", "false"); } });
document.addEventListener("keydown", (e) => { if (e.key === "Escape") { dd.classList.remove("open"); closeMenu(); } });
addEventListener("resize", () => { if (innerWidth > 960) closeMenu(); });

/* Form kontak -> WhatsApp */
const form = $("#form");
if (form) form.addEventListener("submit", (e) => {
  e.preventDefault();
  const v = (n) => form.elements[n].value.trim();
  const err = (n, m) => { const el = form.elements[n]; el.classList.toggle("bad", !!m); el.parentElement.querySelector("small").textContent = m; return !m; };
  const a = err("nama", v("nama") ? "" : "Nama wajib diisi.");
  const b = err("wa", /^(\+?62|0)8\d{7,12}$/.test(v("wa").replace(/[\s-]/g, "")) ? "" : "Masukkan nomor WhatsApp yang valid, contoh 08123456789.");
  if (!a || !b) return;
  const t = ["Halo Cahaya Mustika Internesia, saya ingin konsultasi.", "", `Nama: ${v("nama")}`, `Perusahaan: ${v("perusahaan") || "-"}`, `WhatsApp: ${v("wa")}`, `Produk: ${v("produk")}`, `Pesan: ${v("pesan") || "-"}`].join("\n");
  window.open(waUrl(t), "_blank", "noopener");
});
$$("#yr").forEach((y) => (y.textContent = new Date().getFullYear()));

/* Slider hero (beranda): otomatis, crossfade, tanpa tombol panah */
const slides = $("[data-slides]");
if (slides) {
  const imgs = $$("img", slides), dots = $$(".dots button");
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  let i = 0, timer = null;
  const go = (n) => { i = (n + imgs.length) % imgs.length; imgs.forEach((im, k) => im.classList.toggle("on", k === i)); dots.forEach((d, k) => d.classList.toggle("on", k === i)); };
  const stop = () => { if (timer) { clearInterval(timer); timer = null; } };
  const start = () => { stop(); if (reduce || document.hidden || imgs.length < 2) return; timer = setInterval(() => go(i + 1), 5500); };
  dots.forEach((d, k) => d.addEventListener("click", () => { go(k); start(); }));
  document.addEventListener("visibilitychange", () => (document.hidden ? stop() : start()));
  start();
}

/* FAQ accordion (beberapa item boleh terbuka bersamaan) */
$$(".faq-q").forEach((b) => b.addEventListener("click", () => {
  const open = b.getAttribute("aria-expanded") === "true";
  b.setAttribute("aria-expanded", !open);
  b.closest(".faq-i").classList.toggle("open", !open); /* tombol kini di dalam <h3>, bukan anak langsung .faq-i */
}));

/* Tab "Digital Signage untuk Berbagai Kebutuhan" (beranda): klik atau panah kiri/kanan untuk berganti sektor */
$$("[data-sector-tabs]").forEach((box) => {
  const tabs = $$("[role=tab]", box);
  /* Foto panel tersembunyi dimuat saat section mendekati layar, agar tidak kosong sesaat ketika tab diganti */
  const eager = () => $$("img[loading=lazy]", box).forEach((im) => (im.loading = "eager"));
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver((en) => { if (en.some((x) => x.isIntersecting)) { eager(); io.disconnect(); } }, { rootMargin: "400px" });
    io.observe(box);
  } else eager();
  const show = (t, focus) => {
    tabs.forEach((x) => {
      const on = x === t;
      x.setAttribute("aria-selected", on); x.tabIndex = on ? 0 : -1;
      $("#" + x.getAttribute("aria-controls")).hidden = !on;
    });
    if (focus) t.focus();
  };
  tabs.forEach((t, i) => {
    t.addEventListener("click", () => show(t));
    t.addEventListener("keydown", (e) => {
      const d = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
      if (d) { e.preventDefault(); show(tabs[(i + d + tabs.length) % tabs.length], true); }
    });
  });
});

/* Animasi muncul saat scroll (fade-up, sekali per elemen, kartu berurutan).
   Dijalankan setelah semua skrip merender konten (DOMContentLoaded). Konten tetap terlihat tanpa JS
   karena kelas js-reveal baru dipasang di sini; dilewati bila pengguna memilih reduced motion. */
document.addEventListener("DOMContentLoaded", () => {
  if (!("IntersectionObserver" in window) || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const STEP = 0.08, MAX = 6;
  const tag = (el, i = 0) => { if (el.hasAttribute("data-reveal")) return; el.setAttribute("data-reveal", ""); el.style.setProperty("--rd", Math.min(i, MAX) * STEP + "s"); };
  /* Judul/teks pembuka section */
  $$(".sec .ctr > .eyebrow, .sec .ctr > h2, .sec .ctr > .sub, .sec .head, .pf-all-label, .cta-in").forEach((el) => tag(el));
  /* Kelompok kartu: muncul berurutan */
  [[".feat #grid", ".pcard"], ["#solutions", ".solc"], [".choosing-copy", ":scope > *"], [".choosing-steps", ".choosing-step"],
   [".faq", ".faq-i"], ["#pf", ".pfc"], [".pf-trust-in", ":scope > div"], ["#artgrid", ".acard"],
   /* Halaman produk (tiap seri), detail produk, kontak, dan detail artikel */
   [".pgrid", ".pcard"], [".pd", ":scope > *"], [".kt-list", "li"], [".adetail", ".ahd, .ahero, .abody"]]
    .forEach(([box, item]) => $$(box).forEach((b) => $$(item, b).forEach((el, i) => tag(el, i))));
  $$(".kt-map, .contact-consult, .aconc").forEach((el) => tag(el));
  /* Catatan: judul hero tiap halaman sengaja tidak dianimasikan agar tidak memperlambat LCP (PageSpeed) */
  /* Tab sektor dianimasikan sebagai satu blok (panel tersembunyi tidak boleh ikut ditandai) */
  $$("[data-sector-tabs]").forEach((el) => tag(el));

  const els = $$("[data-reveal]"); if (!els.length) return;
  document.documentElement.classList.add("js-reveal");
  /* Setelah animasi selesai, atribut dilepas agar efek hover kartu (transform) kembali normal.
     Pakai timer (bukan transitionend) supaya pasti terlepas walau transisi tidak berjalan. */
  const done = (el) => { el.removeAttribute("data-reveal"); el.classList.remove("rv-in"); el.style.removeProperty("--rd"); };
  const show = (el, animate) => {
    io.unobserve(el);
    if (!animate) return done(el);
    el.classList.add("rv-in");
    setTimeout(() => done(el), 700 + (parseFloat(el.style.getPropertyValue("--rd")) || 0) * 1000);
  };
  const io = new IntersectionObserver((en) => en.forEach((x) => {
    if (x.isIntersecting) show(x.target, true);
    /* Elemen yang sudah terlewat di atas layar (mis. lompat lewat link #anchor) langsung ditampilkan tanpa animasi */
    else if (x.boundingClientRect.bottom < 0) show(x.target, false);
  }), { rootMargin: "0px 0px -8% 0px", threshold: 0.12 });
  els.forEach((el) => io.observe(el));
  /* Pengaman terakhir: apa pun yang terjadi, tidak ada konten yang tertinggal tak terlihat */
  addEventListener("load", () => setTimeout(() => $$("[data-reveal]").forEach((el) => {
    if (el.getBoundingClientRect().top < innerHeight) show(el, true);
  }), 4000));
});
