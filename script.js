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

function home() {
	window.location.href = "index.html"
}

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
		//	current.getAttribute("id");
		}
	});
	
	navItems.forEach(item => {
		item.classList.remove("active");
		if (item.getAttribute("href") === '#${current}'){
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
const SUPABASE_KEY = "sb_publishable_1Edg9-jmUsNXVzXrSekqdw_JXGPtqhj";
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
