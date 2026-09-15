/* ============ Louise Doces — interações ============ */

// Menu mobile
const hamburger = document.getElementById("hamburger");
const menu = document.getElementById("menu");

hamburger.addEventListener("click", () => {
  const open = menu.classList.toggle("open");
  hamburger.classList.toggle("open", open);
  hamburger.setAttribute("aria-expanded", String(open));
});

// Fecha o menu ao clicar em um link
menu.querySelectorAll("a").forEach((link) =>
  link.addEventListener("click", () => {
    menu.classList.remove("open");
    hamburger.classList.remove("open");
    hamburger.setAttribute("aria-expanded", "false");
  })
);

// Header ganha fundo ao rolar
const header = document.getElementById("header");
const onScroll = () => header.classList.toggle("scrolled", window.scrollY > 40);
window.addEventListener("scroll", onScroll, { passive: true });
onScroll();

// Animação de entrada dos elementos
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15 }
);

document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));

// Ano atual no rodapé
document.getElementById("year").textContent = new Date().getFullYear();

// ===== Filtros de produtos =====
const filterBtns = document.querySelectorAll(".filter-btn");
filterBtns.forEach((btn) =>
  btn.addEventListener("click", () => {
    filterBtns.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    const f = btn.dataset.filter;
    document.querySelectorAll(".card[data-category]").forEach((card) => {
      card.classList.toggle("hidden", f !== "todos" && card.dataset.category !== f);
    });
  })
);

// ===== Monte seu pedido (canvas interativo) =====
const BUILDER_PRODUCTS = {
  brigadeiros: {
    name: "Brigadeiros artesanais", price: 3.5, emoji: "🍫", img: "img/brigadeiros.jpg",
    flavors: ["Clássico", "Chocolate belga", "Pistache", "Ninho com avelã", "Morango"]
  },
  "bolo-pote": {
    name: "Bolo de pote (200 ml)", price: 9, emoji: "🫙", img: "img/pote.jpg",
    flavors: ["Chocolate", "Morango", "Pistache", "Maracujá"]
  },
  cupcakes: {
    name: "Cupcakes", price: 12, emoji: "🧁", img: "img/cupcakes.jpg",
    flavors: ["Chocolate", "Limão", "Morango", "Red velvet"]
  },
  sobremesa: {
    name: "Sobremesa fina", price: 18, emoji: "🍮", img: "img/torta.jpg",
    flavors: ["Chocolate com ganache", "Morango", "Pistache"]
  },
  encomenda: {
    name: "Bolo ou encomenda personalizada", price: null, emoji: "🎂", img: "img/bolo.jpg",
    flavors: []
  }
};
const WHATSAPP_NUM = "5511999999999";

const bProduct = document.getElementById("builder-produto");
const bSabor = document.getElementById("builder-sabor");
const saborField = document.getElementById("builder-sabor-field");
const bQtd = document.getElementById("builder-qtd");
const qtdField = document.getElementById("builder-qtd-field");
const builderSend = document.getElementById("builder-send");
const canvasImg = document.getElementById("canvas-img");
const chipName = document.getElementById("chip-name");
const chipQty = document.getElementById("chip-qty");
const chipFlavor = document.getElementById("chip-flavor");
const canvasTotal = document.getElementById("canvas-total");

const fmtBRL = (v) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

// Pré-carrega todas as fotos dos produtos para o canvas trocar na hora
Object.values(BUILDER_PRODUCTS).forEach((p) => {
  const img = new Image();
  img.src = p.img;
});

// "Pulinho" quando um valor muda
function bump(el) {
  el.classList.remove("bump");
  void el.offsetWidth; // reinicia a animação
  el.classList.add("bump");
}

// Troca a imagem do canvas: fade-out -> troca -> fade-in (100% determinístico)
let canvasTimer = null;
function swapCanvas(src) {
  if (canvasImg.dataset.src === src) return;
  clearTimeout(canvasTimer);
  canvasImg.classList.add("switching");
  canvasTimer = setTimeout(() => {
    canvasImg.src = src;
    canvasImg.dataset.src = src;
    setTimeout(() => canvasImg.classList.remove("switching"), 80);
  }, 240);
}

// Recria as opções de sabor conforme o produto
function refreshSaborOptions() {
  const p = BUILDER_PRODUCTS[bProduct.value];
  const current = bSabor.value;
  bSabor.innerHTML = "";
  p.flavors.forEach((f) => {
    const opt = document.createElement("option");
    opt.value = f;
    opt.textContent = f;
    bSabor.appendChild(opt);
  });
  if (p.flavors.includes(current)) bSabor.value = current;
}

