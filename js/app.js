const btnNovaTarefa = document.querySelector("#novaTarefa");

const modal = document.querySelector(".modal-overlay");

const btnCancelar = document.querySelector(".cancelar");


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