const GEMINI_MODEL = "gemini-3.5-flash";

function gerarSystemPrompt() {
  const hoje = new Date().toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric"
  });

  return `
Você é um agente especialista exclusivamente em economia do Japão.

A data atual é ${hoje}.

Responda sempre em português brasileiro.
Seja claro, didático e preciso.
Use informações atuais encontradas na pesquisa web.
Não invente números, datas ou fatos.
`;
}

async function buscarDadosWeb(query) {
  const apiKey = process.env.SERPER_API_KEY;

  if (!apiKey) {
    throw new Error("SERPER_API_KEY não está configurada.");
  }

  const response = await fetch(
    "https://google.serper.dev/search",
    {
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
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      `Erro Serper: ${data?.message || response.status}`
    );
  }

  if (!data.organic || data.organic.length === 0) {
    return "Nenhum resultado recente encontrado.";
  }

  return data.organic
    .slice(0, 5)
    .map((item, index) => {
      return `Resultado ${index + 1}:
Título: ${item.title || "Sem título"}
Fonte: ${item.link || "Sem link"}
Resumo: ${item.snippet || "Sem resumo"}
`;
    })
    .join("\n");
}

async function gerarRespostaGemini(message, history, dadosWeb) {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error("GEMINI_API_KEY não está configurada.");
  }

  const historico = Array.isArray(history)
    ? history
        .slice(-10)
        .map((item) => {
          const papel =
            item.role === "assistant"
              ? "Assistente"
              : "Usuário";

          return `${papel}: ${item.content}`;
        })
        .join("\n")
    : "Nenhum histórico.";

  const input = `
DADOS DA PESQUISA NA INTERNET:

${dadosWeb}

HISTÓRICO:

${historico}

PERGUNTA:

${message}

Responda utilizando os dados encontrados.
Não invente informações.
Responda em português brasileiro.
`;

  const response = await fetch(
    "https://generativelanguage.googleapis.com/v1/interactions",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": apiKey
      },
      body: JSON.stringify({
        model: GEMINI_MODEL,
        system_instruction: gerarSystemPrompt(),
        input: input,
        store: false
      })
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      `Erro Gemini: ${
        data?.error?.message || "Erro desconhecido"
      }`
    );
  }

  if (
    typeof data.output_text === "string" &&
    data.output_text.trim()
  ) {
    return data.output_text.trim();
  }

  let resposta = "";

  if (Array.isArray(data.steps)) {
    for (const step of data.steps) {
      if (
        step.type === "model_output" &&
        Array.isArray(step.content)
      ) {
        for (const content of step.content) {
          if (
            content.type === "text" &&
            content.text
          ) {
            resposta += content.text;
          }
        }
      }
    }
  }

  if (!resposta.trim()) {
    throw new Error(
      "O Gemini não retornou uma resposta."
    );
  }

  return resposta.trim();
}

export default async function handler(req, res) {
  res.setHeader(
    "Access-Control-Allow-Origin",
    "*"
  );

  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS"
  );

  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type"
  );

  if (req.method === "GET") {
    return res.status(200).json({
      status: "online",
      versao: "GEMINI-3.5-TESTE",
      modelo: GEMINI_MODEL
    });
  }

  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Método não permitido."
    });
  }

  try {
    const { message, history = [] } = req.body || {};

    if (!message || typeof message !== "string") {
      return res.status(400).json({
        error: "O campo message é obrigatório."
      });
    }

    console.log("Pergunta:", message);

    const dadosWeb = await buscarDadosWeb(message);

    console.log("Serper: OK");

    const reply = await gerarRespostaGemini(
      message,
      history,
      dadosWeb
    );

    console.log("Gemini: OK");

    return res.status(200).json({
      reply: reply
    });

  } catch (error) {
    console.error("ERRO NO BACKEND:", error);

    return res.status(500).json({
      error:
        error.message ||
        "Erro interno no servidor."
    });
  }
}

