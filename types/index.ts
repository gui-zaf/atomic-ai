// Definição de tipos comuns da aplicação

export interface Message {
  id: string;
  text: string;
  isUser: boolean;
  image?: string;
}

// Amostra de imagens para demonstração
export const sampleImages = ["sample01", "sample02", "sample03", "sample04"]; 