const wppconnect = require('@wppconnect-team/wppconnect');
const opcoesDúvidas = require('./data/opcoesDuvidas');
const opcoesSUS = require('./data/opcoesSUS');

// Inicializando a sessão do WhatsApp
wppconnect.create({
  session: 'ubsf-bot',
  autoClose: 60000,
})
  .then((client) => start(client))
  .catch((error) => console.log(error));

// Função para encontrar a melhor correspondência (com número)
function findBestMatch(input, options) {
  const index = parseInt(input); // Converte a entrada para um número

  // Verifica se o índice está dentro do intervalo das opções
  if (index >= 1 && index <= options.length) {
    return options[index - 1]; // Retorna a opção correspondente
  } else {
    return null; // Retorna null se a entrada não for válida
  }
}

// Função principal que lida com as mensagens recebidas
function start(client) {
  client.onMessage((message) => {
    const lowerCaseMessage = message.body.toLowerCase();

    // Estado de controle da conversa
    if (!client.state) {
      client.state = {};
    }

    // Resposta inicial do bot ao receber uma saudação
    if (lowerCaseMessage === 'olá' || lowerCaseMessage === 'oi') {
      client.state[message.from] = 'inicio';
      client.sendText(message.from, 'Olá, tudo ótimo e contigo?\nMe chamo Luisa e sou sua assistente de saúde. Como posso te ajudar?\n1. Dúvidas\n2. Atendimento no SUS');
      return;
    }

    const state = client.state[message.from];

    if (state === 'inicio') {
      if (lowerCaseMessage === '1') {
        client.state[message.from] = 'duvidas';
        client.sendText(message.from, 'Você escolheu Dúvidas. Por favor, escolha uma das opções abaixo:\n1. Atestado Médico\n2. Agendamento de Cirurgias\n3. Fila de Espera');
      } else if (lowerCaseMessage === '2') {
        client.state[message.from] = 'sus';
        client.sendText(message.from, 'Você escolheu Atendimento no SUS. Por favor, escolha uma das opções abaixo:\n1. Gestante\n2. Vacinas\n3. Dengue\n4. Clínica Geral\n5. Cardiologia\n6. Pediatria\n7. Oftalmologia');
      } else {
        client.sendText(message.from, 'Por favor, escolha uma opção válida: 1 para Dúvidas ou 2 para Atendimento no SUS.');
      }
      return;
    }

    if (state === 'duvidas') {
        const bestMatch = findBestMatch(lowerCaseMessage, opcoesDúvidas);
        if (bestMatch) {
          client.state[message.from] = 'inicio'; // Voltar para o estado inicial após responder
          client.sendText(message.from, bestMatch) // Envia a resposta primeiro
            .then(() => {
              return client.sendText(message.from, 'Posso te ajudar com mais alguma coisa?\n1. Dúvidas\n2. Atendimento no SUS'); // Envia a segunda mensagem
            });
        } else {
          client.sendText(message.from, 'Por favor, escolha uma opção válida:\n1. Atestado Médico\n2. Agendamento de Cirurgias\n3. Fila de Espera');
        }
        return;
      }
      
      if (state === 'sus') {
        const bestMatch = findBestMatch(lowerCaseMessage, opcoesSUS);
        if (bestMatch) {
          client.state[message.from] = 'inicio'; // Voltar para o estado inicial após responder
          client.sendText(message.from, bestMatch) // Envia a resposta primeiro
            .then(() => {
              return client.sendText(message.from, 'Posso te ajudar com mais alguma coisa?\n1. Dúvidas\n2. Atendimento no SUS'); // Envia a segunda mensagem
            });
        } else {
          client.sendText(message.from, 'Por favor, escolha uma opção válida:\n1. Gestante\n2. Vacinas\n3. Dengue\n4. Clínica Geral\n5. Cardiologia\n6. Pediatria\n7. Oftalmologia');
        }
        return;
      }
      

    // Se o usuário enviar uma escolha inválida em qualquer estágio
    client.sendText(message.from, 'Por favor, escolha uma opção válida.');
  });
}
