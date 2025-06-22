import React, { createContext, useContext, useState, ReactNode } from "react";

// Define language types and translations
export type Language = "en" | "pt";

export interface LanguageContextType {
  language: Language;
  toggleLanguage: () => void;
  t: (key: string) => string;
}

// Define a more comprehensive type for translations
type TranslationObject = Record<string, string | Record<string, string>>;

// Translation for a specific language
interface LanguageTranslation {
  [key: string]: string | TranslationObject;
}

// Translations for the app
const translations = {
  en: {
    // Menu
    quickActions: "Quick Actions",
    newChat: "Clear Chat",
    gallery: "Support",
    history: "History",
    store: "Store",
    buyTokens: "Buy Tokens",
    settings: "Settings",
    lightMode: "Light Mode",
    darkMode: "Dark Mode",
    about: "About",
    developers: "Developers",

    // History Screen
    historyTitle: "History",
    noRequestHistory: "No request history",
    historyWillAppear: "Your conversation history will appear here",
    startConversation: "Start a conversation",
    historyInteraction: "interaction",
    historyInteractions: "interactions",
    deleteHistoryTitle: "Delete History",
    deleteHistoryConfirmation: "Are you sure you want to delete all history items?",
    deleteItemTitle: "Delete Item",
    deleteItemConfirmation: "Are you sure you want to delete this item?",

    // History Cards
    historyChat: "Chat",
    historyImage: "Image",
    historyError: "Error",
    historyPrompt: "Prompt",
    historyResponse: "Response",
    historyDate: "Date",
    historyTokens: "Tokens",
    historyModel: "Model",
    historyDelete: "Delete",
    historyApiError: "API Connection Error",
    historyApiErrorDetail: "We couldn't connect to our suggestion service. Please check your connection and try again.",
    historyFailedSuggestion: "Failed to get suggestion from our service.",
    historySimulated: "Simulated",
    historyImageGenerated: "Image Generated",

    // Gallery Screen
    galleryTitle: "Gallery",
    noImagesInGallery: "No images in gallery",
    useImageCommand: 'Use the "/image" command in chat to generate new images',
    createNewImage: "Create new image",

    // Image Viewer
    deleteImage: "Delete Image",
    deleteImageConfirmation: "Do you want to delete this image?",
    yes: "Yes",
    no: "No",
    downloadImage: "Download Image",
    downloadSuccess: "Image saved to gallery",
    downloadError: "Failed to save image",
    permissionNeeded: "Storage Permission Required",
    permissionMessage: "We need storage permission to save images to your gallery.",
    openSettings: "Open Settings",

    // Welcome Message
    welcomeMessage: "Hello, what would you like to create today?",

    // Suggestions
    suggestions: "Suggestions",
    catInSpace: "Cat in space",
    sunsetBeach: "Sunset beach",
    fantasycastle: "Fantasy castle",
    cyberpunkCity: "Cyberpunk city",
    cuteAnimals: "Cute animals",
    colorfulLandscape: "Colorful landscape",
    sciFiPortrait: "Sci-fi portrait",
    abstractArt: "Abstract art",

    // Suggestion Descriptions
    catInSpaceDesc:
      "A cosmic feline floating among stars and galaxies, with a playful expression.",
    sunsetBeachDesc:
      "A serene beach at sunset with golden sands and colorful sky reflecting on gentle waves.",
    fantasycastleDesc:
      "A magnificent castle with tall towers and magical elements, surrounded by a mystical landscape.",
    cyberpunkCityDesc:
      "A futuristic neon-lit cityscape with towering skyscrapers and flying vehicles in a rainy night.",
    cuteAnimalsDesc:
      "Adorable animals in a cheerful meadow, playing together under a bright sunny sky.",
    colorfulLandscapeDesc:
      "A vibrant landscape with rolling hills, flowing rivers, and a rainbow in the clear blue sky.",
    sciFiPortraitDesc:
      "A detailed portrait with futuristic elements, cybernetic enhancements, and glowing details.",
    abstractArtDesc:
      "A mesmerizing abstract composition with swirling shapes, bold colors, and dynamic patterns.",

    // Developers Screen
    developersTitle: "Developers",
    softwareEngineer: "Software Engineer",
    githubLink: "GitHub",
    linkedinLink: "LinkedIn",

    // Token Store
    tokenStoreTitle: "Token Store",
    powerUpAI: "Power Up Your AI Experience",
    purchaseTokensDescription:
      "Purchase tokens to generate more images and chat with our AI. The more tokens you have, the more you can create!",
    bestValue: "Best Value",
    buyNow: "Buy Now",
    confirmPurchase: "Confirm Purchase",
    aboutToPurchase: "You are about to purchase {0} tokens for {1}.",
    cancel: "Cancel",
    confirm: "Confirm",
    purchaseSuccessful: "Purchase Successful!",
    tokensAdded: "You've added {0} tokens to your account.",
    ok: "OK",
    tokens: "tokens",
    standardGeneration: "Standard Generation",
    hdGeneration: "HD Generation",
    fourKGeneration: "4K Generation",
    basicChat: "Basic Chat",
    advancedChat: "Advanced Chat",
    premiumChat: "Premium Chat",
    prioritySupport: "Priority Support",
    advancedFeatures: "Advanced Features",
    casualUser:
      "Perfect for casual users looking to explore AI capabilities with basic features.",
    regularUser:
      "Our most popular plan. Perfect balance of features and value for regular users.",
    powerUser:
      "For power users who need it all. Unlimited access to our most advanced AI features.",

    // General
    back: "Back",
    suggestionError: "Failed to get suggestion. Please try again.",
    apiError: "Text model request failed. Please try again later.",

    // About Screen
    aboutTitle: "About",
    atomicArtAbout: "About Atomic Art",
    atomicArtAboutContent:
      "Atomic Art is an innovative AI-powered image generation platform that transforms your ideas into impressive visual artworks. Using advanced AI technology (powered by OpenAI), the app allows users to create unique images just by describing what they want to see and choosing from various visual styles.",
    mainFeatures: "Main Features",
    mainFeaturesContent:
      "• Text-to-image generation: Create visual art from written descriptions.\n• Community gallery: Explore public creations and get inspired.\n• Interactive resources: Like, share, and download generated images.\n• Personal history: Track your creative journey with locally saved history.",
    techHighlights: "Technical Highlights",
    techHighlightsContent:
      "• Built with React Native and Expo for a native experience.\n• Powered by OpenAI image generation technology.\n• Secure and efficient backend infrastructure.",
    termsOfUse: "Terms of Use",
    termsOfUseContent:
      "• The app is intended for creative and personal use.\n• Users are responsible for the content they generate.\n• Generated content must respect general usage guidelines.",
    contentRights: "Content Rights",
    contentRightsContent:
      "• Users retain the rights to download and share the images they create.\n• Publicly shared images can be viewed and reinterpreted by other users.\n• The platform may display public images in the community gallery.",
    privacyData: "Privacy & Data",
    privacyDataContent:
      "• Image history is stored locally on the device.\n• No login is required in the current version.\n• The app requests storage permission to save images.",
    limitations: "Limitations",
    limitationsContent:
      '• The service is provided "as is", without warranties.\n• Image generation depends on API availability.\n• Some functions require an internet connection.',
    responsibleUse: "Responsible Use",
    responsibleUseContent:
      "• Respect reasonable usage limits.\n• Content must not infringe copyright or be offensive, illegal, or harmful.",
    modifications: "Modifications",
    modificationsContent:
      "• Terms may be updated periodically.\n• Continued use of the app indicates acceptance of the new versions of the terms.",
    contractor: "Contracting Parties",
    contractorContent:
      "Contractor: Pixelpenguin Tech\nCorporate Name: Luiz R. C. Silva Ltda\nCNPJ: 53.178.469/0001-81\n\nContracted: ZCode\nCPF: 240.436.318-20\n\nProject Nature: Volunteer, unpaid",

    // Support Screen
    supportTitle: "Support",
    supportMessage: "Need help? Our support team is here to assist you with any questions or issues you may have.",
    speakWithExpert: "Speak with Expert",
    inQueueMessage: "You're next in line, please wait...",
    estimatedTime: "Estimated time:",
    exitQueue: "Exit Queue",
    endSupportTitle: "End Support",
    endSupportMessage: "Are you sure you want to end this support session?",
    end: "End",
    isTyping: "is typing...",
    supportIntro: "Hello! My name is {0}, I'm the support agent for Atomic AI. How can I help you today? Could you please introduce yourself?",
    supportError: "Sorry, I'm having trouble responding at the moment. Please try again.",
  },
  pt: {
    // Menu
    quickActions: "Ações Rápidas",
    newChat: "Limpar Chat",
    gallery: "Suporte",
    history: "Histórico",
    store: "Loja",
    buyTokens: "Comprar Tokens",
    settings: "Configurações",
    lightMode: "Modo Claro",
    darkMode: "Modo Escuro",
    about: "Sobre",
    developers: "Desenvolvedores",

    // History Screen
    historyTitle: "Histórico",
    noRequestHistory: "Nenhum histórico de solicitações",
    historyWillAppear: "Seu histórico de conversas aparecerá aqui",
    startConversation: "Iniciar uma conversa",
    historyInteraction: "interação",
    historyInteractions: "interações",
    deleteHistoryTitle: "Excluir Histórico",
    deleteHistoryConfirmation: "Tem certeza que deseja excluir todo o histórico?",
    deleteItemTitle: "Excluir Item",
    deleteItemConfirmation: "Tem certeza que deseja excluir este item?",

    // History Cards
    historyChat: "Chat",
    historyImage: "Imagem",
    historyError: "Erro",
    historyPrompt: "Prompt",
    historyResponse: "Resposta",
    historyDate: "Data",
    historyTokens: "Tokens",
    historyModel: "Modelo",
    historyDelete: "Excluir",
    historyApiError: "Erro de Conexão com API",
    historyApiErrorDetail: "Não foi possível conectar ao nosso serviço de sugestões. Por favor, verifique sua conexão e tente novamente.",
    historyFailedSuggestion: "Falha ao obter sugestão do nosso serviço.",
    historySimulated: "Simulado",
    historyImageGenerated: "Imagem Gerada",

    // Gallery Screen
    galleryTitle: "Galeria",
    noImagesInGallery: "Nenhuma imagem na galeria",
    useImageCommand: 'Use o comando "/image" no chat para gerar novas imagens',
    createNewImage: "Criar nova imagem",

    // Image Viewer
    deleteImage: "Excluir Imagem",
    deleteImageConfirmation: "Deseja excluir esta imagem?",
    yes: "Sim",
    no: "Não",
    downloadImage: "Baixar Imagem",
    downloadSuccess: "Imagem salva na galeria",
    downloadError: "Falha ao salvar imagem",
    permissionNeeded: "Permissão de Armazenamento Necessária",
    permissionMessage: "Precisamos de permissão de armazenamento para salvar imagens na sua galeria.",
    openSettings: "Abrir Configurações",

    // Welcome Message
    welcomeMessage: "Olá, o que você deseja criar hoje?",

    // Suggestions
    suggestions: "Sugestões",
    catInSpace: "Gato no espaço",
    sunsetBeach: "Praia ao pôr do sol",
    fantasycastle: "Castelo de fantasia",
    cyberpunkCity: "Cidade cyberpunk",
    cuteAnimals: "Animais fofos",
    colorfulLandscape: "Paisagem colorida",
    sciFiPortrait: "Retrato de ficção científica",
    abstractArt: "Arte abstrata",

    // Suggestion Descriptions
    catInSpaceDesc:
      "Um felino cósmico flutuando entre estrelas e galáxias, com uma expressão brincalhona.",
    sunsetBeachDesc:
      "Uma praia serena ao pôr do sol com areias douradas e céu colorido refletindo nas ondas suaves.",
    fantasycastleDesc:
      "Um magnífico castelo com torres altas e elementos mágicos, cercado por uma paisagem mística.",
    cyberpunkCityDesc:
      "Uma paisagem urbana futurista iluminada por neon com arranha-céus imponentes e veículos voadores em uma noite chuvosa.",
    cuteAnimalsDesc:
      "Animais adoráveis em um prado alegre, brincando juntos sob um céu ensolarado.",
    colorfulLandscapeDesc:
      "Uma paisagem vibrante com colinas ondulantes, rios fluentes e um arco-íris no céu azul límpido.",
    sciFiPortraitDesc:
      "Um retrato detalhado com elementos futuristas, aprimoramentos cibernéticos e detalhes brilhantes.",
    abstractArtDesc:
      "Uma composição abstrata hipnotizante com formas ondulantes, cores vivas e padrões dinâmicos.",

    // Developers Screen
    developersTitle: "Desenvolvedores",
    softwareEngineer: "Engenheiro de Software",
    githubLink: "GitHub",
    linkedinLink: "LinkedIn",

    // Token Store
    tokenStoreTitle: "Loja de Tokens",
    powerUpAI: "Potencialize Sua Experiência com IA",
    purchaseTokensDescription:
      "Compre tokens para gerar mais imagens e conversar com nossa IA. Quanto mais tokens você tiver, mais você pode criar!",
    bestValue: "Melhor Valor",
    buyNow: "Comprar Agora",
    confirmPurchase: "Confirmar Compra",
    aboutToPurchase: "Você está prestes a comprar {0} tokens por {1}.",
    cancel: "Cancelar",
    confirm: "Confirmar",
    purchaseSuccessful: "Compra Bem-sucedida!",
    tokensAdded: "Você adicionou {0} tokens à sua conta.",
    ok: "OK",
    tokens: "tokens",
    standardGeneration: "Geração Padrão",
    hdGeneration: "Geração HD",
    fourKGeneration: "Geração 4K",
    basicChat: "Chat Básico",
    advancedChat: "Chat Avançado",
    premiumChat: "Chat Premium",
    prioritySupport: "Suporte Prioritário",
    advancedFeatures: "Recursos Avançados",
    casualUser:
      "Perfeito para usuários casuais que desejam explorar as capacidades da IA com recursos básicos.",
    regularUser:
      "Nosso plano mais popular. Equilíbrio perfeito entre recursos e valor para usuários regulares.",
    powerUser:
      "Para usuários avançados que precisam de tudo. Acesso ilimitado aos nossos recursos de IA mais avançados.",

    // General
    back: "Voltar",
    suggestionError: "Falha ao obter sugestão. Por favor, tente novamente.",
    apiError: "A requisição para o modelo de texto falhou. Tente novamente mais tarde.",

    // About Screen
    aboutTitle: "Sobre",
    atomicArtAbout: "Sobre o Atomic Art",
    atomicArtAboutContent:
      "O Atomic Art é uma plataforma inovadora de geração de imagens com inteligência artificial, que transforma suas ideias em obras de arte visuais impressionantes. Utilizando tecnologia avançada de IA (alimentada pela OpenAI), o aplicativo permite que os usuários criem imagens únicas apenas descrevendo o que desejam ver e escolhendo entre diversos estilos visuais.",
    mainFeatures: "Principais Funcionalidades",
    mainFeaturesContent:
      "• Geração de imagem por texto: Crie artes visuais a partir de descrições escritas.\n• Galeria da comunidade: Explore criações públicas e inspire-se.\n• Recursos interativos: Curta, compartilhe e baixe imagens geradas.\n• Histórico pessoal: Acompanhe sua jornada criativa com um histórico salvo localmente.",
    techHighlights: "Destaques Técnicos",
    techHighlightsContent:
      "• Desenvolvido com React Native e Expo para uma experiência nativa.\n• Alimentado por tecnologia de geração de imagens da OpenAI.\n• Infraestrutura de backend segura e eficiente.",
    termsOfUse: "Termos de Uso",
    termsOfUseContent:
      "• O app é destinado para uso criativo e pessoal.\n• Os usuários são responsáveis pelo conteúdo que geram.\n• O conteúdo gerado deve respeitar as diretrizes gerais de uso.",
    contentRights: "Direitos sobre o Conteúdo",
    contentRightsContent:
      "• Os usuários mantêm os direitos de download e compartilhamento das imagens que criarem.\n• Imagens compartilhadas publicamente podem ser vistas e reinterpretadas por outros usuários.\n• A plataforma pode exibir imagens públicas na galeria da comunidade.",
    privacyData: "Privacidade e Dados",
    privacyDataContent:
      "• O histórico de imagens é armazenado localmente no dispositivo.\n• Não é necessário login na versão atual.\n• O aplicativo solicita permissão de armazenamento para salvar imagens.",
    limitations: "Limitações",
    limitationsContent:
      '• O serviço é oferecido "como está", sem garantias.\n• A geração de imagens depende da disponibilidade da API.\n• Algumas funções exigem conexão com a internet.',
    responsibleUse: "Uso Responsável",
    responsibleUseContent:
      "• Respeite os limites razoáveis de uso.\n• O conteúdo não deve violar direitos autorais nem ser ofensivo, ilegal ou prejudicial.",
    modifications: "Modificações",
    modificationsContent:
      "• Os termos podem ser atualizados periodicamente.\n• O uso contínuo do app indica aceitação das novas versões dos termos.",
    contractor: "Contratante / Contratada",
    contractorContent:
      "Contratante: Pixelpenguin Tech\nRazão Social: Luiz R. C. Silva Ltda\nCNPJ: 53.178.469/0001-81\n\nContratada: ZCode\nCPF: 240.436.318-20\n\nNatureza do Projeto: Voluntário, sem remuneração",

    // Support Screen
    supportTitle: "Suporte",
    supportMessage: "Precisa de ajuda? Nossa equipe de suporte está aqui para ajudá-lo com quaisquer dúvidas ou problemas que você possa ter.",
    speakWithExpert: "Falar com Especialista",
    inQueueMessage: "Você é o próximo da fila, aguarde...",
    estimatedTime: "Tempo estimado:",
    exitQueue: "Sair da fila",
    endSupportTitle: "Encerrar Suporte",
    endSupportMessage: "Tem certeza que deseja encerrar esta sessão de suporte?",
    end: "Encerrar",
    isTyping: "está digitando...",
    supportIntro: "Olá! Meu nome é {0}, sou o atendente de suporte do Atomic AI. Como posso ajudar você hoje? Poderia se apresentar, por favor?",
    supportError: "Desculpe, estou com dificuldades para responder no momento. Por favor, tente novamente.",
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined,
);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>("en");

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === "en" ? "pt" : "en"));
  };

  // Translation function
  const t = (key: string): string => {
    return (
      translations[language][
        key as keyof (typeof translations)[typeof language]
      ] || key
    );
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
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
