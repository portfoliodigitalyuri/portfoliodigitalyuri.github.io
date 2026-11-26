// TROQUE pelo seu número: código do país + DDD + número, só dígitos (ex.: 5517999999999)
const WHATSAPP = "5517991056717";

// Links de WhatsApp: cada botão leva a mensagem do seu data-msg
document.querySelectorAll("[data-wa]").forEach((a) => {
  const msg = a.dataset.msg || "";
  a.href = "https://wa.me/" + WHATSAPP + "?text=" + encodeURIComponent(msg);
  a.target = "_blank";
  a.rel = "noopener";
});

// Demonstração do hero: escolhe o projeto e a tela
const NEGOCIOS = {
  dentista: "clínica odontológica",
  petshop: "pet shop",
  chaveiro: "chaveiro",
  lanchonete: "lanchonete",
};
const TELAS = { "site-hero": "site", inbox: "caixa de entrada", agenda: "agenda" };
// A lanchonete só tem a tela do cardápio
const SO_UMA_TELA = { lanchonete: "img/lanchonete-home.png" };

const img = document.getElementById("demo-img");
const janela = document.getElementById("janela");
const telas = document.getElementById("demo-telas");
const estado = { negocio: "dentista", tela: "site-hero" };

function atualizar() {
  const unica = SO_UMA_TELA[estado.negocio];
  telas.hidden = Boolean(unica);
  janela.classList.toggle("janela-unica", Boolean(unica));
  if (unica) {
    img.src = unica;
    img.alt = "Demonstração do cardápio online da lanchonete (dados fictícios)";
    return;
  }
  img.src = "img/" + estado.negocio + "-" + estado.tela + ".png";
  img.alt =
    "Demonstração de " + TELAS[estado.tela] + " de " + NEGOCIOS[estado.negocio] + " (dados fictícios)";
}

function ligar(seletor, chave) {
  const botoes = document.querySelectorAll(seletor);
  botoes.forEach((b) =>
    b.addEventListener("click", () => {
      estado[chave] = b.dataset[chave];
      botoes.forEach((x) => x.setAttribute("aria-selected", String(x === b)));
      atualizar();
    })
  );
}
ligar("[data-negocio]", "negocio");
ligar("[data-tela]", "tela");

// Modal: os projetos em tela cheia, trocando com as setas ou arrastando para o lado
const ORDEM = ["dentista", "petshop", "chaveiro", "lanchonete"];
const TITULOS = {
  dentista: "Clínica odontológica",
  petshop: "Pet shop",
  chaveiro: "Chaveiro 24 horas",
  lanchonete: "Lanchonete com pedidos online",
};
const modal = document.getElementById("modal");
const mImg = document.getElementById("modal-img");
const mTelas = document.getElementById("modal-telas");
const mBotoes = mTelas.querySelectorAll("[data-mtela]");
const mPontos = document.querySelectorAll("#modal-pontos i");
const celular = window.matchMedia("(max-width: 46rem)");

function mostrarModal() {
  const unica = SO_UMA_TELA[estado.negocio];
  const i = ORDEM.indexOf(estado.negocio);
  document.getElementById("modal-titulo").textContent = TITULOS[estado.negocio];
  document.getElementById("modal-contagem").textContent = i + 1 + " de " + ORDEM.length;
  mPontos.forEach((p, n) => p.classList.toggle("ativo", n === i));
  mTelas.hidden = Boolean(unica);
  document.getElementById("modal-unica").hidden = !unica;
  mBotoes.forEach((b) => b.setAttribute("aria-selected", String(b.dataset.mtela === estado.tela)));
  mImg.classList.remove("entra");
  void mImg.offsetWidth; // reinicia a animação
  mImg.classList.add("entra");
  if (unica) {
    mImg.src = unica;
    mImg.alt = "Cardápio online da lanchonete (dados fictícios)";
  } else {
    // no celular, "O site" mostra a versão para celular, que ocupa a tela inteira
    const tela = estado.tela === "site-hero" && celular.matches ? "site-mobile" : estado.tela;
    mImg.src = "img/" + estado.negocio + "-" + tela + ".png";
    mImg.alt = TELAS[estado.tela] + " de " + NEGOCIOS[estado.negocio] + " (dados fictícios)";
  }
}

// Mantém a demonstração do topo igual ao que foi visto no modal
function sincronizarHero() {
  document.querySelectorAll("[data-negocio]").forEach((b) =>
    b.setAttribute("aria-selected", String(b.dataset.negocio === estado.negocio))
  );
  document.querySelectorAll("[data-tela]").forEach((b) =>
    b.setAttribute("aria-selected", String(b.dataset.tela === estado.tela))
  );
  atualizar();
}

function passo(n) {
  const i = (ORDEM.indexOf(estado.negocio) + n + ORDEM.length) % ORDEM.length;
  estado.negocio = ORDEM[i];
  mostrarModal();
}

function abrirModal(negocio, tela) {
  if (negocio) estado.negocio = negocio;
  if (tela) estado.tela = tela;
  mostrarModal();
  document.documentElement.classList.add("sem-rolagem");
  modal.showModal();
  // carrega as outras telas enquanto a pessoa olha a primeira
  ORDEM.forEach((n) =>
    ["site-hero", "inbox", "agenda"].forEach((t) => {
      const arq = t === "site-hero" && celular.matches ? "site-mobile" : t;
      if (!SO_UMA_TELA[n]) new Image().src = "img/" + n + "-" + arq + ".png";
    })
  );
}

modal.addEventListener("close", () => {
  document.documentElement.classList.remove("sem-rolagem");
  sincronizarHero();
});
document.getElementById("modal-fechar").addEventListener("click", () => modal.close());
// clique fora do conteúdo fecha
modal.addEventListener("click", (e) => {
  if (e.target === modal) modal.close();
});
modal.querySelectorAll("[data-passo]").forEach((b) =>
  b.addEventListener("click", () => passo(Number(b.dataset.passo)))
);
mBotoes.forEach((b) =>
  b.addEventListener("click", () => {
    estado.tela = b.dataset.mtela;
    mostrarModal();
  })
);
modal.addEventListener("keydown", (e) => {
  if (e.key === "ArrowLeft") passo(-1);
  if (e.key === "ArrowRight") passo(1);
});

// Arrastar para o lado no celular
let toqueX = null;
let toqueY = null;
const palco = document.getElementById("modal-palco");
palco.addEventListener("touchstart", (e) => {
  toqueX = e.touches[0].clientX;
  toqueY = e.touches[0].clientY;
}, { passive: true });
palco.addEventListener("touchend", (e) => {
  if (toqueX === null) return;
  const dx = e.changedTouches[0].clientX - toqueX;
  const dy = e.changedTouches[0].clientY - toqueY;
  toqueX = null;
  if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) passo(dx < 0 ? 1 : -1);
});

// O que abre o modal: a janela do topo e as imagens da seção de projetos
document.getElementById("abrir-modal").addEventListener("click", () => abrirModal());
img.addEventListener("click", () => abrirModal());
document.querySelectorAll("[data-projeto]").forEach((caso) => {
  caso.querySelectorAll(".caso-telas img").forEach((foto) => {
    foto.tabIndex = 0;
    foto.setAttribute("role", "button");
    const tela = foto.classList.contains("t-painel") ? "inbox" : "site-hero";
    const abrir = () => abrirModal(caso.dataset.projeto, tela);
    foto.addEventListener("click", abrir);
    foto.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        abrir();
      }
    });
  });
});
