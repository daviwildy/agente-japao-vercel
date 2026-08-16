// api/chat.js
// VERSÃO DEFINITIVA SEM ERROS DE SINTAXE - Node.js na Vercel

const MODEL = "llama-3.3-70b-versatile"; 

function gerarSystemPrompt() {
  const hoje = new Date().toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" });
  return `Você é um agente especialista EXCLUSIVAMENTE em economia do Japão.
A data atual de hoje é ${hoje} (Ano de 2026).
Use os dados atuais fornecidos na busca web. Seja didático e preciso. Responda no idioma do usuário.`;
}

async function buscarDadosWeb(query) {
  try {
    const response = await fetch("https://serper.dev", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-KEY": process.env.SERPER_API_KEY, 
      },
      body: JSON.stringify({ q: `economia japao 2026 ${query}`, gl: "br", hl: "pt" }),
    });
    const data = await response.json();
    if (data.organic && data.organic.length > 0) {
      return data.organic.slice(0, 3).map(item => `- ${item.title}: ${item.snippet}`).join("\n");
    }
    return "Nenhum dado recente de 2026 encontrado na busca.";
  } catch (error) {
    return "Falha ao realizar busca em tempo real.";
  }
}

export default async function handler(req, res) {
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

    const dadosAtuaisDaInternet = await buscarDadosWeb(message);

    const messages = [
      { role: "system", content: gerarSystemPrompt() },
      ...history.map((h) => ({
        role: h.role === "assistant" ? "assistant" : "user",
        content: h.content,
      })),
      { role: "user", content: `Contexto updated internet (2026):\n${dadosAtuaisDaInternet}\n\nPergunta: ${message}` },
    ];

    const response = await fetch("https://groq.com", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({ model: MODEL, messages, max_tokens: 1200, temperature: 0.3 }),
    });

    const data = await response.json();

    if (data.error) {
      return res.status(500).json({ error: `Erro na API Groq: ${data.error.message}` });
    }

    // LINHA TOTALMENTE CORRIGIDA COM APENAS UM PONTO DE INTERROGAÇÃO CONCATENADO:
    const reply = data.choices?.[0]?.message?.content || "Não consegui gerar uma resposta.";
    return res.status(200).json({ reply });
    
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Erro interno no servidor." });
  }
}

