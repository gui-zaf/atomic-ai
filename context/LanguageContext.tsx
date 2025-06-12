import React, { createContext, useContext, useState, ReactNode } from 'react';

// Define language types and translations
export type Language = 'en' | 'pt';

export interface LanguageContextType {
  language: Language;
  toggleLanguage: () => void;
  t: (key: string) => string;
}

// Translations for the app
const translations = {
  en: {
    // Menu
    quickActions: 'Quick Actions',
    newChat: 'New Chat',
    gallery: 'Gallery',
    history: 'History',
    store: 'Store',
    buyTokens: 'Buy Tokens',
    settings: 'Settings',
    lightMode: 'Light Mode',
    darkMode: 'Dark Mode',
    about: 'About',
    developers: 'Developers',
    
    // History Screen
    historyTitle: 'History',
    noRequestHistory: 'No request history',
    historyWillAppear: 'Your conversation history will appear here',
    startConversation: 'Start a conversation',
    
    // Gallery Screen
    galleryTitle: 'Gallery',
    noImagesInGallery: 'No images in gallery',
    useImageCommand: 'Use the "/image" command in chat to generate new images',
    createNewImage: 'Create new image',
    
    // Image Viewer
    deleteImage: 'Delete Image',
    deleteImageConfirmation: 'Do you want to delete this image?',
    yes: 'Yes',
    no: 'No',

    // Welcome Message
    welcomeMessage: 'Hello, what would you like to create today?',

    // Suggestions
    suggestions: 'Suggestions',
    catInSpace: 'Cat in space',
    sunsetBeach: 'Sunset beach',
    fantasycastle: 'Fantasy castle',
    cyberpunkCity: 'Cyberpunk city',
    cuteAnimals: 'Cute animals',
    colorfulLandscape: 'Colorful landscape',
    sciFiPortrait: 'Sci-fi portrait',
    abstractArt: 'Abstract art',
    
    // Suggestion Descriptions
    catInSpaceDesc: 'A cosmic feline floating among stars and galaxies, with a playful expression.',
    sunsetBeachDesc: 'A serene beach at sunset with golden sands and colorful sky reflecting on gentle waves.',
    fantasycastleDesc: 'A magnificent castle with tall towers and magical elements, surrounded by a mystical landscape.',
    cyberpunkCityDesc: 'A futuristic neon-lit cityscape with towering skyscrapers and flying vehicles in a rainy night.',
    cuteAnimalsDesc: 'Adorable animals in a cheerful meadow, playing together under a bright sunny sky.',
    colorfulLandscapeDesc: 'A vibrant landscape with rolling hills, flowing rivers, and a rainbow in the clear blue sky.',
    sciFiPortraitDesc: 'A detailed portrait with futuristic elements, cybernetic enhancements, and glowing details.',
    abstractArtDesc: 'A mesmerizing abstract composition with swirling shapes, bold colors, and dynamic patterns.',

    // Developers Screen
    developersTitle: 'Developers',
    softwareEngineer: 'Software Engineer',
    githubLink: 'GitHub',
    linkedinLink: 'LinkedIn',

    // Token Store
    tokenStoreTitle: 'Token Store',
    powerUpAI: 'Power Up Your AI Experience',
    purchaseTokensDescription: 'Purchase tokens to generate more images and chat with our AI. The more tokens you have, the more you can create!',
    bestValue: 'Best Value',
    buyNow: 'Buy Now',
    confirmPurchase: 'Confirm Purchase',
    aboutToPurchase: 'You are about to purchase {0} tokens for {1}.',
    cancel: 'Cancel',
    confirm: 'Confirm',
    purchaseSuccessful: 'Purchase Successful!',
    tokensAdded: 'You\'ve added {0} tokens to your account.',
    ok: 'OK',
    tokens: 'tokens',
    standardGeneration: 'Standard Generation',
    hdGeneration: 'HD Generation',
    fourKGeneration: '4K Generation',
    basicChat: 'Basic Chat',
    advancedChat: 'Advanced Chat',
    premiumChat: 'Premium Chat',
    prioritySupport: 'Priority Support',
    advancedFeatures: 'Advanced Features',
    casualUser: 'Perfect for casual users looking to explore AI capabilities with basic features.',
    regularUser: 'Our most popular plan. Perfect balance of features and value for regular users.',
    powerUser: 'For power users who need it all. Unlimited access to our most advanced AI features.',

    // General
    back: 'Back',
  },
  pt: {
    // Menu
    quickActions: 'Ações Rápidas',
    newChat: 'Novo Chat',
    gallery: 'Galeria',
    history: 'Histórico',
    store: 'Loja',
    buyTokens: 'Comprar Tokens',
    settings: 'Configurações',
    lightMode: 'Modo Claro',
    darkMode: 'Modo Escuro',
    about: 'Sobre',
    developers: 'Desenvolvedores',
    
    // History Screen
    historyTitle: 'Histórico',
    noRequestHistory: 'Nenhum histórico de solicitações',
    historyWillAppear: 'Seu histórico de conversas aparecerá aqui',
    startConversation: 'Iniciar uma conversa',
    
    // Gallery Screen
    galleryTitle: 'Galeria',
    noImagesInGallery: 'Nenhuma imagem na galeria',
    useImageCommand: 'Use o comando "/image" no chat para gerar novas imagens',
    createNewImage: 'Criar nova imagem',
    
    // Image Viewer
    deleteImage: 'Excluir Imagem',
    deleteImageConfirmation: 'Deseja excluir esta imagem?',
    yes: 'Sim',
    no: 'Não',

    // Welcome Message
    welcomeMessage: 'Olá, o que você deseja criar hoje?',

    // Suggestions
    suggestions: 'Sugestões',
    catInSpace: 'Gato no espaço',
    sunsetBeach: 'Praia ao pôr do sol',
    fantasycastle: 'Castelo de fantasia',
    cyberpunkCity: 'Cidade cyberpunk',
    cuteAnimals: 'Animais fofos',
    colorfulLandscape: 'Paisagem colorida',
    sciFiPortrait: 'Retrato de ficção científica',
    abstractArt: 'Arte abstrata',
    
    // Suggestion Descriptions
    catInSpaceDesc: 'Um felino cósmico flutuando entre estrelas e galáxias, com uma expressão brincalhona.',
    sunsetBeachDesc: 'Uma praia serena ao pôr do sol com areias douradas e céu colorido refletindo nas ondas suaves.',
    fantasycastleDesc: 'Um magnífico castelo com torres altas e elementos mágicos, cercado por uma paisagem mística.',
    cyberpunkCityDesc: 'Uma paisagem urbana futurista iluminada por neon com arranha-céus imponentes e veículos voadores em uma noite chuvosa.',
    cuteAnimalsDesc: 'Animais adoráveis em um prado alegre, brincando juntos sob um céu ensolarado.',
    colorfulLandscapeDesc: 'Uma paisagem vibrante com colinas ondulantes, rios fluentes e um arco-íris no céu azul límpido.',
    sciFiPortraitDesc: 'Um retrato detalhado com elementos futuristas, aprimoramentos cibernéticos e detalhes brilhantes.',
    abstractArtDesc: 'Uma composição abstrata hipnotizante com formas ondulantes, cores vivas e padrões dinâmicos.',

    // Developers Screen
    developersTitle: 'Desenvolvedores',
    softwareEngineer: 'Engenheiro de Software',
    githubLink: 'GitHub',
    linkedinLink: 'LinkedIn',

    // Token Store
    tokenStoreTitle: 'Loja de Tokens',
    powerUpAI: 'Potencialize Sua Experiência com IA',
    purchaseTokensDescription: 'Compre tokens para gerar mais imagens e conversar com nossa IA. Quanto mais tokens você tiver, mais você pode criar!',
    bestValue: 'Melhor Valor',
    buyNow: 'Comprar Agora',
    confirmPurchase: 'Confirmar Compra',
    aboutToPurchase: 'Você está prestes a comprar {0} tokens por {1}.',
    cancel: 'Cancelar',
    confirm: 'Confirmar',
    purchaseSuccessful: 'Compra Bem-sucedida!',
    tokensAdded: 'Você adicionou {0} tokens à sua conta.',
    ok: 'OK',
    tokens: 'tokens',
    standardGeneration: 'Geração Padrão',
    hdGeneration: 'Geração HD',
    fourKGeneration: 'Geração 4K',
    basicChat: 'Chat Básico',
    advancedChat: 'Chat Avançado',
    premiumChat: 'Chat Premium',
    prioritySupport: 'Suporte Prioritário',
    advancedFeatures: 'Recursos Avançados',
    casualUser: 'Perfeito para usuários casuais que desejam explorar as capacidades da IA com recursos básicos.',
    regularUser: 'Nosso plano mais popular. Equilíbrio perfeito entre recursos e valor para usuários regulares.',
    powerUser: 'Para usuários avançados que precisam de tudo. Acesso ilimitado aos nossos recursos de IA mais avançados.',

    // General
    back: 'Voltar',
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>('en');

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'pt' : 'en');
  };

  // Translation function
  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations[typeof language]] || key;
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        toggleLanguage,
        t,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}; 