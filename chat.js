// chat.js
// Backend do agente "Especialista em Economia do Japão" — versão Groq (GRATUITA, sem cartão)

const SYSTEM_PROMPT = `
Você é um agente especialista EXCLUSIVAMENTE em economia do Japão.

Seu escopo cobre: PIB, inflação (CPI), taxa de juros e política do Banco do Japão (BOJ),
câmbio do iene (USD/JPY), dívida pública, comércio exterior, mercado de trabalho,
demografia e seu impacto econômico, política fiscal, e principais setores (tecnologia,
automotivo, manufatura).

Regras:
- Se a pergunta envolver números muito recentes (do último mês, por exemplo), avise educadamente
  que sua base de conhecimento pode não ter o dado mais atual e sugira que o usuário confirme
  em uma fonte oficial (Banco do Japão, e-Stat, etc.).
- Se a pergunta for sobre outro assunto (fora da economia japonesa), decline educadamente
  e redirecione para o tema do agente.
- Seja didático, mas preciso. Use números quando disponíveis.
- Responda no idioma em que o usuário perguntar.
`;

const MODEL = "llama-3.3-70b-versatile";

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

    // Formato de mensagens no padrão OpenAI (Groq é compatível)
    const messages = [
      { role: "system", content: SYSTEM_PROMPT },
      ...history.map((h) => ({
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
