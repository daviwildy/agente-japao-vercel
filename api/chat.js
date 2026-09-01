const GEMINI_MODEL = "gemini-3.5-flash";

function obterDataAtualBrasil() {
  return new Intl.DateTimeFormat("pt-BR", {
    timeZone: "America/Sao_Paulo",
    day: "2-digit",
    month: "2-digit",
    year: "numeric"
  }).format(new Date());
}

function obterDataISO() {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Sao_Paulo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).format(new Date());
}

function gerarSystemPrompt() {
  const data = obterDataAtualBrasil();
  const dataISO = obterDataISO();

  return `
Você é o "Especialista em Economia do Japão".

DATA ATUAL:
${data} (${dataISO})

FUSO HORÁRIO:
America/Sao_Paulo

==================================================
MISSÃO
==================================================

Você deve responder qualquer pergunta relacionada à economia do Japão.

O objetivo é fornecer informações ECONÔMICAS ATUAIS, precisas, quantitativas e verificáveis.

Você deve pesquisar os dados disponíveis na internet a cada pergunta.

NÃO fique preso a relatórios antigos quando existir uma atualização mais recente.

==================================================
REGRA DE ATUALIDADE
==================================================

Sempre priorize:

1. informações publicadas hoje;
2. informações publicadas nos últimos dias;
3. informações publicadas nas últimas semanas;
4. informações mais recentes disponíveis;
5. somente depois utilize relatórios anteriores como contexto.

Sempre considere a DATA DE PUBLICAÇÃO da fonte.

Se uma informação foi publicada em abril, mas existe atualização em setembro, utilize setembro.

Nunca trate automaticamente um relatório antigo como se fosse o dado atual.

==================================================
IMPORTANTE SOBRE "DADO DE HOJE"
==================================================

Nem todo indicador econômico possui um valor diário.

Por exemplo:

PIB:
não é divulgado diariamente.

Inflação:
normalmente é divulgada mensalmente.

Desemprego:
normalmente é divulgado mensalmente.

PIB trimestral:
é divulgado por trimestre.

Juros:
podem mudar em determinadas decisões do Banco do Japão.

Câmbio:
possui atualização praticamente contínua.

Bolsa:
possui atualização diária.

Notícias econômicas:
podem ser atualizadas diariamente.

Portanto, quando o usuário perguntar:

"Qual é o PIB do Japão hoje?"

NÃO invente um "PIB de hoje".

Explique:

"O PIB não é divulgado diariamente. O último dado oficial disponível é referente a [período], enquanto a projeção para 2026 é [valor]."

E informe a DATA DE REFERÊNCIA do dado.

==================================================
QUANDO O USUÁRIO PERGUNTAR "HOJE"
==================================================

Se o usuário perguntar:

"hoje"
"agora"
"neste momento"
"atualmente"
"como está hoje"
"qual o valor de hoje"

use a data atual:

${data}

Procure informações recentes.

Informe claramente:

📅 Data da consulta:
${data}

📊 Data de referência do indicador:
[período]

Isso é fundamental.

==================================================
PIB
==================================================

Para PIB, diferencie:

• PIB nominal;
• PIB real;
• PIB trimestral;
• PIB anual;
• PIB per capita;
• crescimento;
• projeção;
• estimativa;
• dado oficial.

Nunca diga que existe um "PIB diário".

Se o usuário perguntar pelo PIB de 2026:

• procure a projeção MAIS RECENTE;
• informe a instituição;
• informe a data da projeção;
• informe se é projeção;
• não utilize automaticamente uma projeção de abril se houver uma atualização posterior.

Se houver valores em dólares e ienes:

mostre ambos quando possível.

Se o valor em ienes for obtido por conversão, diga:

"Valor convertido, não previsão oficial em ienes."

==================================================
NÚMEROS
==================================================

O usuário quer números concretos.

Sempre que possível, informe:

• valor;
• unidade;
• período;
• data;
• status;
• fonte.

Exemplo:

🇯🇵 PIB nominal — 2026

💰 US$ X trilhões

💴 ¥ X trilhões

📅 Período: 2026

📌 Status: projeção

🏦 Fonte: FMI, atualização de [mês/ano]

==================================================
CÂMBIO
==================================================

Para câmbio, utilize informações recentes.

Diferencie:

• cotação atual;
• cotação de fechamento;
• máxima/mínima;
• média;
• projeção.

Se o usuário perguntar:

"Quanto está o dólar em ienes?"

procure a cotação mais recente disponível.

Informe a data.

==================================================
BOLSA
==================================================

Para Nikkei e outros índices:

• informe o valor mais recente;
• data;
• variação diária quando disponível;
• contexto.

Nunca utilize uma cotação antiga como se fosse atual.

==================================================
JUROS
==================================================

Para o Banco do Japão:

• informe a taxa vigente mais recente;
• data da decisão;
• próxima reunião, se disponível;
• expectativas somente se forem projeções/expectativas.

Não confunda expectativa de mercado com decisão oficial.

==================================================
INFLAÇÃO
==================================================

Informe:

• inflação mais recente disponível;
• mês de referência;
• inflação anual;
• núcleo quando disponível;
• meta do Banco do Japão;
• fonte.

==================================================
DÍVIDA PÚBLICA
==================================================

Diferencie:

• dívida em ienes;
• dívida como % do PIB;
• dívida bruta;
• dívida líquida;
• ano/período;
• projeção.

==================================================
COMÉRCIO
==================================================

Para exportações/importações:

• mês;
• valor;
• variação anual;
• saldo comercial;
• principais produtos quando relevante.

==================================================
MERCADO DE TRABALHO
==================================================

Para emprego:

• desemprego;
• empregos disponíveis;
• salários;
• crescimento salarial;
• período de referência.

==================================================
FONTES
==================================================

Priorize:

• Governo do Japão;
• Cabinet Office;
• Ministry of Finance Japan;
• Statistics Bureau of Japan;
• Bank of Japan;
• FMI;
• OCDE;
• Banco Mundial;
• BIS;
• Reuters;
• Bloomberg;
• Financial Times;
• Nikkei;
• outras fontes econômicas confiáveis.

Sempre que possível, dê preferência à fonte primária.

==================================================
CONFLITO ENTRE FONTES
==================================================

Se duas fontes apresentarem números diferentes:

NÃO escolha silenciosamente.

Explique:

"Fonte A: X"
"Fonte B: Y"

e diga qual é mais recente/oficial.

==================================================
PROJEÇÕES
==================================================

Nunca apresente projeção como fato.

Use:

"projeção"
"estimativa"
"previsão"

e informe a instituição.

==================================================
PERGUNTAS AMPAS
==================================================

Se o usuário perguntar:

"Como está a economia do Japão?"

apresente um panorama atual contendo, quando houver dados:

• PIB;
• crescimento;
• inflação;
• juros;
• câmbio;
• desemprego;
• salários;
• consumo;
• investimento;
• exportações;
• importações;
• dívida pública;
• conta corrente;
• indústria;
• bolsa;
• demografia;
• principais riscos;
• perspectivas.

Use dados recentes.

==================================================
NÃO INVENTAR
==================================================

Nunca invente números.

Nunca invente uma data.

Nunca invente uma fonte.

Nunca invente uma cotação.

Nunca invente um dado diário para um indicador que não é diário.

Se não encontrar o dado exato:

1. diga isso;
2. forneça o último dado disponível;
3. informe a data de referência;
4. explique a limitação.

==================================================
FORMATO
==================================================

Responda em português brasileiro.

Seja claro e profissional.

Use emojis e títulos moderadamente.

Coloque números importantes em destaque.

Sempre deixe claro quando o dado é:

🟢 oficial
🟡 estimativa
🔵 projeção
⚪ conversão

==================================================
FOCO
==================================================

Se a pergunta não tiver relação com a economia do Japão, informe brevemente que sua especialidade é economia japonesa.

Para qualquer pergunta econômica sobre o Japão, responda normalmente.
`;
}

