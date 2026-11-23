/* =========================================================
   KONCEITTO — novas seções
   - imagem que se expande ao rolar
   - simulador de estilos (sala vazia → estilos de marcenaria)
   - detalhes com imagem fixa que troca
   Usa $, $$, animate, track e openLead de main.js
   ========================================================= */

/* ---------- Imagem que se expande ---------- */
if (animate) {
  const mobile = matchMedia("(max-width: 860px)").matches;
  const [iy, ix] = mobile ? [29, 18] : [28, 35];
  const frame = $(".expand__frame");
  const clip = { v: 1 };
  const draw = () => { frame.style.clipPath = `inset(${iy * clip.v}% ${ix * clip.v}% ${iy * clip.v}% ${ix * clip.v}%)`; };
  draw();
  gsap.set(".expand__frame img", { scale: 1.3 });
  const tl = gsap.timeline({
    scrollTrigger: { trigger: ".expand", start: "top top", end: "+=160%", pin: ".expand__pin", scrub: 0.8, refreshPriority: 1 },
  });
  tl.to(clip, { v: 0, ease: "none", duration: 1, onUpdate: draw }, 0)
    .to(".expand__frame img", { scale: 1, ease: "none", duration: 1 }, 0)
    .to(".expand__word--l", { x: mobile ? "-60vw" : "-35vw", opacity: 0, ease: "none", duration: 0.7 }, 0)
    .to(".expand__word--r", { x: mobile ? "60vw" : "35vw", opacity: 0, ease: "none", duration: 0.7 }, 0)
    .to(".expand__final > *", { opacity: 1, y: 0, stagger: 0.08, duration: 0.35, ease: "power2.out" }, 0.8);
}

