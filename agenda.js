// SUPABASE

const SUPABASE_URL =
"https://urvsswrfojxrnehoxvto.supabase.co";

const SUPABASE_KEY =
"sb_publishable_1Edg9-jmUsNXVzXrSekqdw_JXGPtqhJ";

const client =
window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_KEY
);

// Verificar se esta logado
async function verificarLogin() {

  const {
    data: { session }
  } = await client.auth.getSession();

  if(!session){

    window.location.href =
    "login.html";

  }

}

verificarLogin();
// Funçao para reconhecer o mes
function isThisMonth(dateStr) {

  const date = new Date(dateStr);

  const now = new Date();

  return (
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear()
  );

}
// FORMATAR DATA

function formatarData(data){

  const [ano, mes, dia] =
  data.split("-");

  return `${dia}/${mes}/${ano}`;
}
// funcao para deletar user de AGENDA

async function cancelarAgendamento(id) {

  const { error } = await client
    .from("agenda")
    .delete()
    .eq("id", id);

  if (error) {
    console.log(error);
    return;
  }

  carregarAgendaHoje();
  carregarDashboardSemana();
}

// CARREGAR AGENDA

async function carregarAgendaHoje(){

  const { data, error } =
  await client

  .from("agenda")

  .select("*")

  .order("data", {
    ascending:true
  })

  .order("horario", {
    ascending:true
  });

  if(error){

    console.log(error);

    return;
  }

  const mes = data.filter(item =>
  isThisMonth(item.data)
);

  const lista =
  document.getElementById("listaAgenda");

  lista.innerHTML = "";

  mes.forEach(item => {
  const agora = new Date();

  const dataHoraAgendamento =
  new Date(`${item.data}T${item.horario}`);

  const atrasado =
  dataHoraAgendamento < agora &&
  item.status !== "atendido";
    lista.innerHTML += `

    <div class="item
${item.status === "atendido" ? "atendido" : ""}
${atrasado ? "atrasado" : ""}
">

      <div class="left">

        <div class="barra"></div>

        <div class="avatar">
          <i class="fa-solid fa-user"></i>
        </div>

        <div class="info">

          <h3>${item.nome}</h3>

          <p>${item.servico}</p>

          <p>${formatarData(item.data)}</p>

        </div>

      </div>

      <div class="horario">

        <i class="fa-regular fa-clock"></i>

        ${item.horario}

      </div>
      
      <div class="acoes">

        <button
        class="alt-status"
        onclick="marcarAtendido(${item.id})">

          Atendido

        </button>

        <button
        class="del-user"
        onclick="cancelarAgendamento(${item.id})">

          Deletar

        </button>

      </div>

    </div>

    `;

  });

}

carregarAgendaHoje();

// funcao para saber tempo da semana

function isThisWeek(dateStr) {
  const date = new Date(dateStr);

  const now = new Date();
  const start = new Date(now);
  start.setDate(now.getDate() - now.getDay());
  start.setHours(0,0,0,0);

  const end = new Date(start);
  end.setDate(start.getDate() + 7);

  return date >= start && date < end;
}

async function carregarDashboardSemana() {

  const { data, error } =
  await client
    .from("agenda")
    .select("*");

  if (error) {
    console.log(error);
    return;
  }

  const mes = data.filter(item => isThisMonth(item.data));

  // métricas
  const agendados = mes.length;

  const atendidos = mes.filter(
    item => item.status === "atendido"
  ).length;

  // jogar na tela
  document.getElementById("agendados").innerText = agendados;
  document.getElementById("atendidos").innerText = atendidos;
}
carregarAgendaHoje();
carregarDashboardSemana();

// funcao para reload de status

async function marcarAtendido(id) {
  const botao =
  document.querySelector(
    `.alt-status[onclick="marcarAtendido(${id})"]`
  );

  const card =
  botao.closest(".item");

  card.classList.add("atendido");

  const { error } = await client
    .from("agenda")
    .update({ status: "atendido" })
    .eq("id", id);

  if (error) {
    console.log(error);
    return;
  }
  carregarAgendaHoje();

  
carregarDashboardSemana();
}

const btnClientes =
document.getElementById("btnClientes");

const btnAgenda =
document.getElementById("btnAgenda");

btnClientes.addEventListener("click", () => {

  const secao =
  document.getElementById("clientes");

  secao.scrollIntoView({
    behavior: "smooth"
  });

  btnAgenda.classList.remove("active");

  btnClientes.classList.add("active");

});

btnAgenda.addEventListener("click", () => {
  const sectionAgenda = document.getElementById("agenda");
  sectionAgenda.scrollIntoView({
    behavior: "smooth"
  });
  btnClientes.classList.remove("active");
  btnAgenda.classList.add("active");
});