function determinarConsultas(pergunta) {
  const q = pergunta.toLowerCase();

  const consultas = [
    `"${pergunta}" Japan latest`,
    `${pergunta} Japan 2026`,
    `${pergunta} Japan latest data`
  ];

  if (
    q.includes("pib") ||
    q.includes("gdp") ||
    q.includes("crescimento") ||
    q.includes("economia")
  ) {
    consultas.push(
      "Japan GDP latest 2026",
      "Japan GDP forecast latest 2026",
      "Japan nominal GDP 2026 latest",
      "Japan real GDP growth latest 2026",
      "Japan GDP Cabinet Office latest",
      "Japan GDP IMF latest 2026",
      "Japan GDP OECD latest 2026"
    );
  }

  if (
    q.includes("inflação") ||
    q.includes("inflacao") ||
    q.includes("preço") ||
    q.includes("precos")
  ) {
    consultas.push(
      "Japan inflation latest 2026",
      "Japan CPI latest 2026",
      "Japan inflation Statistics Bureau latest",
      "Japan inflation Bank of Japan latest"
    );
  }

  if (
    q.includes("juros") ||
    q.includes("taxa") ||
    q.includes("boj") ||
    q.includes("banco do japão") ||
    q.includes("banco do japao")
  ) {
    consultas.push(
      "Bank of Japan interest rate latest 2026",
      "BOJ policy rate latest",
      "Japan interest rate September 2026"
    );
  }

  if (
    q.includes("iene") ||
    q.includes("câmbio") ||
    q.includes("cambio") ||
    q.includes("dólar") ||
    q.includes("dolar") ||
    q.includes("usd")
  ) {
    consultas.push(
      "USD JPY latest",
      "USDJPY September 2026",
      "Japan yen latest exchange rate"
    );
  }

  if (
    q.includes("dívida") ||
    q.includes("divida") ||
    q.includes("déficit") ||
    q.includes("deficit")
  ) {
    consultas.push(
      "Japan government debt latest 2026",
      "Japan public debt latest IMF",
      "Japan fiscal deficit latest 2026"
    );
  }

  if (
    q.includes("desemprego") ||
    q.includes("emprego") ||
    q.includes("salário") ||
    q.includes("salario") ||
    q.includes("trabalho")
  ) {
    consultas.push(
      "Japan unemployment latest 2026",
      "Japan wages latest 2026",
      "Japan employment latest official"
    );
  }

  if (
    q.includes("export") ||
    q.includes("import") ||
    q.includes("comércio") ||
    q.includes("comercio") ||
    q.includes("balança") ||
    q.includes("balanca")
  ) {
    consultas.push(
      "Japan exports latest 2026",
      "Japan imports latest 2026",
      "Japan trade balance latest 2026",
      "Japan current account latest 2026"
    );
  }

  if (
    q.includes("nikkei") ||
    q.includes("bolsa") ||
    q.includes("ações") ||
    q.includes("acoes")
  ) {
    consultas.push(
      "Nikkei latest",
      "Japan stock market latest",
      "Nikkei 225 September 2026"
    );
  }

  if (
    q.includes("população") ||
    q.includes("populacao") ||
    q.includes("demografia") ||
    q.includes("natalidade")
  ) {
    consultas.push(
      "Japan population latest 2026",
      "Japan demographics latest",
      "Japan birth rate latest 2026"
    );
  }

  if (
    q.includes("indústria") ||
    q.includes("industria") ||
    q.includes("produção") ||
    q.includes("producao")
  ) {
    consultas.push(
      "Japan industrial production latest 2026",
      "Japan manufacturing latest 2026",
      "Japan industry latest"
    );
  }

  if (
    q.includes("consumo") ||
    q.includes("investimento") ||
    q.includes("investimentos")
  ) {
    consultas.push(
      "Japan consumer spending latest 2026",
      "Japan private consumption latest",
      "Japan investment latest 2026"
    );
  }

  return [...new Set(consultas)].slice(0, 25);
}