// Atualiza canvas + preço em tempo real
function updateBuilder() {
  const p = BUILDER_PRODUCTS[bProduct.value];
  const isCustom = p.price === null;
  const qtd = Math.min(999, Math.max(1, parseInt(bQtd.value, 10) || 1));
  bQtd.value = qtd;

  qtdField.classList.toggle("hidden", isCustom);
  saborField.classList.toggle("hidden", isCustom);
  refreshSaborOptions();

  // Chips do canvas
  const nameText = p.emoji + " " + p.name;
  if (chipName.dataset.text !== nameText) {
    chipName.innerHTML = p.emoji + ' <strong>' + p.name + "</strong>";
    chipName.dataset.text = nameText;
    bump(chipName);
  }

  const qtyText = isCustom ? "Sob encomenda" : "× " + qtd;
  if (chipQty.dataset.text !== qtyText) {
    chipQty.textContent = qtyText;
    chipQty.dataset.text = qtyText;
    bump(chipQty);
  }

  const flavorText = isCustom ? "Personalizado" : "Sabor: " + bSabor.value;
  if (chipFlavor.dataset.text !== flavorText) {
    chipFlavor.textContent = flavorText;
    chipFlavor.dataset.text = flavorText;
    bump(chipFlavor);
  }

  // Preço em tempo real
  const total = isCustom ? "Orçamento" : fmtBRL(p.price * qtd);
  if (canvasTotal.dataset.text !== total) {
    canvasTotal.textContent = total;
    canvasTotal.dataset.text = total;
    bump(canvasTotal);
  }

  // Imagem do canvas acompanha a escolha
  swapCanvas(p.img);

  // Mensagem do WhatsApp
  const msg = isCustom
    ? "Olá! Gostaria de um orçamento para: " + p.name + ". Pode me ajudar? 🎂"
    : "Olá! Quero fazer um pedido: " + qtd + "x " + p.name.toLowerCase() +
      ", sabor " + bSabor.value.toLowerCase() +
      " (total estimado " + fmtBRL(p.price * qtd) + "). Pode me confirmar? 🧁";
  builderSend.href = "https://wa.me/" + WHATSAPP_NUM + "?text=" + encodeURIComponent(msg);
}

document.getElementById("qty-minus").addEventListener("click", () => {
  bQtd.value = Math.max(1, (parseInt(bQtd.value, 10) || 1) - 1);
  updateBuilder();
});
document.getElementById("qty-plus").addEventListener("click", () => {
  bQtd.value = Math.min(999, (parseInt(bQtd.value, 10) || 1) + 1);
  updateBuilder();
});
bQtd.addEventListener("input", updateBuilder);
bProduct.addEventListener("change", updateBuilder);
bSabor.addEventListener("change", updateBuilder);
updateBuilder();

// ===== FAQ acordeão =====
document.querySelectorAll(".faq-q").forEach((btn) =>
  btn.addEventListener("click", () => {
    const item = btn.parentElement;
    const wasOpen = item.classList.contains("open");
    document.querySelectorAll(".faq-item.open").forEach((i) => i.classList.remove("open"));
    if (!wasOpen) item.classList.add("open");
    btn.setAttribute("aria-expanded", String(!wasOpen));
  })
);

// ===== Contadores animados =====
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const setCount = (el, v) => {
  const decimals = (el.dataset.count.split(".")[1] || "").length;
  el.textContent = v.toFixed(decimals).replace(".", ",");
};
if (reduceMotion) {
  document.querySelectorAll(".count").forEach((el) => setCount(el, parseFloat(el.dataset.count)));
} else {
  const countObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        countObserver.unobserve(el);
        const target = parseFloat(el.dataset.count);
        const duration = 1400;
        const start = performance.now();
        (function tick(now) {
          const p = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - p, 3);
          setCount(el, target * eased);
          if (p < 1) requestAnimationFrame(tick);
        })(start);
      });
    },
    { threshold: 0.5 }
  );
  document.querySelectorAll(".count").forEach((el) => countObserver.observe(el));
}

// ===== Voltar ao topo =====
const toTop = document.getElementById("toTop");
window.addEventListener(
  "scroll",
  () => toTop.classList.toggle("show", window.scrollY > 600),
  { passive: true }
);
toTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
