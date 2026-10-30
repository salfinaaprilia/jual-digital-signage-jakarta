/* Portofolio: DATA + tampilan.
   Tidak ada filter kategori tempat (Mall/Cafe/dsb) lagi: seluruh proyek ditampilkan
   sekaligus di bawah label "Semua Proyek".

   Edit daftar PORTFOLIO di bawah untuk mengganti/menambah proyek. Taruh foto asli di
   assets/images/portfolio/ lalu ubah nilai img. */
const PORTFOLIO = [
  { title: "Instalasi Wall-Mounted Display untuk Ruang VIP", desc: "Pemasangan digital signage wall-mounted pada panel kayu ukir di ruang VIP, lengkap dengan sistem content management untuk mengatur pemutaran konten.", img: "assets/images/portfolio/wall-display-ruang-vip.webp" },
  { title: "Kiosk Digital Signage untuk Pengumuman Layanan Kampus", desc: "Floor-standing kiosk digital signage di lobi FILKOM UB menampilkan maklumat pelayanan fakultas kepada mahasiswa dan pengunjung secara real-time.", img: "assets/images/portfolio/kiosk-filkom-maklumat-pelayanan.webp" },
  { title: "Ceiling Mount Display untuk Foodcourt", desc: "Digital signage yang dipasang menggantung di langit-langit area foodcourt untuk menampilkan promosi dan informasi menu kepada pengunjung.", img: "assets/images/portfolio/ceiling-tv-foodcourt.webp" },
  { title: "Proses Instalasi Wall-Mounted Digital Signage", desc: "Tim teknisi kami melakukan pemasangan dan konfigurasi digital signage wall-mounted secara langsung di lokasi pelanggan.", img: "assets/images/portfolio/instalasi-wall-display.webp" },
  { title: "Multi-Unit Kiosk Digital Signage untuk Kampus", desc: "Lima unit floor-standing kiosk digital signage FILKOM UB terpasang berjajar, masing-masing dapat dikonfigurasi dan dipantau melalui dashboard content management.", img: "assets/images/portfolio/kiosk-filkom-multi-unit.webp" },
  { title: "Kiosk Digital Signage untuk Konten Komunitas Kampus", desc: "Floor-standing kiosk digital signage FILKOM UB menampilkan konten komunitas dan informasi media sosial kampus kepada mahasiswa dan tamu.", img: "assets/images/portfolio/kiosk-filkom-konten-komunitas.webp" },
  { title: "Kiosk Digital Signage untuk Kampanye Zona Integritas", desc: "Floor-standing kiosk digital signage FILKOM UB menampilkan kampanye anti-korupsi dan pelayanan prima sebagai bagian dari program Zona Integritas kampus.", img: "assets/images/portfolio/kiosk-filkom-zona-integritas.webp" },
  { title: "Proses Pemasangan Bracket Wall Mount", desc: "Tim teknisi kami mengukur dan memasang bracket wall mount menggunakan waterpass agar posisi digital signage presisi dan sejajar sebelum unit terpasang.", img: "assets/images/portfolio/instalasi-bracket-wall-mount.webp" },
  { title: "Konfigurasi Jaringan Wall-Mounted Display", desc: "Tahap konfigurasi koneksi jaringan WiFi pada digital signage wall-mounted di ruang VIP agar perangkat siap menerima dan memutar konten.", img: "assets/images/portfolio/konfigurasi-jaringan-wall-display.webp" },
];

(function () {
  const pf = document.getElementById("pf"), lb = document.getElementById("lb");
  if (!pf) return;
  const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
  const render = () => {
    pf.innerHTML = PORTFOLIO.length
      ? PORTFOLIO.map((x) => `<article class="pfc" role="button" tabindex="0" data-img="${x.img}" data-t="${esc(x.title)}" aria-label="Lihat foto ${esc(x.title)}">
      <div class="pfc-img"><img src="${x.img}" srcset="${x.img.replace(/(\.\w+)$/, "-640$1")} 640w, ${x.img.replace(/(\.\w+)$/, "-800$1")} 800w, ${x.img} 1000w" sizes="(max-width:640px) 92vw, 400px" alt="${esc(x.title)}" loading="lazy"></div>
      <div class="pfc-b"><h2>${esc(x.title)}</h2><p>${esc(x.desc)}</p></div></article>`).join("")
      : `<p class="empty">Belum ada contoh portofolio. Hubungi kami untuk melihat studi kasus lainnya.</p>`;
  };
  const open = (b) => {
    let im = lb.querySelector("img"); if (!im) { im = document.createElement("img"); lb.insertBefore(im, lb.querySelector("p")); } im.src = b.dataset.img; im.alt = b.dataset.t; lb.querySelector("p").textContent = b.dataset.t; lb.showModal();
  };
  pf.addEventListener("click", (e) => { const b = e.target.closest("[data-img]"); if (b) open(b); });
  pf.addEventListener("keydown", (e) => { if (e.key !== "Enter" && e.key !== " ") return; const b = e.target.closest("[data-img]"); if (b) { e.preventDefault(); open(b); } });
  lb.querySelector(".lbx").addEventListener("click", () => lb.close());
  lb.addEventListener("click", (e) => { if (e.target === lb) lb.close(); });
  render();
})();