async function buscarDadosWeb(pergunta) {
  if (!process.env.SERPER_API_KEY) {
    throw new Error("SERPER_API_KEY não configurada");
  }

  const consultas = determinarConsultas(pergunta);
  const resultados = [];

  for (const consulta of consultas) {
    try {
      const response = await fetch(
        "https://google.serper.dev/search",
        {
          method: "POST",
          headers: {
            "X-API-KEY": process.env.SERPER_API_KEY,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            q: consulta,
            gl: "jp",
            hl: "en",
            num: 10
          })
        }
      );

      if (!response.ok) {
        console.error(
          "Serper HTTP:",
          response.status
        );
        continue;
      }

      const data = await response.json();

      if (Array.isArray(data.organic)) {
        for (const item of data.organic) {
          resultados.push({
            titulo: item.title || "",
            link: item.link || "",
            snippet: item.snippet || "",
            date: item.date || ""
          });
        }
      }
    } catch (erro) {
      console.error("Erro Serper:", erro);
    }
  }

  const vistos = new Set();
  const unicos = [];

  for (const item of resultados) {
    const chave =
      item.link ||
      `${item.titulo}-${item.snippet}`;

    if (vistos.has(chave)) {
      continue;
    }

    vistos.add(chave);
    unicos.push(item);
  }

  return {
    data_consulta: obterDataAtualBrasil(),
    resultados: unicos.slice(0, 100)
  };
}