/* ---------- Simulador de estilos ---------- */
const STYLES = {
  vazia: {
    name: "Sala vazia",
    desc: "Paredes nuas, piso pronto e muita possibilidade. Escolha um estilo e veja a transformação.",
    chips: [], cta: "Quero planejar minha sala",
  },
  contemporaneo: {
    name: "Contemporâneo amadeirado",
    desc: "Painel ripado em freijó do piso ao teto, rack suspenso com LED e nicho iluminado. Aconchegante e atual.",
    chips: ["Lâmina de freijó", "Ripado", "Rack suspenso", "LED embutido"], cta: "Quero minha sala assim",
  },
  minimalista: {
    name: "Minimalista",
    desc: "Armários do piso ao teto em laca off-white, portas sem puxador e nicho em carvalho claro. Leve e silencioso.",
    chips: ["Laca fosca", "Abertura por toque", "Carvalho claro", "Linhas retas"], cta: "Quero minha sala assim",
  },
  urbano: {
    name: "Urbano grafite",
    desc: "Painel em MDF grafite, estante em metal preto com prateleiras de nogueira e luz quente. Sofisticado e marcante.",
    chips: ["MDF grafite", "Nogueira", "Metal preto", "Prateleiras iluminadas"], cta: "Quero minha sala assim",
  },
  classico: {
    name: "Clássico atemporal",
    desc: "Boiserie em laca greige, cristaleiras com perfis dourados e tampo em mármore. Elegância que não sai de moda.",
    chips: ["Boiserie", "Laca acetinada", "Perfis dourados", "Cristaleiras iluminadas"], cta: "Quero minha sala assim",
  },
};
(() => {
  const sec = $(".styler");
  if (!sec) return;
  const stage = $(".styler__stage", sec);
  const imgs = $$(".styler__img", sec);
  const tabs = $$(".styler__tabs button", sec);
  const scan = $(".styler__scan", sec);
  const cmpBtn = $(".styler__compare", sec);
  const before = $(".styler__before", sec);
  const handle = $(".styler__handle", sec);
  const cta = $(".js-style-cta", sec);
  let current = "vazia", touched = false, busy = null;

  function setInfo(key) {
    const s = STYLES[key];
    $(".js-style-name", sec).textContent = s.name;
    $(".js-style-desc", sec).textContent = s.desc;
    $(".js-style-chips", sec).innerHTML = s.chips.map((c) => `<li>${c}</li>`).join("");
    $("span", cta).textContent = s.cta;
    cta.dataset.style = key;
    cmpBtn.hidden = key === "vazia";
    if (key === "vazia") setCompare(false);
    if (animate) gsap.fromTo([".js-style-desc", ".js-style-chips li"], { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.6, stagger: 0.04, ease: "expo.out" });
  }

  function select(key) {
    if (key === current) return;
    const next = imgs.find((i) => i.dataset.style === key);
    const prev = imgs.find((i) => i.dataset.style === current);
    current = key;
    tabs.forEach((t) => t.setAttribute("aria-selected", String(t.dataset.style === key)));
    setInfo(key);
    track("style_select", { style: key });

    if (!animate) {
      imgs.forEach((i) => i.classList.toggle("is-on", i === next));
      return;
    }
    busy?.progress(1);
    next.loading = "eager";
    const ready = next.complete && next.naturalWidth ? Promise.resolve() : (next.decode ? next.decode() : Promise.resolve()).catch(() => {});
    ready.then(() => { if (current === key) wipe(next, prev); });
  }

  function wipe(next, last) {
    const prev = imgs.find((i) => i !== next && i.classList.contains("is-on")) || last;
    imgs.forEach((i) => { i.classList.remove("is-prev"); if (i !== next) i.classList.remove("is-on"); i.style.zIndex = 0; });
    prev.classList.remove("is-on"); prev.classList.add("is-prev"); prev.style.zIndex = 1;
    next.classList.add("is-on"); next.style.zIndex = 2;
    busy = gsap.timeline({
      onComplete: () => { prev.classList.remove("is-prev"); gsap.set(next, { clearProps: "clipPath,scale" }); busy = null; },
    });
    busy.fromTo(next, { clipPath: "inset(0 100% 0 0)", scale: 1.06 }, { clipPath: "inset(0 0% 0 0)", scale: 1, duration: 1.4, ease: "power3.inOut" }, 0)
      .fromTo(scan, { left: "0%", opacity: 1 }, { left: "100%", duration: 1.4, ease: "power3.inOut" }, 0)
      .to(scan, { opacity: 0, duration: 0.25 }, 1.25);
  }

  tabs.forEach((t, i) => {
    t.addEventListener("click", () => { touched = true; select(t.dataset.style); });
    t.addEventListener("keydown", (e) => {
      if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
      const n = tabs[(i + (e.key === "ArrowRight" ? 1 : -1) + tabs.length) % tabs.length];
      n.focus(); n.click();
    });
  });

  // comparar antes / depois
  let pos = 50, dragging = false;
  const place = (p) => {
    pos = Math.max(4, Math.min(96, p));
    handle.style.left = `${pos}%`;
    before.style.clipPath = `inset(0 ${100 - pos}% 0 0)`;
  };
  function setCompare(on) {
    sec.classList.toggle("is-compare", on);
    cmpBtn.textContent = on ? "Fechar comparação" : "Comparar com a sala vazia";
    if (on) {
      place(50);
      if (animate) { const o = { p: 92 }; place(92); gsap.to(o, { p: 50, duration: 1.1, ease: "expo.out", onUpdate: () => place(o.p) }); }
    }
  }
  cmpBtn.addEventListener("click", () => { touched = true; setCompare(!sec.classList.contains("is-compare")); });
  const fromEvent = (e) => { const r = stage.getBoundingClientRect(); return ((e.clientX - r.left) / r.width) * 100; };
  stage.addEventListener("pointerdown", (e) => {
    if (!sec.classList.contains("is-compare") || e.target.closest("button")) return;
    dragging = true; stage.setPointerCapture(e.pointerId); place(fromEvent(e));
  });
  stage.addEventListener("pointermove", (e) => { if (dragging) place(fromEvent(e)); });
  stage.addEventListener("pointerup", () => (dragging = false));
  stage.addEventListener("pointercancel", () => (dragging = false));

  // o pedido leva o estilo escolhido
  cta.addEventListener("click", () => {
    const form = $(".lead__form");
    const key = cta.dataset.style || "vazia";
    form.elements.estilo.value = key === "vazia" ? "" : STYLES[key].name;
    const sala = $$('input[name="ambiente"]', form).find((x) => x.value === "Sala / painel de TV");
    if (sala) { sala.checked = true; form.dispatchEvent(new Event("change", { bubbles: true })); }
    $(".lead__next").disabled = false;
  });

  setInfo("vazia");

  // pré-carrega os estilos quando a seção se aproxima
  const pre = new IntersectionObserver(([en]) => {
    if (!en.isIntersecting) return;
    pre.disconnect();
    imgs.forEach((i) => (i.loading = "eager"));
  }, { rootMargin: "1200px 0px" });
  pre.observe(stage);

  // demonstração automática: na primeira vez que a sala aparece, ela ganha móveis
  const demo = new IntersectionObserver(([en]) => {
    if (!en.isIntersecting) return;
    demo.disconnect();
    setTimeout(() => { if (!touched && current === "vazia") select("contemporaneo"); }, 900);
  }, { threshold: 0.6 });
  demo.observe(stage);
})();

/* ---------- Detalhes: imagem fixa que troca ---------- */
(() => {
  const dets = $$(".det");
  const pics = $$(".details__frame img");
  if (!dets.length) return;
  let on = 0;
  const pre = new IntersectionObserver(([en]) => {
    if (!en.isIntersecting) return;
    pre.disconnect();
    pics.forEach((p) => (p.loading = "eager"));
  }, { rootMargin: "1200px 0px" });
  pre.observe($(".details"));
  const io = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (!en.isIntersecting) return;
      const i = dets.indexOf(en.target);
      if (i === on) return;
      dets.forEach((d, k) => d.classList.toggle("is-on", k === i));
      pics.forEach((p, k) => {
        p.classList.toggle("is-under", k === on);
        p.classList.toggle("is-on", k === i);
      });
      on = i;
      $(".js-det-n").textContent = String(i + 1).padStart(2, "0");
    });
  }, { rootMargin: "-45% 0px -45% 0px" });
  dets.forEach((d) => io.observe(d));
})();

if (window.ScrollTrigger) { ScrollTrigger.sort(); ScrollTrigger.refresh(); }
