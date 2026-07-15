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

    if(event.target === modal){

        modal.classList.add("hidden");

    }

});



function criarCard() {

    console.log("Criando tarefa...");

}

form.addEventListener("submit", (event) => {
    console.log("Submit funcionando!");
    event.preventDefault();

    criarCard();

});