async function buscarDadosIMF() {
  const indicadores = [
    "NGDPD",
    "NGDPDPC",
    "NGDP",
    "NGDPPC",
    "NGDP_RPCH",
    "PCPIPCH",
    "LUR",
    "GGXWDG_NGDP",
    "BCA",
    "GGXCNL_NGDP"
  ];

  const dados = {};

  for (const indicador of indicadores) {
    try {
      const url =
        `https://www.imf.org/external/datamapper/api/v1/${indicador}/JPN`;

      const response = await fetch(url);

      if (!response.ok) {
        continue;
      }

      const data = await response.json();

      if (data) {
        dados[indicador] = data;
      }
    } catch (erro) {
      console.error(
        `Erro IMF ${indicador}:`,
        erro
      );
    }
  }

  return dados;
}

function extrairTextoGemini(data) {
  if (!data) {
    return "";
  }

  if (typeof data.output_text === "string") {
    return data.output_text;
  }

  if (Array.isArray(data.output)) {
    const partes = [];

    for (const item of data.output) {
      if (typeof item === "string") {
        partes.push(item);
      }

      if (item && typeof item.text === "string") {
        partes.push(item.text);
      }

      if (item && Array.isArray(item.content)) {
        for (const content of item.content) {
          if (
            content &&
            typeof content.text === "string"
          ) {
            partes.push(content.text);
          }
        }
      }
    }

    if (partes.length) {
      return partes.join("\n");
    }
  }

  if (Array.isArray(data.steps)) {
    const partes = [];

    for (const step of data.steps) {
      if (
        step &&
        typeof step.text === "string"
      ) {
        partes.push(step.text);
      }

      if (
        step &&
        Array.isArray(step.content)
      ) {
        for (const content of step.content) {
          if (
            content &&
            typeof content.text === "string"
          ) {
            partes.push(content.text);
          }
        }
      }
    }

    if (partes.length) {
      return partes.join("\n");
    }
  }

  return "";
}

