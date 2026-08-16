// api/chat.js
// Versão Definitiva: Edge Runtime com CORS liberado para o Wix

export const config = {
  runtime: 'edge', // Garante execução ultrarrápida e sem timeout na Vercel
};

const MODEL = "llama-3.3-70b-versatile"; 

function gerarSystemPrompt() {
  const hoje = new Date().toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" });
  return `Você é um agente especialista EXCLUSIVAMENTE em economia do Japão. A data de hoje é ${hoje}.
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
      body: JSON.stringify({ q: `economia japao ${query}`, gl: "br", hl: "pt" }),
    });
    const data = await response.json();
    if (data.organic && data.organic.length > 0) {
      return data.organic.slice(0, 3).map(item => `- ${item.title}: ${item.snippet}`).join("\n");
    }
    return "Nenhum dado recente encontrado.";
  } catch (error) {
    return "Falha ao realizar busca.";
  }
}

export default async function handler(req) {
  // Configuração obrigatória de Headers para liberar o acesso do Wix (CORS)
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Type": "application/json",
  };

  // Trata requisições de teste enviadas pelos navegadores (OPTIONS)
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Método não permitido." }), { status: 405, headers });
  }

  try {
    const { message, history = [] } = await req.json();

    if (!message) {
      return new Response(JSON.stringify({ error: "Mensagem obrigatória." }), { status: 400, headers });
    }

    const dadosAtuaisDaInternet = await buscarDadosWeb(message);

    const messages = [
      { role: "system", content: gerarSystemPrompt() },
      ...history.map((h) => ({
        role: h.role === "assistant" ? "assistant" : "user",
        content: h.content,
      })),
      { role: "user", content: `Contexto atualizado da internet:\n${dadosAtuaisDaInternet}\n\nPergunta: ${message}` },
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
      return new Response(JSON.stringify({ error: data.error.message }), { status: 500, headers });
    }

    const reply = data.choices?.message?.content || "Sem resposta.";
    return new Response(JSON.stringify({ reply }), { status: 200, headers });

  } catch (err) {
    return new Response(JSON.stringify({ error: "Erro interno." }), { status: 500, headers });
  }
}

