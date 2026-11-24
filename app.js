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
