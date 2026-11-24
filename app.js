// TROQUE pelo seu número: código do país + DDD + número, só dígitos (ex.: 5517999999999)
const WHATSAPP = "5517991056717";

// Links de WhatsApp: cada botão leva a mensagem do seu data-msg
document.querySelectorAll("[data-wa]").forEach((a) => {
  const msg = a.dataset.msg || "";
  a.href = "https://wa.me/" + WHATSAPP + "?text=" + encodeURIComponent(msg);
  a.target = "_blank";
  a.rel = "noopener";
});

// Demonstração do hero: escolhe o negócio e a tela
const NEGOCIOS = {
  dentista: "clínica odontológica",
  petshop: "pet shop",
  chaveiro: "chaveiro",
};
const TELAS = { "site-hero": "site", inbox: "caixa de entrada", agenda: "agenda" };

const img = document.getElementById("demo-img");
const estado = { negocio: "dentista", tela: "site-hero" };

function atualizar() {
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
