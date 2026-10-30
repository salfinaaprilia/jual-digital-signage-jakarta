/* Splash screen untuk SEMUA halaman. Dimuat di <head> (sinkron) agar tampil sebelum halaman digambar.
   Ubah durasi di MIN_MS (waktu tampil minimum) dan MAX_MS (batas maksimum).
   Splash ditutup saat HTML selesai diproses (DOMContentLoaded), tidak menunggu semua gambar
   selesai diunduh (event load), agar konten utama (LCP) cepat terlihat. */
(function () {
  var MIN_MS = 200, MAX_MS = 800;
  var root = document.documentElement;
  // Terapkan tema tersimpan lebih awal agar tidak ada kilatan warna
  try { var t = localStorage.getItem("cm-theme"); if (t === "dark") root.dataset.theme = "dark"; } catch (e) {}
  /* Saat ditanam langsung di <head> (tanpa file terpisah), lokasi aset diberikan lewat CMI_SPLASH_BASE */
  var base = window.CMI_SPLASH_BASE != null ? window.CMI_SPLASH_BASE : document.currentScript.src.replace(/js\/splash\.js.*$/, "");
  var el = document.createElement("div");
  el.id = "splash"; el.setAttribute("aria-hidden", "true");
  el.innerHTML = '<div class="splash-in"><img src="' + base + 'assets/logo/' + (root.dataset.theme === "dark" ? "logo-white" : "logo") + '.webp" alt="Cahaya Mustika Internesia"><p>Digital Signage &amp; Office Equipment</p><span class="bar"></span></div>';
  root.appendChild(el);
  var start = Date.now(), done = false;
  function hide() {
    if (done) return; done = true;
    el.classList.add("out");
    setTimeout(function () { if (el.parentNode) el.parentNode.removeChild(el); }, 400);
  }
  function whenReady() { setTimeout(hide, Math.max(0, MIN_MS - (Date.now() - start))); }
  if (document.readyState !== "loading") whenReady(); else document.addEventListener("DOMContentLoaded", whenReady);
  setTimeout(hide, MAX_MS);
  // Tombol Back/Forward (halaman dari cache): jangan tampilkan splash yang macet
  window.addEventListener("pageshow", function (e) { if (e.persisted) hide(); });
})();
