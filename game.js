
const estilo = `
body {
    font-family: Arial, sans-serif;
    background: #222;
    color: #fff;
    text-align: center;
    margin: 0;
    padding: 0;
}

h1 {
    margin-top: 20px;
}

#infos {
    margin: 20px;
    font-size: 20px;
}

#btnReiniciar {
    background: #ff9800;
    border: none;
    padding: 10px 20px;
    font-size: 18px;
    color: #000;
    border-radius: 8px;
    cursor: pointer;
    margin-bottom: 20px;
    transition: .2s;
}

#btnReiniciar:hover {
    background: #ffc107;
}

#gameBoard {
    width: 620px;
    margin: 0 auto;
    display: grid;
    gap: 10px;
    grid-template-columns: repeat(4, 150px);
}

.card {
    width: 150px;
    height: 150px;
    background: #444;
    border-radius: 10px;
    cursor: pointer;
    overflow: hidden;
    position: relative;
    transition: transform .3s;
}

.card img {
    width: 100%;
    height: 100%;
    display: none;
}

.card.revealed img {
    display: block;
}

.card.revealed {
    background: #fff;
}

.card.matched {
    background: #0a0;
    pointer-events: none;
}
`;

$("<style>").text(estilo).appendTo("head");


$(document).ready(function () {

    const somVirar = $("#somVirar")[0];
    const somAcerto = $("#somAcerto")[0];
    const somErro = $("#somErro")[0];

    const imagens = [
        "imagens/arara.png",
        "imagens/baleia.png",
        "imagens/leao.png",
        "imagens/lobo.png",
        "imagens/tigre.png",
        "imagens/zebra.png"
    ];

    let tempo = 0;
    let jogadas = 0;
    let acertos = 0;
    let primeira = null;
    let bloqueado = false;
    let intervalID = null;

    function iniciarJogo() {

        tempo = 0;
        jogadas = 0;
        acertos = 0;
        primeira = null;
        bloqueado = false;

        $("#tempo").text(0);
        $("#jogadas").text(0);
        $("#gameBoard").empty();

        if (intervalID) clearInterval(intervalID);

        intervalID = setInterval(() => {
            tempo++;
            $("#tempo").text(tempo);
        }, 1000);

        let cartas = [...imagens, ...imagens];
        cartas.sort(() => Math.random() - 0.5);

        cartas.forEach(src => {
            $("#gameBoard").append(`
                <div class="card" data-img="${src}">
                    <img src="${src}">
                </div>
            `);
        });

        ativarEventos();
    }


    function ativarEventos() {

        $(".card").off().click(function () {

            if (bloqueado || $(this).hasClass("revealed")) return;

            somVirar.play();
            $(this).addClass("revealed");

            if (!primeira) {
                primeira = $(this);
                return;
            }

            jogadas++;
            $("#jogadas").text(jogadas);

            let segunda = $(this);

            if (primeira.data("img") === segunda.data("img")) {

                somAcerto.play();
                primeira.addClass("matched");
                segunda.addClass("matched");
                primeira = null;
                acertos++;

                if (acertos === imagens.length) {
                    setTimeout(() => {
                        alert(`🎉 Parabéns!
Tempo: ${tempo}s
Jogadas: ${jogadas}`);
                    }, 300);
                }

            } else {
                bloqueado = true;
                somErro.play();

                setTimeout(() => {
                    primeira.removeClass("revealed");
                    segunda.removeClass("revealed");
                    primeira = null;
                    bloqueado = false;
                }, 800);
            }

        });

    }


    $("#btnReiniciar").click(() => {
        iniciarJogo();
    });

    // Iniciar o jogo ao abrir
    iniciarJogo();
});
