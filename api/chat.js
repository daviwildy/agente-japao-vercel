// api/chat.js
// Agente de IA — Especialista em Economia do Japão
// Vercel + Serper + Gemini

const GEMINI_MODEL = "gemini-2.5-flash";

function gerarSystemPrompt() {
  const hoje = new Date().toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric"
  });

  return `
Você é um agente especialista EXCLUSIVAMENTE em economia do Japão.

Data atual: ${hoje}.

REGRAS:
- Responda em português brasileiro.
- Seja didático, claro e preciso.
- Use os dados encontrados na pesquisa web como contexto.
- Priorize informações recentes.
- Não invente números, datas ou fatos.
- Se os dados encontrados forem insuficientes, deixe isso claro.
- Explique conceitos econômicos de maneira simples quando necessário.
- Você pode falar sobre PIB, inflação, juros, Banco do Japão, dívida pública,
  comércio exterior, exportações, importações, indústria, tecnologia,
  energia, demografia e outros assuntos diretamente relacionados à economia japonesa.
- Se a pergunta não tiver relação com a economia do Japão, explique educadamente
  que sua especialidade é economia do Japão.
`;
}

async function buscarDadosWeb(query) {
  const apiKey = process.env.SERPER_API_KEY;

  if (!apiKey) {
    throw new Error("SERPER_API_KEY não configurada na Vercel.");
  }

  const response = await fetch("https://google.serper.dev/search", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-API-KEY": apiKey
    },
    body: JSON.stringify({
      q: `economia do Japão 2026 ${query}`,
      gl: "br",
      hl: "pt-br",
      num: 5
    })
  });

  if (!response.ok) {
    const erro = await response.text();
    throw new Error(`Erro na Serper: ${response.status} - ${erro}`);
  }

  const data = await response.json();

  if (!data.organic || data.organic.length === 0) {
    return "Nenhum resultado recente foi encontrado.";
  }

  return data.organic
    .slice(0, 5)
    .map((item, index) => {
      return `${index + 1}. ${item.title}
Fonte: ${item.link}
Resumo: ${item.snippet || "Sem resumo disponível."}`;
    })
    .join("\n\n");
}

async function gerarRespostaGemini(message, history, dadosWeb) {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error("GEMINI_API_KEY não configurada na Vercel.");
  }

  const historicoTexto = Array.isArray(history)
    ? history
        .slice(-10)
        .map((item) => {
          const papel = item.role === "assistant" ? "Assistente" : "Usuário";
          return `${papel}: ${item.content}`;
        })
        .join("\n")
    : "";

  const prompt = `
${gerarSystemPrompt()}

DADOS ATUAIS ENCONTRADOS NA INTERNET:
${dadosWeb}

HISTÓRICO DA CONVERSA:
${historicoTexto || "Nenhum histórico."}

PERGUNTA DO USUÁRIO:
${message}

Responda à pergunta usando os dados encontrados.
Não mencione que você recebeu um "prompt".
Não diga que possui acesso mágico à internet.
Se utilizar números ou informações recentes, baseie-se nos dados fornecidos.
`;

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": apiKey
      },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [
              {
                text: prompt
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.3,
          maxOutputTokens: 1200
        }
      })
    }
  );

  const data = await response.json();

  if (!response.ok) {
    console.error("Erro Gemini:", data);

    const mensagem =
      data?.error?.message ||
      "Erro desconhecido na API Gemini.";

    throw new Error(`Erro Gemini: ${mensagem}`);
  }

  const resposta =
    data?.candidates?.[0]?.content?.parts
      ?.map((part) => part.text || "")
      .join("")
      .trim();

  if (!resposta) {
    throw new Error("Gemini não retornou uma resposta.");
  }

  return resposta;
}

export default async function handler(req, res) {
  // CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "POST, OPTIONS"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type"
  );

  // Preflight do navegador
  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  // Somente POST
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Método não permitido. Use POST."
    });
  }

  try {
    const { message, history = [] } = req.body || {};

    if (!message || typeof message !== "string") {
      return res.status(400).json({
        error: "O campo 'message' é obrigatório."
      });
    }

    console.log("Pergunta recebida:", message);

    // 1 — Pesquisa atual
    const dadosWeb = await buscarDadosWeb(message);

    console.log("Pesquisa Serper concluída.");

    // 2 — Geração da resposta
    const reply = await gerarRespostaGemini(
      message,
      history,
      dadosWeb
    );

    console.log("Resposta Gemini gerada.");

    return res.status(200).json({
      reply
    });

  } catch (error) {
    console.error("ERRO NO BACKEND:", error);

    return res.status(500).json({
      error: error.message || "Erro interno no servidor."
    });
  }
}

