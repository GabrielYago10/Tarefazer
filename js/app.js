let tarefas = carregarTarefas();
let cardArrastando = null;
let tarefaEditando = null;
let ultimaTarefaRemovida = null;
let tempoToast = null;

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
const etiqueta = document.querySelector("#etiqueta");
const pesquisa = document.querySelector("#pesquisa");
const toast = document.querySelector("#toast");
const toastMensagem = document.querySelector("#toastMensagem");
const btnDesfazer = document.querySelector("#btnDesfazer");
const contadorToast = document.querySelector("#contadorToast");

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
        tarefaEditando.etiqueta = etiqueta.value;
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

        etiqueta: etiqueta.value,

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

    const tag = document.createElement("span");

    tag.classList.add("tag");

    tag.textContent = tarefa.etiqueta;

    const prioridade = document.createElement("span");
    prioridade.classList.add("prioridade");
    prioridade.textContent = tarefa.prioridade;

    const data = document.createElement("small");

    if (tarefa.dataVencimento) {

        data.textContent = "📅 " + tarefa.dataVencimento;

    } else {

        data.textContent = "Sem Previsão";

    }

    footer.appendChild(prioridade);
    footer.appendChild(data);

    card.appendChild(tituloCard);
    card.appendChild(descricaoCard);
    card.appendChild(tag);
    card.appendChild(footer);

    return card;

}

function atualizarContadores() {

    document.querySelectorAll(".coluna").forEach(coluna => {

        const quantidade = coluna.querySelectorAll(".card").length;

        coluna.querySelector(".titulo-coluna span").textContent = quantidade;

    });

}

function atualizarDashboard() {

    document.querySelector("#totalTarefas").textContent = tarefas.length;

    document.querySelector("#todoCount").textContent =
        tarefas.filter(t => t.coluna === "todo").length;

    document.querySelector("#doingCount").textContent =
        tarefas.filter(t => t.coluna === "doing").length;

    document.querySelector("#doneCount").textContent =
        tarefas.filter(t => t.coluna === "done").length;

    document.querySelector("#reviewCount").textContent =
        tarefas.filter(t => t.coluna === "review").length;

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

    const textoPesquisa = pesquisa.value.toLowerCase();

    tarefas
        .filter(tarefa => {

            return tarefa.titulo.toLowerCase().includes(textoPesquisa)

                || tarefa.descricao.toLowerCase().includes(textoPesquisa);

        })

        .forEach(tarefa => {

            const card = renderizarCard(tarefa);

            const colunaDestino = document.querySelector(`#${tarefa.coluna}`);

            colunaDestino.appendChild(card);

        });

    atualizarContadores();
    atualizarDashboard();
    renderizarGraficoFundo();

}

/* ==========================
   GRÁFICO DE FUNDO
   Camadas em "cordilheira" com o total acumulado, tarefas em
   andamento e tarefas concluídas nos últimos 14 dias — tudo
   derivado do id de cada tarefa (timestamp de criação) e da
   coluna atual. Puramente decorativo, atrás do dashboard.
========================== */

let primeiraRenderizacaoGrafico = true;

function construirCurvaSuave(pontos) {

    if (pontos.length < 2) return "";

    let caminho = `M${pontos[0].x},${pontos[0].y}`;

    for (let i = 0; i < pontos.length - 1; i++) {

        const p0 = pontos[i - 1] || pontos[i];
        const p1 = pontos[i];
        const p2 = pontos[i + 1];
        const p3 = pontos[i + 2] || p2;

        const cp1x = p1.x + (p2.x - p0.x) / 6;
        const cp1y = p1.y + (p2.y - p0.y) / 6;
        const cp2x = p2.x - (p3.x - p1.x) / 6;
        const cp2y = p2.y - (p3.y - p1.y) / 6;

        caminho += ` C${cp1x},${cp1y} ${cp2x},${cp2y} ${p2.x},${p2.y}`;

    }

    return caminho;

}

function calcularSerieAcumulada(filtro, dias, largura, altura, padding, maiorValor) {

    const hoje = new Date();
    hoje.setHours(23, 59, 59, 999);

    const valores = [];

    for (let i = dias - 1; i >= 0; i--) {

        const dataRef = new Date(hoje);
        dataRef.setDate(hoje.getDate() - i);

        const limite = dataRef.getTime();

        const total = tarefas.filter(t => t.id <= limite && filtro(t)).length;

        valores.push(total);

    }

    return valores.map((valor, i) => {

        const x = (i / (dias - 1)) * largura;
        const y = altura - padding - (valor / maiorValor) * (altura - padding * 2);

        return { x, y };

    });

}

