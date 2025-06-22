const API_BASE_URL = "http://192.168.0.8:3000"; // mac
//const API_BASE_URL = "http://192.168.15.68:3000"; // windows

export const API_ENDPOINTS = {
  amaze: `${API_BASE_URL}/amaze`,
  chat: `${API_BASE_URL}/chat/message`,
} as const;

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

export default API_ENDPOINTS;
