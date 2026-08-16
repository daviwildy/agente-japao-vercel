// api/chat.js
// VERSÃO INTEGRAL: Edge Web API com injeção forçada de CORS para o Wix e Arquivos Locais

export const config = {
  runtime: 'edge', // Obriga a Vercel a usar o motor moderno livre de travas
};

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
    return "Nenhum dado recente de 2026 encontrado.";
  } catch (error) {
    return "Falha ao realizar busca em tempo real.";
  }
}

export default async function handler(req) {
  // CONFIGURAÇÃO DOS CABEÇALHOS DO CORS NO PADRÃO WEB API
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*", // Libera o Wix e o seu arquivo local teste.html
    "Access-Control-Allow-Methods": "POST, OPTIONS, GET",
    "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Requested-With",
    "Content-Type": "application/json"
  };

  // 1. RESPONDE IMEDIATAMENTE AO TESTE DE PRÉ-CONEXÃO (OPTIONS) DO CHROME
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Método não permitido." }), { status: 405, headers: corsHeaders });
  }

  try {
    const { message, history = [] } = await req.json();

    if (!message) {
      return new Response(JSON.stringify({ error: "Mensagem obrigatória." }), { status: 400, headers: corsHeaders });
    }

    const dadosInternet = await buscarDadosWeb(message);

    const messages = [
      { role: "system", content: gerarSystemPrompt() },
      ...history.map((h) => ({
        role: h.role === "assistant" ? "assistant" : "user",
        content: h.content,
      })),
      { role: "user", content: `Contexto atualizado da internet (Ano 2026):\n${dadosInternet}\n\nPergunta: ${message}` },
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
      return new Response(JSON.stringify({ error: data.error.message }), { status: 500, headers: corsHeaders });
    }

    const reply = data.choices?.[0]?.message?.content || "Não consegui gerar uma resposta.";
    return new Response(JSON.stringify({ reply }), { status: 200, headers: corsHeaders });
    
  } catch (err) {
    return new Response(JSON.stringify({ error: "Erro interno no servidor." }), { status: 500, headers: corsHeaders });
  }
}

