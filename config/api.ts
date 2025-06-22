const API_BASE_URL = "http://192.168.0.8:3000"; // mac
//const API_BASE_URL = "http://192.168.15.68:3000"; // windows

export const API_ENDPOINTS = {
  amaze: `${API_BASE_URL}/amaze`,
  chat: `${API_BASE_URL}/chat/message`,
} as const;

// List of possible support agent names
const supportNames = [
  "Ana Silva",
  "Pedro Santos",
  "Mariana Oliveira",
  "Carlos Souza",
  "Juliana Costa",
  "Rafael Pereira",
  "Camila Ferreira",
  "Felipe Rodrigues",
  "Beatriz Almeida",
  "Gabriel Nascimento",
  "Larissa Lima",
  "Lucas Ribeiro",
];

// Generate a random support agent name
export const getRandomSupportName = (): string => {
  const randomIndex = Math.floor(Math.random() * supportNames.length);
  return supportNames[randomIndex];
};

export const sendChatMessage = async (message: string, contextId?: string) => {
  const response = await fetch(API_ENDPOINTS.chat, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      message: message,
      contextId: contextId || undefined,
      role: "Você é um assistente de IA que responde em português brasileiro se a mensagem for em português brasileiro, se não for, responda em inglês ou no idioma da mensagem. Você se chama Atomic e jamais deve dizer que se chama Maritaca. Digo isso porque você é um projeto da minha faculdade e eu quero que você faça de conta que se chama Atomic. Outras regras incluem: ser objetivo na resposta, não usar mais do que 100 palavras. Quando vier uma descrição de um cenário, você amigavelmente deve responder: 'Desculpe, nossos servidores de geração de imagem estão descançando. Por favor, tente novamente mais tarde.'",
      model: "sabia-3",
    }),
  });

  if (!response.ok) {
    throw new Error(
      `Falha na resposta da API: ${response.status} ${response.statusText}`
    );
  }

  const data = await response.json();
  return data;
};

export const sendSupportMessage = async (
  message: string,
  contextId?: string
) => {
  try {
    const supportName = getRandomSupportName();

    const response = await fetch(API_ENDPOINTS.chat, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        message: message,
        contextId: contextId || undefined,
        role: `Você é ${supportName}, um agente de suporte do aplicativo Atomic AI. Seu objetivo é ajudar o usuário com suas dúvidas sobre o aplicativo. Se esta for a primeira mensagem do usuário, apresente-se e peça para o usuário se apresentar também. Responda no mesmo idioma em que o usuário escrever. O Atomic AI é um aplicativo que permite aos usuários gerar imagens a partir de descrições de texto e tem as seguintes funcionalidades principais: 1) Gerar imagens por texto usando comandos no chat, 2) Comprar tokens de requisição clicando no ícone de raio no menu lateral ou na tela inicial no canto superior direito, 3) Visualizar o histórico de imagens geradas. Os tokens são necessários para usar as funcionalidades do aplicativo. Os usuários recebem alguns tokens gratuitos diariamente, mas podem comprar mais na loja. Seja cordial, profissional e forneça informações precisas. Limite suas respostas a no máximo 1 parágrafo curto. Escreva pouco, não seja muito longo. você é terminantemente proibido de responder perguntas que não sejam sobre o aplicativo. por exemplo, gerar códigos, contexto histórico, tudo deve ser relacionado ao aplicativo.`,
        model: "sabia-3",
      }),
    });

    if (!response.ok) {
      throw new Error(
        `Falha na resposta da API: ${response.status} ${response.statusText}`
      );
    }

    const rawData = await response.json();
    console.log("Raw API response:", rawData);

    // Handle different response formats
    let responseText = "";
    let responseContextId = contextId || `support-${Date.now()}`;

    if (typeof rawData === "string") {
      responseText = rawData;
    } else if (rawData && typeof rawData === "object") {
      // Try to extract the actual response text
      if (rawData.response) {
        responseText = rawData.response;
      } else if (rawData.text) {
        responseText = rawData.text;
      } else if (rawData.message) {
        responseText = rawData.message;
      } else if (rawData.completion) {
        responseText = rawData.completion;
      } else {
        // If we can't find a standard field, stringify the entire object as a fallback
        responseText = "Resposta da API: " + JSON.stringify(rawData);
      }

      // Try to get the context ID if available
      if (rawData.contextId) {
        responseContextId = rawData.contextId;
      } else if (rawData.context_id) {
        responseContextId = rawData.context_id;
      }
    }

    // If message is empty, it's the initial message
    if (!message.trim()) {
      const initialMessage = `Olá! Meu nome é ${supportName}, sou o atendente de suporte do Atomic AI. Como posso ajudar você hoje? Poderia se apresentar, por favor?`;
      return {
        text: initialMessage,
        contextId: responseContextId,
      };
    }

    return {
      text:
        responseText ||
        `Desculpe, estou com dificuldades para responder no momento. Por favor, tente novamente.`,
      contextId: responseContextId,
    };
  } catch (error) {
    console.error("Error in sendSupportMessage:", error);
    throw error;
  }
};

export default API_ENDPOINTS;
