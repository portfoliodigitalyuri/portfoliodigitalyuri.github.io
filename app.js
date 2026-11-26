// TROQUE pelo seu número: código do país + DDD + número, só dígitos (ex.: 5517999999999)
const WHATSAPP = "5517991056717";

// Links de WhatsApp: cada botão leva a mensagem do seu data-msg
document.querySelectorAll("[data-wa]").forEach((a) => {
  const msg = a.dataset.msg || "";
  a.href = "https://wa.me/" + WHATSAPP + "?text=" + encodeURIComponent(msg);
  a.target = "_blank";
  a.rel = "noopener";
});

// Projetos e telas de cada um. A ordem aqui é a ordem do modal.
const ATENDIMENTO = [
  ["site-hero", "O site"],
  ["inbox", "Caixa de entrada"],
  ["agenda", "Agenda"],
];
const PROJETOS = {
  dentista: { titulo: "Clínica odontológica", nome: "clínica odontológica", telas: ATENDIMENTO },
  petshop: { titulo: "Pet shop", nome: "pet shop", telas: ATENDIMENTO },
  chaveiro: { titulo: "Chaveiro 24 horas", nome: "chaveiro", telas: ATENDIMENTO },
  lanchonete: {
    titulo: "Lanchonete com pedidos online",
    nome: "lanchonete",
    telas: [
      ["home", "Cardápio"],
      ["carrinho", "Carrinho"],
      ["cozinha", "Cozinha"],
    ],
  },
};
const ORDEM = Object.keys(PROJETOS);
// Telas que têm versão para celular (usada no modal em telas pequenas)
const TEM_CELULAR = { "site-hero": true, home: true };

const estado = { negocio: "dentista", tela: "site-hero" };
const celular = window.matchMedia("(max-width: 46rem)");

function arquivo(negocio, tela, noCelular) {
  const t = noCelular && TEM_CELULAR[tela] ? "site-mobile" : tela;
  return "img/" + negocio + "-" + t + ".png";
}
function rotulo(negocio, tela) {
  const par = PROJETOS[negocio].telas.find(([id]) => id === tela);
  return par ? par[1] : "";
}
function textoAlt(negocio, tela) {
  return rotulo(negocio, tela) + " · " + PROJETOS[negocio].nome + " (dados fictícios)";
}
// Ao trocar de projeto, mantém a tela se ela existir nele; senão, volta para a primeira
function telaValida() {
  const telas = PROJETOS[estado.negocio].telas;
  if (!telas.some(([id]) => id === estado.tela)) estado.tela = telas[0][0];
}

// Monta os botões de tela (do topo ou do modal) para o projeto atual
function montarTelas(container, aoEscolher) {
  const tinhaFoco = container.contains(document.activeElement);
  container.replaceChildren(
    ...PROJETOS[estado.negocio].telas.map(([id, texto]) => {
      const b = document.createElement("button");
      b.type = "button";
      b.setAttribute("role", "tab");
      b.setAttribute("aria-selected", String(id === estado.tela));
      b.textContent = texto;
      b.addEventListener("click", () => {
        estado.tela = id;
        aoEscolher();
      });
      return b;
    })
  );
  // o botão clicado foi recriado: devolve o foco para o selecionado
  if (tinhaFoco) container.querySelector('[aria-selected="true"]')?.focus();
}

// Demonstração do topo
const img = document.getElementById("demo-img");
const telas = document.getElementById("demo-telas");
const botoesNegocio = document.querySelectorAll("[data-negocio]");

function atualizar() {
  telaValida();
  botoesNegocio.forEach((b) => b.setAttribute("aria-selected", String(b.dataset.negocio === estado.negocio)));
  montarTelas(telas, atualizar);
  img.src = arquivo(estado.negocio, estado.tela, false);
  img.alt = "Demonstração: " + textoAlt(estado.negocio, estado.tela);
}
botoesNegocio.forEach((b) =>
  b.addEventListener("click", () => {
    estado.negocio = b.dataset.negocio;
    atualizar();
  })
);
atualizar();

// Modal: os projetos em tela cheia, trocando com as setas ou arrastando para o lado
const modal = document.getElementById("modal");
const mImg = document.getElementById("modal-img");
const mTelas = document.getElementById("modal-telas");
const mPontos = document.querySelectorAll("#modal-pontos i");

function mostrarModal() {
  telaValida();
  const i = ORDEM.indexOf(estado.negocio);
  document.getElementById("modal-titulo").textContent = PROJETOS[estado.negocio].titulo;
  document.getElementById("modal-contagem").textContent = i + 1 + " de " + ORDEM.length;
  mPontos.forEach((p, n) => p.classList.toggle("ativo", n === i));
  montarTelas(mTelas, mostrarModal);
  mImg.classList.remove("entra");
  void mImg.offsetWidth; // reinicia a animação
  mImg.classList.add("entra");
  mImg.src = arquivo(estado.negocio, estado.tela, celular.matches);
  mImg.alt = textoAlt(estado.negocio, estado.tela);
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
    PROJETOS[n].telas.forEach(([t]) => {
      new Image().src = arquivo(n, t, celular.matches);
    })
  );
}

modal.addEventListener("close", () => {
  document.documentElement.classList.remove("sem-rolagem");
  atualizar(); // o topo fica no que foi visto por último
});
document.getElementById("modal-fechar").addEventListener("click", () => modal.close());
// clique fora do conteúdo fecha
modal.addEventListener("click", (e) => {
  if (e.target === modal) modal.close();
});
modal.querySelectorAll("[data-passo]").forEach((b) =>
  b.addEventListener("click", () => passo(Number(b.dataset.passo)))
);
document.addEventListener("keydown", (e) => {
  if (!modal.open) return;
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
    const tela = foto.dataset.tela || "site-hero";
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