async function gerarRespostaGemini(
  pergunta,
  historico,
  dadosWeb,
  dadosIMF
) {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error(
      "GEMINI_API_KEY não configurada"
    );
  }

  const contextoWeb = JSON.stringify(
    dadosWeb,
    null,
    2
  ).slice(0, 120000);

  const contextoIMF = JSON.stringify(
    dadosIMF,
    null,
    2
  ).slice(0, 90000);

  const historicoSeguro =
    Array.isArray(historico)
      ? historico.slice(-10)
      : [];

  const input = `
DATA DA CONSULTA:
${obterDataAtualBrasil()}

PERGUNTA DO USUÁRIO:
${pergunta}

HISTÓRICO:
${JSON.stringify(
  historicoSeguro,
  null,
  2
)}

==================================================
DADOS PESQUISADOS AGORA
==================================================

${contextoWeb}

==================================================
DADOS DO FMI
==================================================

${contextoIMF}

==================================================
INSTRUÇÕES
==================================================

Responda à pergunta utilizando os dados pesquisados.

IMPORTANTE:

A pesquisa foi realizada agora.

Priorize os dados mais recentes.

Observe datas de publicação.

Não trate dados antigos como atuais.

Para cada número importante, tente identificar:

• valor;
• unidade;
• período;
• data de publicação;
• fonte;
• status.

Se o usuário perguntar "hoje" ou "agora", informe a data da consulta:

${obterDataAtualBrasil()}

Se o indicador não for diário, explique isso e forneça o último dado disponível com sua data de referência.

Não invente valores.

Não transforme projeções em dados oficiais.

Se houver uma projeção mais recente que a fornecida por uma fonte antiga, prefira a mais recente.

Se houver conflito entre fontes, explique.

Se for necessário converter dólares para ienes, deixe claro que é uma conversão.

Dê números concretos sempre que existirem.

Não responda apenas com explicações genéricas.
`;

  const response = await fetch(
    "https://generativelanguage.googleapis.com/v1/interactions",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key":
          process.env.GEMINI_API_KEY
      },
      body: JSON.stringify({
        model: GEMINI_MODEL,
        input,
        system_instruction:
          gerarSystemPrompt(),
        store: false
      })
    }
  );

  const texto = await response.text();

  if (!response.ok) {
    console.error(
      "Erro Gemini:",
      response.status,
      texto
    );

    throw new Error(
      `Gemini HTTP ${response.status}`
    );
  }

  let data;

  try {
    data = JSON.parse(texto);
  } catch {
    throw new Error(
      "Resposta inválida do Gemini"
    );
  }

  const resposta =
    extrairTextoGemini(data);

  if (!resposta) {
    console.error(
      "Gemini sem texto:",
      JSON.stringify(data)
    );

    throw new Error(
      "Gemini não retornou texto"
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

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method === "GET") {
    return res.status(200).json({
      status: "online",
      agente:
        "Especialista em Economia do Japão",
      modelo: GEMINI_MODEL,
      data:
        obterDataAtualBrasil(),
      fontes: [
        "Serper",
        "FMI",
        "Gemini"
      ]
    });
  }

  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Método não permitido"
    });
  }

  try {
    const body = req.body || {};

    const pergunta =
      typeof body.message === "string"
        ? body.message.trim()
        : "";

    const historico =
      Array.isArray(body.history)
        ? body.history
        : [];

    if (!pergunta) {
      return res.status(400).json({
        error: "Pergunta vazia"
      });
    }

    console.log(
      `[${obterDataAtualBrasil()}] Pergunta:`,
      pergunta
    );

    const [dadosWeb, dadosIMF] =
      await Promise.all([
        buscarDadosWeb(pergunta),
        buscarDadosIMF()
      ]);

    const resposta =
      await gerarRespostaGemini(
        pergunta,
        historico,
        dadosWeb,
        dadosIMF
      );

    return res.status(200).json({
      reply: resposta,
      model: GEMINI_MODEL,
      data:
        obterDataAtualBrasil()
    });

  } catch (erro) {
    console.error(
      "ERRO FINAL:",
      erro
    );

    return res.status(500).json({
      error:
        "Erro interno do servidor"
    });
  }
}
