// Definição de tipos comuns da aplicação

export interface Message {
  id: string;
  text: string;
  isUser: boolean;
  image?: string;
}

// Images mapping
export interface ImageMapping {
  english: string;
  portuguese: string;
  filename: string;
}

// Mapping between suggestion descriptions and image filenames
export const imageDescriptionMapping: ImageMapping[] = [
  {
    english: "A cosmic feline floating among stars and galaxies, with a playful expression.",
    portuguese: "Um felino cósmico flutuando entre estrelas e galáxias, com uma expressão brincalhona.",
    filename: "cat-in-space"
  },
  {
    english: "A serene beach at sunset with golden sands and colorful sky reflecting on gentle waves.",
    portuguese: "Uma praia serena ao pôr do sol com areias douradas e céu colorido refletindo nas ondas suaves.",
    filename: "sunset-beach"
  },
  {
    english: "A magnificent castle with tall towers and magical elements, surrounded by a mystical landscape.",
    portuguese: "Um magnífico castelo com torres altas e elementos mágicos, cercado por uma paisagem mística.",
    filename: "fantasy-castle"
  },
  {
    english: "A futuristic neon-lit cityscape with towering skyscrapers and flying vehicles in a rainy night.",
    portuguese: "Uma paisagem urbana futurista iluminada por neon com arranha-céus imponentes e veículos voadores em uma noite chuvosa.",
    filename: "cyberpunk-city"
  },
  {
    english: "Adorable animals in a cheerful meadow, playing together under a bright sunny sky.",
    portuguese: "Animais adoráveis em um prado alegre, brincando juntos sob um céu ensolarado.",
    filename: "cute-animals"
  },
  {
    english: "A vibrant landscape with rolling hills, flowing rivers, and a rainbow in the clear blue sky.",
    portuguese: "Uma paisagem vibrante com colinas ondulantes, rios fluentes e um arco-íris no céu azul límpido.",
    filename: "colorful-landscape"
  },
  {
    english: "A detailed portrait with futuristic elements, cybernetic enhancements, and glowing details.",
    portuguese: "Um retrato detalhado com elementos futuristas, aprimoramentos cibernéticos e detalhes brilhantes.",
    filename: "sci-fi-portrait"
  },
  {
    english: "A mesmerizing abstract composition with swirling shapes, bold colors, and dynamic patterns.",
    portuguese: "Uma composição abstrata hipnotizante com formas ondulantes, cores vivas e padrões dinâmicos.",
    filename: "abstract-art"
  }
];

// Amostra de imagens para demonstração (legacy - keeping for backward compatibility)
export const sampleImages = ["sample01", "sample02", "sample03", "sample04"]; 