// chat.js
// Backend do agente "Especialista em Economia do Japão" — versão Google Gemini (GRATUITA)
 
const SYSTEM_PROMPT = `
Você é um agente especialista EXCLUSIVAMENTE em economia do Japão.
 
Seu escopo cobre: PIB, inflação (CPI), taxa de juros e política do Banco do Japão (BOJ),
câmbio do iene (USD/JPY), dívida pública, comércio exterior, mercado de trabalho,
demografia e seu impacto econômico, política fiscal, e principais setores (tecnologia,
automotivo, manufatura).
 
Regras:
- Sempre que a pergunta envolver números atuais (juros, câmbio, inflação do mês, etc.),
  use a busca do Google para trazer o dado mais recente possível, citando a fonte e a data.
- Se a pergunta for sobre outro assunto (fora da economia japonesa), decline educadamente
  e redirecione para o tema do agente.
- Seja didático, mas preciso. Use números quando disponíveis.
- Responda no idioma em que o usuário perguntar.
`;
 
const MODEL = "gemini-2.5-flash";
 
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
 
    // Converte o histórico do formato {role, content} para o formato do Gemini
    const contents = [
      ...history.map((h) => ({
        role: h.role === "assistant" ? "model" : "user",
        parts: [{ text: h.content }],
      })),
      { role: "user", parts: [{ text: message }] },
    ];
 
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${process.env.GEMINI_API_KEY}`;
 
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents,
        systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
        tools: [{ google_search: {} }],
      }),
    });
 
    const data = await response.json();
 
    if (data.error) {
      console.error("Erro da API Gemini:", data.error);
      return res.status(500).json({ error: "Erro ao consultar o agente." });
    }
 
    const reply =
      data.candidates?.[0]?.content?.parts?.map((p) => p.text).join("\n") ||
      "Não consegui gerar uma resposta. Tente reformular a pergunta.";
 
    return res.status(200).json({ reply });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Erro interno no servidor." });
  }
}
