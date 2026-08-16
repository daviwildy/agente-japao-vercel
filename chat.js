// chat.js
// Backend do agente "Especialista em Economia do Japão" — versão Groq + Serper Web Search

// Usando o modelo Llama 3.3 70B, que é excelente para seguir instruções e interpretar dados
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
- Se a pergunta for sobre outro assunto fora da economia japonesa, decline educadamente e não faça buscas.

Regras de Resposta:
- Use os dados atuais que foram fornecidos a você na busca web.
- Seja didático, mas preciso. Use números e métricas sempre que disponíveis.
- Cite de forma breve o ano ou a fonte dos dados encontrados na busca para passar credibilidade.
- Responda sempre no idioma em que o usuário perguntar.
`;
}

// Função que conecta com o Serper.dev para buscar dados reais no Google
async function buscarDadosWeb(query) {
  try {
    const response = await fetch("https://serper.dev", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-KEY": process.env.SERPER_API_KEY, // Puxa a chave que você salvou na Vercel
      },
      body: JSON.stringify({ 
        q: `economia japao ${query}`, 
        gl: "br", 
        hl: "pt" 
      }),
    });

    const data = await response.json();
    
    // Filtra e junta os resumos dos primeiros resultados do Google
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
  // Configuração de CORS para permitir requisições do seu Frontend
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

    // 1. O agente vai no Google buscar dados atuais sobre a pergunta do usuário
    const dadosAtuaisDaInternet = await buscarDadosWeb(message);

    // 2. Monta o histórico de mensagens formatado para o Groq
    const messages = [
      { role: "system", content: gerarSystemPrompt() },
      ...history.map((h) => ({
        role: h.role === "assistant" ? "assistant" : "user",
        content: h.content,
      })),
      // Alimenta o modelo injetando a pesquisa web junto com o texto do usuário
      { 
        role: "user", 
        content: `Contexto atualizado da internet:\n${dadosAtuaisDaInternet}\n\nPergunta do usuário: ${message}` 
      },
    ];

    // 3. Faz a requisição oficial para a API do Groq
    const response = await fetch("https://groq.com", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: MODEL,
        messages,
        max_tokens: 1200,
        temperature: 0.3, // Temperatura baixa deixa as respostas econômicas mais exatas
      }),
    });

    const data = await response.json();

    if (data.error) {
      console.error("Erro da API Groq:", data.error);
      return res.status(500).json({ error: `Erro na API Groq: ${data.error.message}` });
    }

    // Pega o texto gerado pela IA (Linha corrigida com sintaxe limpa)
    const reply = data.choices?.[0]?.message?.content || "Não consegui gerar uma resposta.";

    return res.status(200).json({ reply });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Erro interno no servidor." });
  }
}
