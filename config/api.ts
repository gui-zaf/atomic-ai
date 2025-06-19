const API_BASE_URL = "http://192.168.15.78:3000";

export const API_ENDPOINTS = {
  amaze: `${API_BASE_URL}/amaze`,
  chat: `${API_BASE_URL}/chat/message`,
} as const;

/**
 * Envia uma mensagem para a API de chat e retorna a resposta
 */
export const sendChatMessage = async (message: string, contextId?: string) => {
  const response = await fetch(API_ENDPOINTS.chat, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify({
      message: message,
      contextId: contextId || undefined,
      role: "Você é um assistente útil e amigável.",
      model: "sabia-3"
    }),
  });

  if (!response.ok) {
    throw new Error(`Falha na resposta da API: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  return data;
};

export default API_ENDPOINTS;
