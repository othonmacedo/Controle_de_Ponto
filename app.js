const semana = [
  { data: "Seg", totalHoras: 8 },
  { data: "Ter", totalHoras: 7.5 },
  { data: "Qua", totalHoras: 6 }
];

let PIN = localStorage.getItem("PIN") || "1234"; // PIN padrão

function login() {
  const pinDigitado = document.getElementById("pinInput").value;
  if (pinDigitado === PIN) {
    document.getElementById("login").style.display = "none";
    document.getElementById("app").style.display = "block";
  } else {
    alert("PIN incorreto!");
  }
}

function configurarPIN(novoPIN) {
  PIN = novoPIN;
  localStorage.setItem("PIN", novoPIN);
  alert("PIN atualizado com sucesso!");
}

let funcionario = { dias: {} };

function registrarPonto(tipo) {
  const data = new Date();
  const dia = data.toLocaleDateString();
  const hora = data.toLocaleTimeString();

  if (!funcionario.dias[dia]) funcionario.dias[dia] = [];
  funcionario.dias[dia].push({ hora, tipo });

  salvarDados();
  alert(`Ponto registrado: ${tipo} às ${hora}`);
}

function salvarDados() {
  localStorage.setItem("funcionario", JSON.stringify(funcionario));
}

function carregarDados() {
  const dados = localStorage.getItem("funcionario");
  if (dados) funcionario = JSON.parse(dados);
}
carregarDados();

function relatorioDiario() {
  const hoje = new Date().toLocaleDateString();
  mostrarRelatorio(hoje, "Relatório Diário");
}

function relatorioSemanal() {
  const hoje = new Date();
  let dias = [];
  for (let i = 0; i < 7; i++) {
    let d = new Date(hoje);
    d.setDate(hoje.getDate() - i);
    dias.push(d.toLocaleDateString());
  }
  mostrarRelatorio(dias, "Relatório Semanal");
}

function relatorioMensal() {
  const hoje = new Date();
  const mes = hoje.getMonth();
  const ano = hoje.getFullYear();
  let dias = Object.keys(funcionario.dias).filter((d) => {
    let partes = d.split("/");
    let data = new Date(`${partes[2]}-${partes[1]}-${partes[0]}`);
    return data.getMonth() === mes && data.getFullYear() === ano;
  });
  mostrarRelatorio(dias, "Relatório Mensal");
}

function mostrarRelatorio(dias, titulo) {
  let relatorio = document.getElementById("relatorio");
  relatorio.innerHTML = `<h2>${titulo}</h2>`;
  if (typeof dias === "string") dias = [dias];
  dias.forEach((dia) => {
    if (funcionario.dias[dia]) {
      relatorio.innerHTML += `<h3>${dia}</h3>`;
      funcionario.dias[dia].forEach((p) => {
        relatorio.innerHTML += `<p>${p.hora} - ${p.tipo}</p>`;
      });
    }
  });
}

function limparRegistros() {
  if (confirm("Tem certeza que deseja apagar todos os registros?")) {
    localStorage.removeItem("registros");
    alert("Registros apagados com sucesso!");
    // Atualiza a tela
    document.getElementById("listaRegistros").innerHTML = "";
  }
}

function exportarCSV() {
  let linhas = ["Data,Hora,Tipo"];
  Object.keys(funcionario.dias).forEach((dia) => {
    funcionario.dias[dia].forEach((p) => {
      linhas.push(`${dia},${p.hora},${p.tipo}`);
    });
  });
  let blob = new Blob([linhas.join("\n")], { type: "text/csv" });
  let url = URL.createObjectURL(blob);
  let a = document.createElement("a");
  a.href = url;
  a.download = "relatorio.csv";
  a.click();
}

function gerarGrafico(semana) {
  const ctx = document.getElementById("graficoHoras").getContext("2d");
  new Chart(ctx, {
    type: "bar",
    data: {
      labels: semana.map(dia => dia.data),
      datasets: [{
        label: "Horas Trabalhadas",
        data: semana.map(dia => dia.totalHoras),
        backgroundColor: "#0066cc"
      }]
    },
    options: {
      scales: {
        y: { beginAtZero: true }
      }
    }
  });
}


function controlarAlmoco() {
  let horaSaida = document.getElementById("horaAlmoco").value;
  let limite = parseInt(document.getElementById("tempoAlmoco").value);

  if (!horaSaida) {
    alert("Informe a hora de saída para o almoço.");
    return;
  }

  let partes = horaSaida.split(":");
  let agora = new Date();
  let saida = new Date(
    agora.getFullYear(),
    agora.getMonth(),
    agora.getDate(),
    partes[0],
    partes[1],
  );
  let retorno = new Date(saida.getTime() + limite * 60000);

  alert(
    `Saída para almoço às ${horaSaida}. Retorno até ${retorno.toLocaleTimeString()}.`,
  );

  let tempoAteRetorno = retorno - new Date();
  if (tempoAteRetorno > 0) {
    setTimeout(() => {
      alert("⚠️ Hora de voltar do almoço!");
      new Audio(
        "https://actions.google.com/sounds/v1/alarms/alarm_clock.ogg",
      ).play();
    }, tempoAteRetorno);
  }
}
