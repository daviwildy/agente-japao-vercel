// chat.js
// Backend do agente "Especialista em Economia do Japão" — versão Groq (GRATUITA, sem cartão)
 
const MODEL = "groq/compound";
 
function gerarSystemPrompt() {
  const hoje = new Date().toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
 
  return `
Você é um agente especialista EXCLUSIVAMENTE em economia do Japão.
 
A data de hoje é ${hoje}. Seu conhecimento de treinamento pode estar desatualizado
(pode parar em 2023 ou 2024) — por isso é OBRIGATÓRIO usar a busca na web em toda
resposta, para trazer dados realmente atuais de ${hoje.split(" de ").pop()} e não
informações antigas da sua memória.
 
Seu escopo cobre: PIB, inflação (CPI), taxa de juros e política do Banco do Japão (BOJ),
câmbio do iene (USD/JPY), dívida pública, comércio exterior, mercado de trabalho,
demografia e seu impacto econômico, política fiscal, e principais setores (tecnologia,
automotivo, manufatura).
 
Regras:
- OBRIGATÓRIO: antes de responder QUALQUER pergunta, use a ferramenta de busca na web
  para verificar informações atuais, mesmo que você ache que já sabe a resposta.
  Nunca responda só da memória — sempre confirme com uma busca primeiro.
  Cite a fonte e a data da informação encontrada.
- Se a pergunta for sobre outro assunto (fora da economia japonesa), decline educadamente
  e redirecione para o tema do agente (não precisa buscar nesse caso).
- Seja didático, mas preciso. Use números quando disponíveis.
- Responda no idioma em que o usuário perguntar.
`;
}
 
export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
 
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }
 
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método não permitido, use POST." });
  }
 
  try {
    const { message, history = [] } = req.body;
 
    if (!message || typeof message !== "string") {
      return res.status(400).json({ error: "Campo 'message' é obrigatório." });
    }
 
    // Limita o histórico às últimas mensagens, para não estourar o limite de tamanho da requisição
    const historicoLimitado = history.slice(-8);
 
    const messages = [
      { role: "system", content: gerarSystemPrompt() },
      ...historicoLimitado.map((h) => ({
        role: h.role === "assistant" ? "assistant" : "user",
        content: h.content,
      })),
      { role: "user", content: message },
    ];
 
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: MODEL,
        messages,
        max_tokens: 1200,
      }),
    });
 
    const data = await response.json();
 
    if (data.error) {
      console.error("Erro da API Groq:", data.error);
      return res.status(500).json({ error: "Erro ao consultar o agente." });
    }
 
    const reply = data.choices?.[0]?.message?.content || "Não consegui gerar uma resposta.";
 
    return res.status(200).json({ reply });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Erro interno no servidor." });
  }
}
