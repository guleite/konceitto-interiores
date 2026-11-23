/* =========================================================
   KONCEITTO INTERIORES — scripts
   - abertura, topo, menu, rolagem suave, revelações e parallax
   - contadores, galeria horizontal de ambientes, cursor
   - formulário qualificador que termina no WhatsApp
   ========================================================= */

// WhatsApp da Konceitto: formato internacional, só dígitos (número visto no Instagram)
const KONCEITTO_WHATSAPP = "5561998491035";
// Endereço opcional para receber o lead (CRM, planilha, e-mail). Vazio = não envia.
const KONCEITTO_LEAD_ENDPOINT = "";

const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
const finePointer = matchMedia("(hover: hover) and (pointer: fine)").matches;
const hasGsap = !!(window.gsap && window.ScrollTrigger);
const isDesktop = () => matchMedia("(min-width: 861px)").matches;
const track = (event, data = {}) => { (window.dataLayer = window.dataLayer || []).push({ event, ...data }); };

document.body.classList.toggle("js", hasGsap && !reduced);
const animate = hasGsap && !reduced;
$$(".js-year").forEach((el) => (el.textContent = new Date().getFullYear()));

/* ---------- Rolagem suave ---------- */
let lenis = null;
if (hasGsap) gsap.registerPlugin(ScrollTrigger);
if (window.Lenis && !reduced) {
  lenis = new Lenis({ lerp: 0.085, smoothWheel: true });
  if (hasGsap) {
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add((t) => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
  } else {
    const raf = (t) => { lenis.raf(t); requestAnimationFrame(raf); };
    requestAnimationFrame(raf);
  }
}
const lockScroll = (on) => {
  document.body.classList.toggle("is-locked", on);
  if (lenis) on ? lenis.stop() : lenis.start();
};
const scrollToEl = (t) => {
  if (!t) return;
  if (lenis) lenis.scrollTo(t, { duration: 1.5 });
  else t.scrollIntoView({ behavior: reduced ? "auto" : "smooth" });
};
document.addEventListener("click", (e) => {
  const a = e.target.closest('a[href^="#"]');
  if (!a || a.hasAttribute("data-open-lead")) return;
  const id = a.getAttribute("href");
  if (id.length < 2) return;
  const t = document.querySelector(id);
  if (!t) return;
  e.preventDefault();
  if (document.documentElement.classList.contains("menu-open")) closeMenu();
  scrollToEl(t);
});

/* ---------- Quebra de títulos em palavras ---------- */
$$("[data-split]").forEach((el) => {
  el.innerHTML = el.textContent.trim().split(/\s+/).map((w) => `<span class="w"><span>${w}</span></span>`).join(" ");
});

/* ---------- Contadores ---------- */
const countUp = (el, delay = 0) => {
  const end = +el.dataset.count;
  if (!animate) { el.textContent = end; return; }
  const o = { v: 0 };
  gsap.to(o, { v: end, duration: 2, delay, ease: "power3.out", onUpdate: () => (el.textContent = Math.round(o.v)) });
};

/* ---------- Abertura + hero ---------- */
const showChrome = () => $(".wa-float")?.classList.add("is-in");
function heroIntro(tl) {
  tl.fromTo(".hero__media img", { scale: 1.25 }, { scale: 1, duration: 2.4, ease: "expo.out" }, 0)
    .to(".hero__title .line > span", { y: 0, duration: 1.4, stagger: 0.1, ease: "expo.out" }, 0.25)
    .to("[data-hero]", { opacity: 1, y: 0, duration: 1.1, stagger: 0.08, ease: "expo.out" }, 0.55)
    .add(() => $$(".hero__stats [data-count]").forEach((el, i) => countUp(el, i * 0.1)), 0.7)
    .add(showChrome, 1.2);
}
if (animate) {
  $$(".hero__stats [data-count]").forEach((el) => (el.textContent = "0"));
  lockScroll(true);
  const tl = gsap.timeline({ onComplete: () => { $(".loader").remove(); document.body.classList.remove("is-loading"); } });
  tl.to(".loader__icon rect, .loader__icon path", { strokeDashoffset: 0, duration: 1.1, stagger: 0.06, ease: "power2.inOut" })
    .to(".loader__word span", { y: 0, duration: 0.9, stagger: 0.04, ease: "expo.out" }, 0.35)
    .to(".loader__tag", { opacity: 1, duration: 0.6 }, 0.9)
    .to(".loader__inner", { opacity: 0, y: -20, duration: 0.6, ease: "power2.in" }, 1.75)
    .to(".loader", { clipPath: "inset(0 0 100% 0)", duration: 1.1, ease: "expo.inOut" }, 2.1)
    .add(() => lockScroll(false), 2.4);
  const h = gsap.timeline();
  tl.add(h, 2.35);
  heroIntro(h);
} else {
  $(".loader")?.remove();
  document.body.classList.remove("is-loading");
  showChrome();
}

/* ---------- Topo: some ao descer, volta ao subir ---------- */
const nav = $(".nav");
let lastY = 0;
const onScroll = (y) => {
  nav.classList.toggle("is-solid", y > innerHeight * 0.6);
  if (!document.documentElement.classList.contains("menu-open")) nav.classList.toggle("is-hidden", y > lastY && y > innerHeight);
  lastY = y;
};
if (lenis) lenis.on("scroll", ({ scroll }) => onScroll(scroll));
else addEventListener("scroll", () => onScroll(scrollY), { passive: true });

/* ---------- Menu ---------- */
const burger = $(".nav__burger");
function openMenu() {
  document.documentElement.classList.add("menu-open");
  burger.setAttribute("aria-expanded", "true");
  $(".menu").setAttribute("aria-hidden", "false");
  lockScroll(true);
  if (animate) gsap.fromTo(".menu nav a", { y: 40, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.06, duration: 0.9, delay: 0.25, ease: "expo.out" });
}
function closeMenu() {
  document.documentElement.classList.remove("menu-open");
  burger.setAttribute("aria-expanded", "false");
  $(".menu").setAttribute("aria-hidden", "true");
  lockScroll(false);
}
burger.addEventListener("click", () => (document.documentElement.classList.contains("menu-open") ? closeMenu() : openMenu()));

/* ---------- Animações de rolagem ---------- */
if (animate) {
  // títulos palavra a palavra
  $$("[data-split]").forEach((el) => {
    gsap.to($$(".w > span", el), {
      y: 0, duration: 1.2, stagger: 0.04, ease: "expo.out",
      scrollTrigger: { trigger: el, start: "top 86%" },
    });
  });
  // blocos de texto
  ScrollTrigger.batch("[data-reveal]", {
    start: "top 90%",
    onEnter: (els) => gsap.to(els, { opacity: 1, y: 0, duration: 1.1, stagger: 0.1, ease: "expo.out", overwrite: true }),
  });
  // imagens: cortina + zoom
  $$(".reveal-img").forEach((box) => {
    const img = $("img", box);
    gsap.timeline({ scrollTrigger: { trigger: box, start: "top 88%" } })
      .to(box, { clipPath: "inset(0% 0 0 0)", duration: 1.5, ease: "expo.inOut" })
      .to(img, { scale: 1, duration: 1.8, ease: "expo.out" }, 0.15);
  });
  // números de seção
  $$(".sec-num .num").forEach((n) => {
    gsap.from(n, { yPercent: 100, duration: 1.2, ease: "expo.out", scrollTrigger: { trigger: n, start: "top 90%" } });
  });
  // contadores fora do hero
  $$(".why [data-count]").forEach((el) => {
    el.textContent = "0";
    ScrollTrigger.create({ trigger: el, start: "top 90%", once: true, onEnter: () => countUp(el) });
  });
  // parallax: blocos com data-speed
  $$("[data-speed]").forEach((el) => {
    const s = +el.dataset.speed;
    gsap.fromTo(el.parentElement, { yPercent: -s }, {
      yPercent: s, ease: "none",
      scrollTrigger: { trigger: el.parentElement, start: "top bottom", end: "bottom top", scrub: true },
    });
  });
  // parallax: imagem dentro do quadro
  $$("[data-parallax]").forEach((img) => {
    gsap.fromTo(img, { yPercent: -10 }, {
      yPercent: 0, ease: "none",
      scrollTrigger: { trigger: img.parentElement, start: "top bottom", end: "bottom top", scrub: true },
    });
  });
  // hero: imagem desce e conteúdo some ao rolar
  gsap.to(".hero__media img", { yPercent: 12, ease: "none", scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true } });
  gsap.to(".hero__content, .hero__stats", { opacity: 0, y: -60, ease: "none", scrollTrigger: { trigger: ".hero", start: "20% top", end: "75% top", scrub: true } });
  // vidros do CTA entram em sequência
  gsap.from(".cta__bg img", { scale: 1.2, ease: "none", scrollTrigger: { trigger: ".cta", start: "top bottom", end: "center center", scrub: true } });
  // marca gigante do rodapé
  gsap.from(".footer__word span", {
    yPercent: 100, duration: 1.4, stagger: 0.05, ease: "expo.out",
    scrollTrigger: { trigger: ".footer__word", start: "top 95%" },
  });
  // marquee acelera com a rolagem
  const mq = $(".marquee__track");
  ScrollTrigger.create({
    trigger: ".marquee", start: "top bottom", end: "bottom top",
    onUpdate: (st) => { mq.style.animationDuration = `${Math.max(14, 38 - Math.abs(st.getVelocity()) / 60)}s`; },
  });
}

