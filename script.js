// Duracao dos servicos 
function duracaoServico(servico){
  const tempos = {
    "Cabelo": 30,
    "Barba": 30,
    "Sombrancelha": 20,
    "Cabelo + barba": 60,
    "Completo": 80
  };

  return tempos[servico];
}

// load em cascata
window.addEventListener("load", () => {
	const elements = document.querySelectorAll(".hidden");
	elements.forEach((el, i) => {
		setTimeout(() => {
			el.classList.add("show");
		}, i * 250); 
	});
});

// load para navbar
window.addEventListener("load", () => {
	const elements = document.querySelectorAll(".hidden-nav");
	elements.forEach((el, i) => {
		setTimeout(() => {
			el.classList.add("show-nav");
		}, i * 250); 
	});
});



// Active de item da nav:

const navItems = document.querySelectorAll(".nav-item");
const sections = document.querySelectorAll("section");

navItems.forEach(item => {
	item.addEventListener("click", (e) => {
		
		
		const targetId = item.getAttribute("href");
		const targetSection = document.querySelector(targetId);
		
		targetSection.scrollIntoView({
			behavior: "smooth"
		});
		navItems.forEach(i =>
		i.classList.remove("active"));
		item.classList.add("active");
	});
});

window.addEventListener("scroll", () => {
	let current = "";
	
	sections.forEach(section => {
		const sectionTop = section.offsetTop - 100;
		const sectionHeight = section.clientHeight;
		
		if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
			current = section.getAttribute("id");
		}
	});
	
	navItems.forEach(item => {
		item.classList.remove("active");
		if (item.getAttribute("href") === `#${current}`){
			item.classList.add("active");
		}
	});
});

const icon = document.querySelector(".barber-icon");
const secoes = document.querySelectorAll(".sec");

window.addEventListener("scroll", () => {
	let current2 = "";
	
	secoes.forEach(section => {
		const top = section.offsetTop - 260;
		const height = section.clientHeight;
		
		if (scrollY >= top && scrollY < top + height) {
			current2 = section.id;
		}
		console.log(current2);
	});
	
	if (current2 === "") {
		icon.classList.add("right");
		icon.classList.remove("left");
		icon.classList.remove("mid-sobre");
		icon.classList.remove("right-mid");
	}
	else if (current2 === "s1"){
		icon.classList.remove("right");
		icon.classList.add("mid-sobre");
		icon.classList.remove("right");
		icon.classList.remove("right-mid");
	}
	else if (current2 === "s2"){
		icon.classList.add("right");
		icon.classList.remove("left");
		icon.classList.remove("mid-sobre");
		icon.classList.remove("right-mid");
	}
	else if (current2 === "s3"){
		icon.classList.add("right-mid");
		icon.classList.remove("right");
		icon.classList.remove("mid-sobre");
		icon.classList.remove("left");
	}
});

// SUPABASE SCRIPT

const SUPABASE_URL = "https://urvsswrfojxrnehoxvto.supabase.co";
const SUPABASE_KEY = "sb_publishable_1Edg9-jmUsNXVzXrSekqdw_JXGPtqhJ";
const client = window.supabase.createClient(
	SUPABASE_URL, 
	SUPABASE_KEY
);

async function carregar() {
	const { data, error } = await client 
		.from("agenda")
		.select("*");
	
	// debug 
	console.log(data);
	console.log(error);
}
carregar();


// opens dashboard

function openAgenda() {
	window.location.href = "agenda.html"
}
function openClientes() {
	window.location.href = "clientes.html"
}
function openFinanceiro() {
	window.location.href = "financeiro.html"
}
function openServicos() {
	window.location.href = "servicos.html"
}
function openPromocoes() {
	window.location.href = "promocoes.html"
}
function openNotificacoes() {
	window.location.href = "notificacoes.html"
}

// mostrar tabela agenda 

async function carregarAgenda() {
	const { data, error } = await client
		.from("agenda")
		.select("*");
		
	const agenda = document.getElementById("agenda");
	let html = "";
	
	data.forEach(item => {
		html += `
		
			<div class="card-agenda">
				<h3>${item.nome}</h3>
				<p>Serviço: ${item.servico}</p>
				<p>Horário: ${item.horario}</p>
				<p>Data: ${item.data}</p>
			</div>
	 `;
	});
	agenda.innerHTML = html;
}
function reservar() {
  window.location.href = "reservar.html"
}
function home() {
  window.location.href = "index.html"
}

// Inserir dados na db
const btn = document.getElementById("btn");

btn.addEventListener("click", async ()=>{

  const nome =
  document.getElementById("nome").value;

  const servico =
  document.getElementById("servico").value;

  const data =
  document.getElementById("data").value;

  const hora =
  document.getElementById("hora").value;

  if(!nome || !servico || !data || !hora){

    alert("Preencha todos os campos.");

    return;
  }
const [ano, mes, dia] =
data.split("-");

const dataFormatada =
`${dia}/${mes}/${ano}`;
  const { data: agendamentos } =
    await client
    .from("agenda")
    .select("*")
    .eq("data", data);
  console.log(agendamentos);
  
  const inicioNovo =
new Date(`2000-01-01T${hora}`);

const fimNovo =
new Date(
  inicioNovo.getTime() +
  duracaoServico(servico) * 60000
);

let conflito = false;

agendamentos.forEach(item => {

  const inicioExistente =
  new Date(`2000-01-01T${item.horario}`);

  const fimExistente =
  new Date(
    inicioExistente.getTime() +
    duracaoServico(item.servico) * 60000
  );

  if(
    inicioNovo < fimExistente &&
    fimNovo > inicioExistente
  ){
    conflito = true;
  }

});

if(conflito){

  alert("Horário indisponível.");

  return;
}
  const agora = new Date();

const hoje =
`${agora.getFullYear()}-${
String(agora.getMonth() + 1)
.padStart(2,"0")
}-${
String(agora.getDate())
.padStart(2,"0")
}`;

if(data === hoje){

  const horaAtual =
  agora.getHours();

  const minutoAtual =
  agora.getMinutes();

  const [horaEscolhida, minutoEscolhido] =
  hora.split(":");

  const horarioAtualMinutos =
  horaAtual * 60 + minutoAtual;

  const horarioEscolhidoMinutos =
  Number(horaEscolhida) * 60 +
  Number(minutoEscolhido);

  if(horarioEscolhidoMinutos <=
     horarioAtualMinutos){

    alert(
      "Não é possível agendar neste horario."
    );

    return;
  }

}
  const { error } = await client
  .from("agenda")
  .insert([
    {
      nome,
      servico,
      horario: hora,
      data,
      status: "agendado"
    }
  ]);

  if(error){

    alert("Horário indisponível.");

    console.log(error);

    return;
  }
  document.getElementById("nome").value = "";

  document.getElementById("servico").selectedIndex = 0;
  
  document.getElementById("data").value = "";
  
  document.getElementById("hora").value = "";
  const modal =
document.getElementById("modal");

document.getElementById("resumoServico")
.innerText =
`Serviço: ${servico}`;

document.getElementById("resumoData")
.innerText =
`Data: ${dataFormatada}`;

document.getElementById("resumoHora")
.innerText =
`Horário: ${hora}`;

modal.classList.add("active");

document
.getElementById("fecharModal")

.addEventListener("click", ()=>{

  modal.classList.remove("active");

});

});

function fecharModalAgenda() {
  modal.classList.remove("active");
}
