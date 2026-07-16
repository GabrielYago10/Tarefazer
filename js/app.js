const btnNovaTarefa = document.querySelector("#novaTarefa");

const modal = document.querySelector(".modal-overlay");

const btnCancelar = document.querySelector(".cancelar");


const form = document.querySelector("#formTarefa");

const titulo = document.querySelector("#titulo");
const descricao = document.querySelector("#descricao");
const propriedade = document.querySelector("#propriedade");
const coluna = document.querySelector("#coluna");


// Abrir modal

btnNovaTarefa.addEventListener("click", () => {

    modal.classList.remove("hidden");

});


// Fechar pelo botão cancelar

btnCancelar.addEventListener("click", () => {

    modal.classList.add("hidden");

});


// Fechar clicando fora

modal.addEventListener("click", (event) => {

    if (event.target === modal) {

        modal.classList.add("hidden");

    }

});



function criarCard() {

    const tarefa = {

        id: Date.now(),

        titulo: titulo.value,

        descricao: descricao.value,

        prioridade: propriedade.value,

        coluna: coluna.value

    };

    const card = renderizarCard(tarefa);

    const colunaDestino = document.querySelector(`#${tarefa.coluna}`);

    colunaDestino.appendChild(card);

    console.log(tarefa);

}

form.addEventListener("submit", (event) => {

    console.log("Submit funcionando!");

    event.preventDefault();

    criarCard();

});


function renderizarCard(tarefa) {

    const card = document.createElement("div");
    card.classList.add("card");

    if (tarefa.prioridade === "Alta") {

        card.classList.add("alta");

    } else if (tarefa.prioridade === "Média") {

        card.classList.add("media");

    } else {

        card.classList.add("baixa");

    }

    const tituloCard = document.createElement("h3");
    tituloCard.textContent = tarefa.titulo;

    const descricaoCard = document.createElement("p");
    descricaoCard.textContent = tarefa.descricao;

    const footer = document.createElement("div");
    footer.classList.add("card-footer");

    const prioridade = document.createElement("span");
    prioridade.classList.add("prioridade");
    prioridade.textContent = tarefa.prioridade;

    const data = document.createElement("small");
    data.textContent = "Hoje";

    footer.appendChild(prioridade);
    footer.appendChild(data);

    card.appendChild(tituloCard);
    card.appendChild(descricaoCard);
    card.appendChild(footer);

    return card;

}