function salvarTarefas(tarefas) {

    localStorage.setItem(
        "tarefas",
        JSON.stringify(tarefas)
    );

}

function carregarTarefas() {

    const dados = localStorage.getItem("tarefas");

    if (dados) {

        return JSON.parse(dados);

    }

    return [];

}