/* ---------- Ambientes: rolagem horizontal fixada (desktop) ---------- */
if (animate) {
  const mm = gsap.matchMedia();
  mm.add("(min-width: 861px)", () => {
    const trackEl = $(".rooms__track");
    const dist = () => trackEl.scrollWidth - (innerWidth - trackEl.getBoundingClientRect().left) + 40;
    const tw = gsap.to(trackEl, {
      x: () => -dist(), ease: "none",
      scrollTrigger: {
        trigger: ".rooms", start: "top top", end: () => `+=${dist()}`, pin: ".rooms__pin", scrub: 0.8, invalidateOnRefresh: true,
        onUpdate: (st) => gsap.set(".rooms__bar i", { scaleX: st.progress }),
      },
    });
    gsap.from(".room", { y: 80, opacity: 0, duration: 1.2, stagger: 0.08, ease: "expo.out", scrollTrigger: { trigger: ".rooms", start: "top 70%" } });
    return () => tw.scrollTrigger?.kill();
  });
}

/* ---------- Cursor "Ver" nos projetos ---------- */
if (finePointer && animate) {
  const cur = $(".cursor");
  const xTo = gsap.quickTo(cur, "x", { duration: 0.5, ease: "power3" });
  const yTo = gsap.quickTo(cur, "y", { duration: 0.5, ease: "power3" });
  addEventListener("pointermove", (e) => { xTo(e.clientX); yTo(e.clientY); });
  $$("[data-cursor]").forEach((c) => {
    c.addEventListener("pointerenter", () => cur.classList.add("is-on"));
    c.addEventListener("pointerleave", () => cur.classList.remove("is-on"));
    c.addEventListener("click", () => openLead(null, c));
  });
  // botões magnéticos
  $$("[data-magnetic]").forEach((b) => {
    b.addEventListener("pointermove", (e) => {
      const r = b.getBoundingClientRect();
      gsap.to(b, { x: (e.clientX - r.left - r.width / 2) * 0.25, y: (e.clientY - r.top - r.height / 2) * 0.35, duration: 0.6, ease: "power3" });
    });
    b.addEventListener("pointerleave", () => gsap.to(b, { x: 0, y: 0, duration: 0.9, ease: "elastic.out(1, .4)" }));
  });
} else {
  $$("[data-cursor]").forEach((c) => c.addEventListener("click", () => openLead(null, c)));
}

