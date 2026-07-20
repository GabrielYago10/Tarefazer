let tarefas = carregarTarefas();

let cardArrastando = null;

let tarefaEditando = null;

const btnNovaTarefa = document.querySelector("#novaTarefa");

const modal = document.querySelector(".modal-overlay");

const btnCancelar = document.querySelector(".cancelar");


const form = document.querySelector("#formTarefa");

const titulo = document.querySelector("#titulo");
const descricao = document.querySelector("#descricao");
const propriedade = document.querySelector("#propriedade");
const coluna = document.querySelector("#coluna");

const lixeira = document.querySelector("#lixeira");
const btnSalvar = document.querySelector(".salvar");
const dataVencimento = document.querySelector("#dataVencimento");

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

    if (tarefaEditando) {

        tarefaEditando.titulo = titulo.value;
        tarefaEditando.descricao = descricao.value;
        tarefaEditando.prioridade = propriedade.value;
        tarefaEditando.dataVencimento = dataVencimento.value;
        tarefaEditando.coluna = coluna.value;

        salvarTarefas(tarefas);

        renderizarKanban();

        tarefaEditando = null;
        btnSalvar.textContent = "Criar tarefa";

        form.reset();

        modal.classList.add("hidden");

        return;

    }

    const tarefa = {

        id: Date.now(),

        titulo: titulo.value,

        descricao: descricao.value,

        prioridade: propriedade.value,

        dataVencimento: dataVencimento.value,

        coluna: coluna.value

    };

    tarefas.push(tarefa);

    salvarTarefas(tarefas);

    renderizarKanban();

    form.reset();

    modal.classList.add("hidden");

}

form.addEventListener("submit", (event) => {

    console.log("Submit funcionando!");

    event.preventDefault();

    criarCard();

});


function renderizarCard(tarefa) {

    const card = document.createElement("div");
    card.dataset.id = tarefa.id;
    card.draggable = true;

    card.classList.add("card");

    card.addEventListener("dragstart", () => {

        cardArrastando = card;

        card.classList.add("arrastando");

        lixeira.classList.add("ativa");

    });


    card.addEventListener("dragend", () => {

        card.classList.remove("arrastando");

        lixeira.classList.remove("ativa");

        lixeira.classList.remove("hover");

    });

    card.addEventListener("dblclick", () => {

        editarTarefa(tarefa.id);

    });

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

    if (tarefa.dataVencimento) {

        data.textContent = "📅 " + tarefa.dataVencimento;

    } else {

        data.textContent = "Sem data";

    }

    footer.appendChild(prioridade);
    footer.appendChild(data);

    card.appendChild(tituloCard);
    card.appendChild(descricaoCard);
    card.appendChild(footer);

    return card;

}

function atualizarContadores() {

    document.querySelectorAll(".coluna").forEach(coluna => {

        const quantidade = coluna.querySelectorAll(".card").length;

        coluna.querySelector(".titulo-coluna span").textContent = quantidade;

    });

}

function habilitarDrop() {

    document.querySelectorAll(".cards").forEach(coluna => {

        coluna.addEventListener("dragover", (event) => {

            event.preventDefault();

            coluna.classList.add("drag-over");

        });

        coluna.addEventListener("dragleave", () => {

            coluna.classList.remove("drag-over");

        });

        coluna.addEventListener("drop", () => {

            if (!cardArrastando) return;

            const id = Number(cardArrastando.dataset.id);

            const tarefa = tarefas.find(t => t.id === id);

            if (tarefa) {

                tarefa.coluna = coluna.id;

                salvarTarefas(tarefas);

            }

            renderizarKanban();

            coluna.classList.remove("drag-over");

            cardArrastando = null;

        });
    });

}

function renderizarKanban() {

    document.querySelectorAll(".cards").forEach(coluna => {

        coluna.innerHTML = "";

    });

    tarefas.forEach(tarefa => {

        const card = renderizarCard(tarefa);

        const colunaDestino = document.querySelector(`#${tarefa.coluna}`);

        colunaDestino.appendChild(card);

    });

    atualizarContadores();

}

renderizarKanban();
habilitarDrop();


lixeira.addEventListener("dragover", (event) => {

    event.preventDefault();

    lixeira.classList.add("hover");

});

lixeira.addEventListener("dragleave", () => {

    lixeira.classList.remove("hover");

});

lixeira.addEventListener("drop", () => {

    if (!cardArrastando) return;

    const id = Number(cardArrastando.dataset.id);

    tarefas = tarefas.filter(tarefa => tarefa.id !== id);

    salvarTarefas(tarefas);

    cardArrastando.remove();

    atualizarContadores();

    cardArrastando = null;

    lixeira.classList.remove("hover");
    lixeira.classList.remove("ativa");

});

function editarTarefa(id) {

    const tarefa = tarefas.find(t => t.id === id);

    if (!tarefa) return;

    tarefaEditando = tarefa;

    titulo.value = tarefa.titulo;
    descricao.value = tarefa.descricao;
    propriedade.value = tarefa.prioridade;
    dataVencimento.value + tarefa.dataVencimento;
    coluna.value = tarefa.coluna;

    btnSalvar.textContent = "Salvar alterações";

    modal.classList.remove("hidden");

}





