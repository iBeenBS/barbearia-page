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

// func pra login

async function login() {

  const email =
  document.getElementById("email").value;

  const senha =
  document.getElementById("senha").value;

  const { error } =
  await client.auth.signInWithPassword({

    email,
    password: senha

  });

  if(error){

    alert("Email ou senha inválidos");

    console.log(error);

    return;
  }

  window.location.href =
  "dashboard.html";

}