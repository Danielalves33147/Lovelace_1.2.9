import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
let notificationCount = 0;
import { sendPasswordResetEmail } from "firebase/auth";



export function load(){
    Swal.fire({
        title: 'Carregando...',
        text: 'Por favor, aguarde...',
        allowOutsideClick: false,
        allowEscapeKey: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });
      
      // Simula um processo de carregamento
      setTimeout(() => { //
        // Fecha a notificação após 2 segundos
        Swal.close();
      }, 2000);
}

export function sucess(){
    // Notificação de Sucesso com redirecionamento
    Swal.fire({
        icon: 'success',
        title: 'Sucesso!',
        text: 'Bem Vindo.',
        position: 'center',
        showConfirmButton: false,
        timer: 3000,
        toast: true
      })
}

export function sucess_cad(){
  // Notificação de Sucesso com redirecionamento
  Swal.fire({
      icon: 'success',
      title: 'Sucesso!',
      text: 'Cadastro.',
      position: 'center',
      showConfirmButton: false,
      timer: 3000,
      toast: true
    })
}

export function fail(){
// Exibe a notificação de erro

  Swal.fire({
    icon: 'error',
    title: 'Ops! Algo deu errado...',
    text: 'Revise as informações e tente novamente.',
    position: 'center',
    showConfirmButton: false,
    timer: 4000,
    toast: true
  });

}

export function pratica(navigate){
  Swal.fire({
      title: 'Iniciar Atividades?',
      text: "Voce pode acessar uma pre definida ou criar uma sala personalizada, o que deseja?",
      icon: 'warning',
      iconColor: '#F21B3F',
      background: 'white',
      showCancelButton: true,
      confirmButtonColor: '#F21B3F',
      border: 'none',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Pré-definida',
      cancelButtonText: 'Personalizada'
    }).then((result) => {
      if (result.isConfirmed) {
        navigate('/Lovelace/practice');
      } else {
          Swal.fire({
              title: 'Iniciando Atividade!',
              text: "Voce pode criar uma sala, ou entrar em uma já existente!",
              icon: 'warning',
              iconColor: '#F21B3F',
              background: 'white',
              showCancelButton: true,
              confirmButtonColor: '#F21B3F',
              border: 'none',
              cancelButtonColor: '#d33',
              confirmButtonText: 'Criar Sala',
              cancelButtonText: 'Entrar'
          }).then((result) => {
          if (result.isConfirmed) {
          navigate('/Lovelace/createactivity');
          } else {
          navigate('/Lovelace/accesscode');
          }
          })
      }
    })
}

export function dontSavePdf() {
  const resContainer = document.getElementById("resultContainer");
  resContainer.style.display="none";

  Swal.fire({
      title: 'Resultado não salvo!',
      text: 'Você decidiu não salvar o PDF.',
      icon: 'info',
      showCancelButton: true,
      confirmButtonText: 'Outra Atividade!',
      cancelButtonText: 'Pagina Inicial!'
  }).then((result) => {
      if (result.isConfirmed) {
          // Se o usuário quiser continuar, recarregue a página
          window.location.reload(); // Recarregar a página
      } else {
          // Caso contrário, navegue para a página inicial
          navigate('/Lovelace/tool');
      }
  });
} 

export function savePdf() {
  generateInvoicePDF({
    activityName: currentTitle || "Título", // Usa o título armazenado
    score: Math.round(score),
    level: rank,
    timeSpent: new Date(timer * 1000).toISOString().substr(11, 8),
    answers: answers  // Passando as respostas para a função
  });
}

export function ainda_nao(){

  const resContainer = document.getElementById("resultContainer");
  resContainer.style.display="none";

  Swal.fire({
    title: 'Ainda estamos trabalhando nisso!',
    html: 'Por favor, aguarde...',
    allowOutsideClick: false,
    didOpen: () => {
      Swal.showLoading();
      
      // Fecha o alerta após 3 segundos (3000 milissegundos)
      setTimeout(() => {
        Swal.close();
        window.location.reload(); // Recarregar a página
      }, 3000);
    }
  }); 
}

export function handleForgotPassword() {
  Swal.fire({
    title: "Esqueceu sua senha?",
    text: "Digite seu e-mail para redefinir a senha:",
    input: "email",
    inputPlaceholder: "lovelace@gmail.com",
    showCancelButton: true,
    confirmButtonText: "Enviar",
    confirmButtonColor:"#F21B3F",
    cancelButtonText: "Cancelar",
    customClass: {
      confirmButton: 'swal-button-confirm',
      cancelButton: 'swal-button-cancel'
    }
  }).then(async (result) => {
    if (result.isConfirmed) {
      const email = result.value;

      // Verifica se o e-mail existe no Firestore
      const userQuery = await getUserByEmail(email);

      if (userQuery) {
        // E-mail existe, enviar e-mail de redefinição de senha
        sendPasswordResetEmail(auth, email)
          .then(() => {
            showToastSuccess("Um e-mail de redefinição de senha foi enviado para " + email);
          })
          .catch((error) => {
            console.error(error);
            showToastError("Não foi possível enviar o e-mail. Tente novamente mais tarde.");
          });
      } else {
        // E-mail não existe, exibir mensagem de erro
        showToastError("O e-mail informado não está cadastrado.");
      }
    }
  });
}