/* ---------- FAQ: abre um por vez, com altura suave ---------- */
$$(".acc__item").forEach((d) => {
  const sum = $("summary", d), body = $(".acc__body", d);
  sum.addEventListener("click", (e) => {
    e.preventDefault();
    const opening = !d.open;
    $$(".acc__item[open]").forEach((o) => { if (o !== d) toggleAcc(o, false); });
    toggleAcc(d, opening);
  });
  function toggleAcc(item, open) {
    const b = $(".acc__body", item);
    if (!animate) { item.open = open; return; }
    if (open) {
      item.open = true;
      gsap.fromTo(b, { height: 0, opacity: 0 }, { height: "auto", opacity: 1, duration: 0.7, ease: "expo.out", onComplete: () => ScrollTrigger.refresh() });
    } else {
      gsap.to(b, { height: 0, opacity: 0, duration: 0.5, ease: "expo.out", onComplete: () => { item.open = false; gsap.set(b, { clearProps: "all" }); ScrollTrigger.refresh(); } });
    }
  }
  void body;
});

/* =========================================================
   FORMULÁRIO QUALIFICADOR → WhatsApp
   ========================================================= */
const lead = $("#lead"), form = $(".lead__form", lead);
const qs = $$(".q:not(.q--done)", form);
const nextBtn = $(".lead__next", lead), backBtn = $(".lead__back", lead);
let step = 0, leadTrigger = null;