function renderizarGraficoFundo() {

    const container = document.querySelector("#heroChart");

    if (!container) return;

    const dias = 14;
    const largura = 1000;
    const altura = 320;
    const padding = 30;

    const totalHoje = tarefas.length;
    const maiorValor = Math.max(totalHoje, 1);

    const pontosTotal = calcularSerieAcumulada(() => true, dias, largura, altura, padding, maiorValor);

    const pontosAndamento = calcularSerieAcumulada(
        t => t.coluna === "doing" || t.coluna === "review",
        dias, largura, altura, padding, maiorValor
    );

    const pontosConcluido = calcularSerieAcumulada(
        t => t.coluna === "done",
        dias, largura, altura, padding, maiorValor
    );

    const linhaTotal = construirCurvaSuave(pontosTotal);
    const linhaAndamento = construirCurvaSuave(pontosAndamento);
    const linhaConcluido = construirCurvaSuave(pontosConcluido);

    const areaTotal = `${linhaTotal} L${largura},${altura} L0,${altura} Z`;
    const areaAndamento = `${linhaAndamento} L${largura},${altura} L0,${altura} Z`;
    const areaConcluido = `${linhaConcluido} L${largura},${altura} L0,${altura} Z`;

    const ultimoPonto = pontosTotal[pontosTotal.length - 1];

    let grade = "";

    for (let i = 1; i <= 3; i++) {

        const y = (altura / 4) * i;

        grade += `<line x1="0" y1="${y}" x2="${largura}" y2="${y}" stroke="rgba(255,255,255,.05)" stroke-width="1"></line>`;

    }

    for (let i = 1; i <= 6; i++) {

        const x = (largura / 7) * i;

        grade += `<line x1="${x}" y1="0" x2="${x}" y2="${altura}" stroke="rgba(255,255,255,.035)" stroke-width="1"></line>`;

    }

    container.innerHTML = `
        <svg viewBox="0 0 ${largura} ${altura}" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">

            <defs>

                <linearGradient id="gradConcluido" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stop-color="#34D399" stop-opacity="0.16" />
                    <stop offset="100%" stop-color="#34D399" stop-opacity="0" />
                </linearGradient>

                <linearGradient id="gradAndamento" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stop-color="#38BDF8" stop-opacity="0.2" />
                    <stop offset="100%" stop-color="#38BDF8" stop-opacity="0" />
                </linearGradient>

                <linearGradient id="gradTotal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stop-color="#8B5CF6" stop-opacity="0.45" />
                    <stop offset="100%" stop-color="#8B5CF6" stop-opacity="0" />
                </linearGradient>

                <linearGradient id="gradLinha" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stop-color="#FBBF24" />
                    <stop offset="100%" stop-color="#F59E0B" />
                </linearGradient>

                <filter id="brilhoLinha" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur stdDeviation="4.5" result="blur" />
                    <feMerge>
                        <feMergeNode in="blur" />
                        <feMergeNode in="SourceGraphic" />
                    </feMerge>
                </filter>

            </defs>

            <g class="grade-fundo">${grade}</g>

            <g class="onda onda-fundo">
                <path d="${areaConcluido}" fill="url(#gradConcluido)"></path>
            </g>

            <g class="onda onda-meio">
                <path d="${areaAndamento}" fill="url(#gradAndamento)"></path>
            </g>

            <g class="onda onda-frente">
                <path d="${areaTotal}" fill="url(#gradTotal)"></path>
                <path class="linha-principal" d="${linhaTotal}" fill="none" stroke="url(#gradLinha)" stroke-width="2.5"
                    stroke-linecap="round" stroke-linejoin="round" filter="url(#brilhoLinha)"></path>

                <circle class="ponto-pulso-halo" cx="${ultimoPonto.x}" cy="${ultimoPonto.y}" r="6" fill="#FBBF24"></circle>
                <circle class="ponto-pulso-nucleo" cx="${ultimoPonto.x}" cy="${ultimoPonto.y}" r="4" fill="#FEF3C7"></circle>
            </g>

        </svg>
    `;

    const linhaEl = container.querySelector(".linha-principal");

    if (linhaEl && primeiraRenderizacaoGrafico) {

        const comprimento = linhaEl.getTotalLength();

        linhaEl.style.strokeDasharray = comprimento;
        linhaEl.style.strokeDashoffset = comprimento;

        linhaEl.getBoundingClientRect(); // força o navegador a registrar o estado inicial antes de animar

        linhaEl.style.transition = "stroke-dashoffset 1.8s ease";

        requestAnimationFrame(() => {

            linhaEl.style.strokeDashoffset = "0";

        });

        primeiraRenderizacaoGrafico = false;

    }

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

    ultimaTarefaRemovida = tarefas.find(t => t.id === id);

    tarefas = tarefas.filter(tarefa => tarefa.id !== id);

    salvarTarefas(tarefas);

    mostrarToast("Tarefa excluída.");

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
    dataVencimento.value = tarefa.dataVencimento;
    etiqueta.value = tarefa.etiqueta;
    coluna.value = tarefa.coluna;

    btnSalvar.textContent = "Salvar alterações";

    modal.classList.remove("hidden");

}

function mostrarToast(mensagem) {

    clearInterval(tempoToast);

    let segundos = 5;

    contadorToast.textContent = String(segundos).padStart(2,"0");

    toastMensagem.textContent = mensagem;

    toast.classList.remove("hidden");

    tempoToast = setInterval(() => {

        segundos--;

        contadorToast.textContent = String(segundos).padStart(2,"0");

        if (segundos <= 0) {

            clearInterval(tempoToast);

            toast.classList.add("hidden");

            ultimaTarefaRemovida = null;

        }

    }, 1000);

}



pesquisa.addEventListener("input", () => {
    renderizarKanban();
});

btnDesfazer.addEventListener("click", () => {

    if (!ultimaTarefaRemovida) return;

    tarefas.push(ultimaTarefaRemovida);

    salvarTarefas(tarefas);

    renderizarKanban();

    toast.classList.add("hidden");

    ultimaTarefaRemovida = null;

});