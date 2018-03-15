// Jogo da velha
// Autor: Guilherme de Melo

var matriz_jogo = Array(3),
	combinacoesPossiveis = Array(8),
	jogadorInicial = 1,
	jogadorAtual = 1,
	vencedor,
	pontos,
	combinacoesPossiveis = [["00", "01", "02"],
						    ["10", "11", "12"],
						    ["20", "21", "22"],
						    ["00", "10", "20"],
						    ["01", "11", "21"],
						    ["02", "12", "22"],
						    ["00", "11", "22"],
						    ["02", "11", "20"]];

$(document).ready(function() {
	$("#btn-iniciar-jogo").click(function() {
		if (validarApelidos()) {
			alterarPagina();
			setarApelidos();
			iniciarJogo();
		}
	});

	$(".btn-reiniciar-jogo").click(function() {
		reiniciarJogo();
	});

	function validarApelidos() {
		var apelidoJogador1 = $("#entrada-apelido-jogador-1").val(),
			apelidoJogador2 = $("#entrada-apelido-jogador-2").val();

		if (!apelidoJogador1 || !apelidoJogador2) {
			alert("Digite o apelido dos jogadores.");
			return false;
		}

		return true;
	}

	function setarApelidos() {
		var apelidoJogador1 = $("#entrada-apelido-jogador-1").val(),
			apelidoJogador2 = $("#entrada-apelido-jogador-2").val();

		$("#apelido-jogador-1").html(apelidoJogador1);
		$("#apelido-jogador-2").html(apelidoJogador2);
	}

	function alterarPagina() {
		$(".pagina-inicial").hide();
		$(".pagina-jogo").show();
	}

	function iniciarJogo(primeiro_jogador) {
		iniciaMatrizJogo();

		jogadorAtual = jogadorInicial;
		destacarJogador(jogadorAtual);

		tornarCelulasClicaveis(function(classeGeralCelulas) {
			var classeCelulaClicada = classeGeralCelulas.classList[1];
			processarJogada(classeCelulaClicada);
		});
	}

	function iniciaMatrizJogo() {
		matriz_jogo[0] = Array(3);
		matriz_jogo[1] = Array(3);
		matriz_jogo[2] = Array(3);

		matriz_jogo[0][0] = 0;
		matriz_jogo[0][1] = 0;
		matriz_jogo[0][2] = 0;

		matriz_jogo[1][0] = 0;
		matriz_jogo[1][1] = 0;
		matriz_jogo[1][2] = 0;

		matriz_jogo[2][0] = 0;
		matriz_jogo[2][1] = 0;
		matriz_jogo[2][2] = 0;
	}

	function alterarJogador() {
		jogadorAtual = (jogadorAtual == 1) ? 2 : 1;
		destacarJogador(jogadorAtual);
	}

	function destacarJogador(numJogador) {
		if (!numJogador) {
			$("#img-jogador-1").css("transform", "scale(1)");
			$("#img-jogador-1").css("-webkit-transform", "scale(1)");

			$("#img-jogador-2").css("transform", "scale(1)");
			$("#img-jogador-2").css("-webkit-transform", "scale(1)");
		} else {
			if (numJogador == 1) {
				$("#img-jogador-1").css("transform", "scale(1.1)");
				$("#img-jogador-1").css("-webkit-transform", "scale(1.1)");

				$("#img-jogador-2").css("transform", "scale(1)");
				$("#img-jogador-2").css("-webkit-transform", "scale(1)");
			} else {
				$("#img-jogador-2").css("transform", "scale(1.1)");
				$("#img-jogador-2").css("-webkit-transform", "scale(1.1)");

				$("#img-jogador-1").css("transform", "scale(1)");
				$("#img-jogador-1").css("-webkit-transform", "scale(1)");
			}
		}
	}

	function tornarCelulasClicaveis(acaoClique) {	
		$(".celula-tabela").click(function() {
			acaoClique(this)
		});
	}

	function processarJogada(classeCelulaClicada) {
		var celulaClicada = $("." + classeCelulaClicada),
			posicaoCelulaClicada = classeCelulaClicada.replace("tabela", "").replace(/[-]/g, ""),
			arrCombinacoesPossiveis = [],
			jogoFinalizado = false,
			combinacao;

		celulaClicada.off();
		efetuarMarcacaoCelula(celulaClicada);
		adicionarPontoMatriz(posicaoCelulaClicada);

		arrCombinacoesPossiveis = verificarCombinacoesPossiveis(posicaoCelulaClicada);

		for (var indexCombinacao = 0; indexCombinacao < arrCombinacoesPossiveis.length; indexCombinacao++) {
			combinacao = arrCombinacoesPossiveis[indexCombinacao];

			if (verificarFimDeJogo(combinacao)) {
				finalizarJogo(combinacao);
				jogoFinalizado = true;
			} else if (verificarEmpate()) {
				empatarJogo();
				jogoFinalizado = true;
			}

			if (jogoFinalizado) {
				break;
			}
		};

		if (!jogoFinalizado) {
			alterarJogador();
		}
	}

	function verificarFimDeJogo(combinacao) {
		pontos = matriz_jogo[combinacao[0][0]][combinacao[0][1]]
			   + matriz_jogo[combinacao[1][0]][combinacao[1][1]]
			   + matriz_jogo[combinacao[2][0]][combinacao[2][1]];

		if (pontos == -3 || pontos == 3) {
			return true
		}

		return false;
	}

	function verificarEmpate() {
		var matrizJogoPreenchida = true;

		for (var i = 0; i <= 2; i ++) {
			for (var j = 0; j <= 2; j ++) {
				if (matriz_jogo[i][j] == 0) {
					matrizJogoPreenchida = false;
					break;
				}
			}
		}

		return matrizJogoPreenchida;
	}

	function finalizarJogo(combinacao) {
		var apelidoJogador = $("#apelido-jogador-"  + jogadorAtual).html(),
			celulas = $(".celula-tabela"),
			btnReiniciar = $(".btn-reiniciar-jogo");

		vencedor = jogadorAtual;

		destacarJogador(null);
		destacarCombinacao(combinacao);
		celulas.off();
		btnReiniciar.show();

		$("#nome-vencedor-alert").html(apelidoJogador);
		$("#alert-vencedor").show();
	}

	function empatarJogo() {
		var celulas = $(".celula-tabela"),
			btnReiniciar = $(".btn-reiniciar-jogo");

		vencedor = null;

		destacarJogador(null);
		celulas.off();
		btnReiniciar.show();
		
		$("#alert-empate").show();
	}

	function efetuarMarcacaoCelula(celulaClicada) {
		celulaClicada.css("background-image", "url('imagens/marcacao_" + jogadorAtual + ".png')");
	}

	function adicionarPontoMatriz(posicaoCelulaClicada) {
		var ponto;

		if (jogadorAtual == 1) {
			ponto = -1;
		} else {
			ponto = 1;
		}

		posicao_x = parseInt(posicaoCelulaClicada[0]);
		posicao_y = parseInt(posicaoCelulaClicada[1]);

		matriz_jogo[posicao_x][posicao_y] = ponto;
	}

	function verificarCombinacoesPossiveis(posicaoCelulaClicada) {
		var arrCombinacoesPossiveis = [];

		combinacoesPossiveis.map(function(combinacao, index) {
			if (combinacao.indexOf(posicaoCelulaClicada) !== -1) {
				arrCombinacoesPossiveis.push(combinacao);
			}
		});

		return arrCombinacoesPossiveis;
	}

	function destacarCombinacao(combinacao) {
		var degrees = jogadorAtual == 1 ? "115deg" : "270deg";

		$(".tabela-" + combinacao[0][0] + "-" + combinacao[0][1]).css("filter", "hue-rotate(" + degrees + ")");
		$(".tabela-" + combinacao[1][0] + "-" + combinacao[1][1]).css("filter", "hue-rotate(" + degrees + ")");
		$(".tabela-" + combinacao[2][0] + "-" + combinacao[2][1]).css("filter", "hue-rotate(" + degrees + ")");
	}

	function reiniciarJogo() {
		var btnReiniciar = $(".btn-reiniciar-jogo");

		if (vencedor) {
			$("#alert-vencedor").hide();
		} else {
			$("#alert-empate").hide();
		}

		resetarTabela();
		definirPerdedorComoJogadorInicial();
		btnReiniciar.hide();
		iniciarJogo();
	}

	function resetarTabela() {
		for (var i = 0; i <= 2; i++) {
			for (var j = 0; j <= 2; j++) {
				$(".tabela-" + i + "-" + j).css("filter", "none");
				$(".tabela-" + i + "-" + j).css("background-image", "none");
			}
		}
	}

	function definirPerdedorComoJogadorInicial() {
		if (vencedor) {
			jogadorInicial = (vencedor == 1) ? 2 : 1;
		} else {
			jogadorInicial = (jogadorInicial == 1) ? 2 : 1;
		}
	}
});