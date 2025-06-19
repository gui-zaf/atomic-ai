# API de Chat com Contexto

Esta API permite interagir com um modelo de IA mantendo o contexto da conversa entre as requisições.

## Endpoints

### Enviar Mensagem

Envia uma mensagem para o modelo e recebe uma resposta, mantendo o contexto da conversa.

```
POST /chat/message
```

**Corpo da Requisição:**

```json
{
  "message": "Olá, como você está?",
  "contextId": "abc123",  // Opcional - se não fornecido, um novo será gerado
  "role": "Você é um assistente útil e amigável.",  // Opcional - papel do sistema
  "model": "sabia-3"  // Opcional - modelo a ser usado
}
```

**Resposta:**

```json
{
  "contextId": "abc123",
  "response": "Olá! Estou bem, obrigado por perguntar. Como posso ajudar você hoje?",
  "messages": [
    { "role": "system", "content": "Você é um assistente útil e amigável." },
    { "role": "user", "content": "Olá, como você está?" },
    { "role": "assistant", "content": "Olá! Estou bem, obrigado por perguntar. Como posso ajudar você hoje?" }
  ]
}
```

### Obter Histórico

Retorna o histórico de mensagens de um contexto específico.

```
GET /chat/history/:contextId?
```

**Parâmetros:**
- `contextId`: ID do contexto (opcional na URL, pode ser fornecido no corpo ou cabeçalho)

**Resposta:**

```json
{
  "contextId": "abc123",
  "messages": [
    { "role": "system", "content": "Você é um assistente útil e amigável." },
    { "role": "user", "content": "Olá, como você está?" },
    { "role": "assistant", "content": "Olá! Estou bem, obrigado por perguntar. Como posso ajudar você hoje?" }
  ]
}
```

### Limpar Contexto

Limpa o histórico de mensagens de um contexto, mantendo apenas a mensagem do sistema.

```
POST /chat/clear/:contextId?
```

**Parâmetros:**
- `contextId`: ID do contexto (opcional na URL, pode ser fornecido no corpo ou cabeçalho)

**Resposta:**

```json
{
  "contextId": "abc123",
  "message": "Contexto limpo com sucesso",
  "messages": [
    { "role": "system", "content": "Você é um assistente útil e amigável." }
  ]
}
```

### Definir Papel do Sistema

Define o papel do sistema para um contexto específico.

```
POST /chat/role/:contextId?
```

**Corpo da Requisição:**

```json
{
  "role": "Você é um assistente técnico especializado em programação."
}
```

**Resposta:**

```json
{
  "contextId": "abc123",
  "message": "Papel do sistema definido com sucesso",
  "messages": [
    { "role": "system", "content": "Você é um assistente técnico especializado em programação." }
  ]
}
```

### Obter Papéis Predefinidos

Retorna os papéis predefinidos disponíveis.

```
GET /chat/roles
```

**Resposta:**

```json
{
  "roles": {
    "ASSISTANT": "Você é um assistente útil e amigável.",
    "CREATIVE": "Você é um assistente criativo que ajuda a gerar ideias inovadoras.",
    "TECHNICAL": "Você é um assistente técnico especializado em programação e tecnologia."
  }
}
```

## Manutenção de Contexto

O contexto é mantido através do `contextId`. Para continuar uma conversa, envie o mesmo `contextId` nas requisições subsequentes. Você pode fornecer o `contextId` de três formas:

1. No corpo da requisição: `{ "contextId": "abc123" }`
2. No cabeçalho HTTP: `X-Context-Id: abc123`
3. Na URL para endpoints que aceitam parâmetros: `/chat/history/abc123`

Se nenhum `contextId` for fornecido, um novo será gerado automaticamente. 