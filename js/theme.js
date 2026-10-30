/* Tema terang/gelap (ikon saja). Pilihan disimpan di localStorage. */
(function () {
  var root = document.documentElement, icon = document.getElementById("themeIcon");
  function set(t, save) {
    if (t === "dark") root.dataset.theme = "dark"; else root.removeAttribute("data-theme");
    icon.textContent = t === "dark" ? "☀" : "☾";
    if (save) { try { localStorage.setItem("cm-theme", t); } catch (e) {} }
  }
  set(root.dataset.theme === "dark" ? "dark" : "light", false);
  document.getElementById("theme").addEventListener("click", function () {
    set(root.dataset.theme === "dark" ? "light" : "dark", true);
  });
})();
