// chat.js - Backend corrigido com busca web em tempo real e correção de modelo

// IMPORTANTE: Use um modelo válido do Groq. 
// O Llama 3.3 70B é excelente para seguir instruções complexas.
const MODEL = "llama-3.3-70b-versatile"; 

function gerarSystemPrompt() {
  const hoje = new Date().toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  return `
Você é um agente especialista EXCLUSIVAMENTE em economia do Japão.
A data de hoje é ${hoje}.

Regras de Escopo:
- Seu escopo cobre: PIB, inflação (CPI), taxa de juros e política do Banco do Japão (BOJ), câmbio do iene (USD/JPY), dívida pública, mercado de trabalho e demografia.
- Se a pergunta for sobre outro assunto fora da economia japonesa, decline educadamente.

Regras de Resposta:
- Use os dados atuais que foram fornecidos a você na busca web.
- Seja didático, mas preciso. Use números e métricas sempre que disponíveis.
- Cite de forma breve o ano ou a fonte dos dados para passar credibilidade.
- Responda no idioma em que o usuário perguntar.
`;
}

// Função auxiliar para buscar dados reais na internet
async function buscarDadosWeb(query) {
  try {
    // Usando a API gratuita do Serper.dev ou Tavily para buscar dados atualizados
    // Substitua pelo endpoint da sua ferramenta de busca de preferência
    const response = await fetch("https://serper.dev", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-KEY": process.env.SERPER_API_KEY, // Adicione essa chave na Vercel
      },
      body: JSON.stringify({ q: `economia japao ${query}`, gl: "br", hl: "pt" }),
    });

    const data = await response.json();
    
    // Une os snippets (resumos) dos primeiros resultados da busca
    if (data.organic && data.organic.length > 0) {
      return data.organic.slice(0, 3).map(item => `- ${item.title}: ${item.snippet}`).join("\n");
    }
    return "Nenhum dado recente encontrado na busca.";
  } catch (error) {
    console.error("Erro ao buscar na web:", error);
    return "Falha ao realizar busca em tempo real.";
  }
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

    // 1. Executa a busca na web antes de chamar o Groq para alimentar o modelo com dados atuais
    const dadosAtuaisDaInternet = await buscarDadosWeb(message);

    // 2. Monta o histórico no padrão OpenAI
    const messages = [
      { role: "system", content: gerarSystemPrompt() },
      ...history.map((h) => ({
        role: h.role === "assistant" ? "assistant" : "user",
        content: h.content,
      })),
      // Injeta o contexto da internet junto com a pergunta do usuário
      { 
        role: "user", 
        content: `Contexto atualizado da internet:\n${dadosAtuaisDaInternet}\n\nPergunta do usuário: ${message}` 
      },
    ];

    // 3. Faz a chamada ao Groq com o modelo correto
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
        temperature: 0.3, // Temperatura baixa para evitar que a IA invente dados econômicos
      }),
    });

    const data = await response.json();

    if (data.error) {
      console.error("Erro da API Groq:", data.error);
      return res.status(500).json({ error: `Erro na API Groq: ${data.error.message}` });
    }

    const reply = data.choices?.[0]?.message?.content || "Não consegui gerar uma resposta.";

    return res.status(200).json({ reply });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Erro interno no servidor." });
  }
}