const answered = (i) => {
  const q = qs[i];
  if (q.classList.contains("q--form")) return true;
  return !!$("input:checked", q);
};
function showStep(i) {
  step = i;
  qs.forEach((q, k) => q.classList.toggle("is-on", k === i));
  $(".q--done", form).classList.remove("is-on");
  $(".lead__progress i").style.width = `${((i + 1) / (qs.length + 1)) * 100}%`;
  $(".js-step").textContent = i + 1;
  backBtn.classList.toggle("is-on", i > 0);
  nextBtn.disabled = !answered(i);
  $("span", nextBtn).textContent = i === qs.length - 1 ? "Ir para o WhatsApp" : "Continuar";
  track("lead_step", { step: i + 1 });
}
function openLead(room, trigger) {
  leadTrigger = trigger || document.activeElement;
  form.reset();
  $(".err", form).textContent = "";
  $$(".is-bad", form).forEach((x) => x.classList.remove("is-bad"));
  lead.classList.remove("is-done");
  if (room) {
    const c = $$('input[name="ambiente"]', form).find((x) => x.value === room);
    if (c) c.checked = true;
  }
  showStep(0);
  lead.classList.add("is-open");
  lead.setAttribute("aria-hidden", "false");
  lockScroll(true);
  track("lead_open", { room: room || "" });
  setTimeout(() => $("input", qs[0])?.focus({ preventScroll: true }), 500);
}
function closeLead() {
  lead.classList.remove("is-open");
  lead.setAttribute("aria-hidden", "true");
  lockScroll(false);
  leadTrigger?.focus?.({ preventScroll: true });
}
$$("[data-open-lead]").forEach((b) => b.addEventListener("click", (e) => {
  e.preventDefault();
  if (document.documentElement.classList.contains("menu-open")) closeMenu();
  openLead(b.dataset.room || null, b);
}));
$$("[data-close-lead]", lead).forEach((b) => b.addEventListener("click", closeLead));

form.addEventListener("change", (e) => {
  if (e.target.type === "checkbox" && e.target.name === "ambiente") { nextBtn.disabled = !answered(step); return; }
  if (e.target.type !== "radio") return;
  nextBtn.disabled = false;
  const at = step;
  setTimeout(() => { if (step === at && lead.classList.contains("is-open")) showStep(at + 1); }, 380);
});
backBtn.addEventListener("click", () => step > 0 && showStep(step - 1));
nextBtn.addEventListener("click", () => {
  if (step < qs.length - 1) { if (answered(step)) showStep(step + 1); return; }
  submitLead();
});
form.addEventListener("submit", (e) => { e.preventDefault(); if (step === qs.length - 1) submitLead(); });
$$(".q--form input", form).forEach((inp) => inp.addEventListener("keydown", (e) => { if (e.key === "Enter") { e.preventDefault(); submitLead(); } }));

