// Password Gate + Loader Control — FINAL
// Doğru şifre: 20061016
// HTML id'leri: gate-overlay, gate-form, gate-input, gate-hint, loader-overlay

(function () {
  const PASS = "20061016";
  const KEY  = "gate-pass-ok";   // localStorage anahtarı
  const CLOSE_ANIM_MS = 240;     // gate kapanış animasyonu
  const LOADER_MS = 2000;        // loader süresi (2sn)

  // Elemanlar
  const gate   = document.getElementById("gate-overlay");
  const form   = document.getElementById("gate-form");
  const input  = document.getElementById("gate-input");
  const hint   = document.getElementById("gate-hint");
  const loader = document.getElementById("loader-overlay");

  if (!gate) return; // sayfada gate yoksa çık

  // URL parametreleri (reset/gate zorla)
  const params = new URLSearchParams(location.search);
  const forceReset = params.get("reset") === "1";
  const forceGate  = params.get("gate")  === "1";

  const focusInput = () => { try { input && input.focus(); } catch(_){} };
  const unlocked = () => { try { return localStorage.getItem(KEY) === "1"; } catch(_) { return false; } };
  const setUnlocked = () => { try { localStorage.setItem(KEY,"1"); } catch(_){} };
  const clearUnlocked = () => { try { localStorage.removeItem(KEY); } catch(_){} };

  if (forceReset) clearUnlocked();

  // Loader göster/gizle
  function showLoaderThenHide() {
    if (!loader) return;
    loader.classList.remove("hidden");
    setTimeout(() => loader.classList.add("hidden"), LOADER_MS);
  }

  function openGate() {
    gate.classList.remove("is-closed");
    gate.removeAttribute("aria-hidden");
    setTimeout(focusInput, 10);
  }

  function closeGate() {
    gate.setAttribute("aria-hidden", "true");
    gate.classList.add("is-closing");
    setTimeout(() => {
      gate.classList.remove("is-closing");
      gate.classList.add("is-closed");
    }, CLOSE_ANIM_MS);
  }

  function fail(msg) {
    if (hint) {
      hint.textContent = msg || "Şifre hatalı. Tekrar dene.";
      hint.style.color = "#c11";
    }
    gate.querySelector(".gate-card")?.classList.add("shake");
    setTimeout(() => gate.querySelector(".gate-card")?.classList.remove("shake"), 420);
    if (input) { input.value = ""; focusInput(); }
  }

  // İlk durum: kilit zorlanmışsa her halükârda aç
  if (forceGate) {
    clearUnlocked();
    openGate();
  } else if (unlocked()) {
    // daha önce doğrulanmış: gate kapalı, loader 2sn göster
    gate.classList.add("is-closed");
    gate.setAttribute("aria-hidden","true");
    window.requestAnimationFrame(() => showLoaderThenHide());
  } else {
    // doğrulanmamış: gate açık
    openGate();
  }

  // Form
  form?.addEventListener("submit", (e) => {
    e.preventDefault();
    const val = (input?.value || "").trim();
    if (val === PASS) {
      setUnlocked();
      if (hint) hint.textContent = "";
      closeGate();
      // Gate kapanınca loader'ı göster
      setTimeout(showLoaderThenHide, CLOSE_ANIM_MS);
    } else {
      fail();
    }
  });

  // ESC: inputu temizle
  input?.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      input.value = "";
      e.stopPropagation();
    }
  });

  // Geri gelince kapı açık kalmasın
  window.addEventListener("pageshow", () => {
    if (unlocked()) {
      gate.classList.add("is-closed");
      gate.setAttribute("aria-hidden","true");
    }
  });
})();