// máscara do telefone
const tel = $('input[name="whatsapp"]', form);
tel.addEventListener("input", () => {
  const d = tel.value.replace(/\D/g, "").slice(0, 11);
  let out = d;
  if (d.length > 2) out = `(${d.slice(0, 2)}) ${d.slice(2)}`;
  if (d.length > 7) out = `(${d.slice(0, 2)}) ${d.slice(2, d.length - 4)}-${d.slice(-4)}`;
  tel.value = out;
});

function submitLead() {
  const fd = new FormData(form);
  const nome = (fd.get("nome") || "").trim();
  const fone = (fd.get("whatsapp") || "").replace(/\D/g, "");
  const err = $(".err", form);
  $$(".is-bad", form).forEach((x) => x.classList.remove("is-bad"));
  if (nome.length < 2) { $('input[name="nome"]', form).classList.add("is-bad"); err.textContent = "Conte pra gente o seu nome."; return; }
  if (fone.length < 10) { tel.classList.add("is-bad"); err.textContent = "Confira o seu WhatsApp com DDD."; return; }
  if (!fd.get("lgpd")) { err.textContent = "Precisamos do seu ok para entrar em contato."; return; }
  err.textContent = "";

  const payload = {
    nome, whatsapp: fone, local: (fd.get("local") || "").trim(),
    ambientes: fd.getAll("ambiente").join(", "), fase: fd.get("fase") || "",
    projeto: fd.get("projeto") || "", prazo: fd.get("prazo") || "", investimento: fd.get("investimento") || "",
    estilo: fd.get("estilo") || "",
    origem: "LP Konceitto Interiores", pagina: location.href, data: new Date().toISOString(),
  };
  const linhas = [
    `Olá, Konceitto! Vim pelo site e quero um orçamento de marcenaria.`,
    ``,
    `• Ambientes: ${payload.ambientes || "-"}`,
    payload.estilo ? `• Estilo que gostei no simulador: ${payload.estilo}` : null,
    `• Fase do imóvel: ${payload.fase || "-"}`,
    `• Projeto: ${payload.projeto || "-"}`,
    `• Quando quero começar: ${payload.prazo || "-"}`,
    `• Investimento previsto: ${payload.investimento || "-"}`,
    ``,
    `Nome: ${nome}`,
    payload.local ? `Local: ${payload.local}` : null,
  ].filter((l) => l !== null);
  const url = `https://wa.me/${KONCEITTO_WHATSAPP}?text=${encodeURIComponent(linhas.join("\n"))}`;
  $(".js-wa", form).href = url;
  $(".js-name", form).textContent = nome.split(" ")[0];

  if (KONCEITTO_LEAD_ENDPOINT) {
    fetch(KONCEITTO_LEAD_ENDPOINT, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload), keepalive: true }).catch(() => {});
  } else {
    console.info("[lead]", payload);
  }
  track("lead_submit", { ambientes: payload.ambientes, fase: payload.fase, prazo: payload.prazo, investimento: payload.investimento });

  qs.forEach((q) => q.classList.remove("is-on"));
  $(".q--done", form).classList.add("is-on");
  $(".lead__progress i").style.width = "100%";
  lead.classList.add("is-done");
  window.open(url, "_blank", "noopener");
}

/* ---------- Esc fecha o que estiver aberto ---------- */
addEventListener("keydown", (e) => {
  if (e.key !== "Escape") return;
  if (lead.classList.contains("is-open")) return closeLead();
  if (document.documentElement.classList.contains("menu-open")) closeMenu();
});

addEventListener("load", () => hasGsap && ScrollTrigger.refresh());
