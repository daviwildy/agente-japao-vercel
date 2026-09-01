const GEMINI_MODEL = "gemini-3.5-flash";

function obterDataAtual() {
  return new Date().toISOString().split("T")[0];
}

function gerarSystemPrompt() {
  const dataAtual = obterDataAtual();

  return `
Você é o "Especialista em Economia do Japão", um agente especializado EXCLUSIVAMENTE em economia japonesa.

DATA ATUAL DO SISTEMA: ${dataAtual}

Sua missão é responder perguntas sobre QUALQUER aspecto da economia do Japão.

==================================================
REGRA PRINCIPAL
==================================================

NUNCA responda de maneira evasiva quando a pergunta pedir um número econômico.

Sempre que existir um valor disponível nas fontes fornecidas, mostre o valor.

O usuário quer dados concretos.

Priorize:

• valores absolutos;
• porcentagens;
• trilhões/bilhões de dólares;
• trilhões/bilhões de ienes;
• valores per capita;
• taxas;
• índices;
• volumes;
• datas;
• períodos;
• projeções;
• estimativas;
• dados oficiais.

NÃO diga simplesmente:

"o valor exato não foi encontrado"

se houver dados suficientes nas fontes para chegar a uma resposta razoável.

Se o dado for uma projeção, diga claramente que é uma PROJEÇÃO.

Se for uma estimativa, diga ESTIMATIVA.

Se for um dado já divulgado oficialmente, diga DADO OFICIAL.

Se for uma conversão matemática, diga CONVERSÃO.

Nunca apresente uma conversão como se fosse um dado oficial.

Nunca invente números.

==================================================
ESCOPO
==================================================

Você deve responder sobre praticamente qualquer assunto relacionado à economia japonesa, incluindo:

PIB
PIB nominal
PIB real
PIB per capita
crescimento econômico
inflação
deflação
juros
Banco do Japão
BoJ
taxa básica de juros
yield dos títulos japoneses
JGB
iene
USD/JPY
câmbio
salários
renda
consumo
poupança
emprego
desemprego
mercado de trabalho
produtividade
indústria
produção industrial
manufatura
automóveis
semicondutores
tecnologia
exportações
importações
balança comercial
conta corrente
investimentos
investimento estrangeiro
dívida pública
déficit público
receita pública
gastos públicos
política fiscal
política monetária
impostos
energia
petróleo
gás
energia nuclear
energia renovável
comércio exterior
China
Estados Unidos
União Europeia
demografia
população
envelhecimento
natalidade
turismo
habitação
mercado imobiliário
bolsa japonesa
Nikkei
empresas japonesas
Toyota
Sony
Nintendo
SoftBank
Mitsubishi
Panasonic
economia regional
províncias
perspectivas econômicas
previsões
riscos
vantagens
problemas estruturais
e qualquer outro tema diretamente relacionado à economia do Japão.

==================================================
FONTES E CONFIABILIDADE
==================================================

Priorize nesta ordem quando disponíveis:

1. Governo do Japão
2. Banco do Japão (BoJ)
3. Ministério das Finanças do Japão
4. Cabinet Office do Japão
5. Statistics Bureau of Japan
6. FMI
7. OCDE
8. Banco Mundial
9. BIS
10. fontes econômicas e financeiras reconhecidas
11. imprensa econômica confiável

Use os dados fornecidos pelo contexto de pesquisa.

Quando houver conflito entre fontes:

• não escolha silenciosamente um número;
• explique que existem diferenças;
• informe qual fonte está sendo priorizada;
• informe o período/data de cada estimativa quando possível.

==================================================
DADOS HISTÓRICOS X PROJEÇÕES
==================================================

É FUNDAMENTAL diferenciar:

DADO OFICIAL:
Número já divulgado por uma instituição oficial.

ESTIMATIVA:
Número calculado ou estimado por uma instituição.

PROJEÇÃO:
Previsão para um período futuro.

CONVERSÃO:
Número obtido matematicamente a partir de outro valor.

EXEMPLO:

Se o FMI projetar:

PIB = US$ 4,38 trilhões

e você converter para ienes usando uma taxa cambial:

US$ 4,38 trilhões × 160 JPY/USD

o resultado em ienes é uma CONVERSÃO.

Não diga:

"o FMI prevê ¥700 trilhões"

a menos que o FMI realmente tenha publicado esse valor em ienes.

Diga:

"O FMI projeta US$ 4,38 trilhões. Pela conversão usando 160 JPY/USD, isso corresponde a aproximadamente ¥701 trilhões."

==================================================
PERGUNTAS SOBRE 2026
==================================================

O ano de 2026 ainda está em andamento.

Portanto:

• dados já publicados devem ser apresentados como oficiais;
• valores do ano completo devem ser identificados como projeções/estimativas;
• não trate uma projeção anual como resultado final;
• se houver uma projeção oficial, mostre-a;
• não se recuse a responder apenas porque o ano ainda não terminou.

==================================================
PIB
==================================================

Para perguntas sobre PIB, procure diferenciar:

• PIB nominal;
• PIB real;
• PIB em dólares;
• PIB em ienes;
• PIB per capita;
• crescimento anual;
• crescimento trimestral;
• valor corrente;
• valor em paridade de poder de compra.

Se o usuário pedir:

"Qual é o PIB nominal do Japão em 2026?"

responda preferencialmente neste formato:

🇯🇵 PIB nominal do Japão — 2026

💰 Em dólares:
US$ X trilhões

💴 Em ienes:
¥ X trilhões

📅 Período:
2026

📌 Status:
Projeção / estimativa / oficial

🏦 Fonte:
Instituição + publicação

Depois explique a metodologia utilizada.

Se o valor em ienes for conversão, deixe isso explícito.

==================================================
CAMBIO
==================================================

Nunca confunda:

• taxa atual;
• taxa média anual;
• taxa no fim do período;
• taxa utilizada para conversão.

Sempre informe qual delas está sendo utilizada.

Exemplo:

"Usando USD/JPY de 160,00, a conversão de US$ 4,38 trilhões resulta em aproximadamente ¥700,8 trilhões."

==================================================
PERGUNTAS AMPAS
==================================================

Quando o usuário perguntar:

"Como está a economia do Japão?"

não responda apenas com um parágrafo genérico.

Monte um panorama com:

🇯🇵 PANORAMA DA ECONOMIA DO JAPÃO

• PIB
• crescimento
• inflação
• juros
• câmbio
• desemprego
• salários
• consumo
• investimento
• exportações
• importações
• dívida pública
• conta corrente
• indústria
• demografia
• principais forças
• principais problemas
• perspectivas

Use números atuais ou as projeções mais recentes disponíveis.

==================================================
NÚMEROS
==================================================

Sempre preserve a unidade original.

Exemplos:

US$ 4,38 trilhões
¥ 681,1 trilhões
2,2%
3,1%
122,66 milhões
¥ 1,2 trilhão
US$ 166,4 bilhões

Não transforme automaticamente tudo em porcentagens.

Se o usuário pedir "quanto", dê o valor.

Se pedir "qual a taxa", dê a taxa.

Se pedir "quanto cresceu", dê a variação e, quando possível, os valores antes e depois.

==================================================
FONTES
==================================================

Ao final de respostas que utilizem dados externos, inclua:

📚 Fonte:
Instituição / publicação

Quando houver mais de uma fonte relevante:

📚 Fontes:
• FMI
• Banco do Japão
• Governo do Japão
• OCDE
etc.

Não invente links.

==================================================
ATUALIDADE
==================================================

Use os dados mais recentes disponíveis no contexto.

Não substitua automaticamente um dado recente por um antigo apenas porque o antigo é mais conhecido.

Quando houver diferentes versões de uma projeção, informe:

"Uma projeção anterior indicava X, enquanto a atualização mais recente indica Y."

==================================================
PRECISÃO
==================================================

Nunca invente:

• valores;
• datas;
• taxas;
• nomes de relatórios;
• previsões;
• fontes;
• declarações de autoridades.

Se não houver dado confiável para responder exatamente:

1. diga o que foi encontrado;
2. explique a limitação;
3. forneça o dado mais próximo disponível;
4. deixe claro o que é estimativa ou conversão.

Mas NÃO abandone a pergunta sem antes utilizar os dados disponíveis.

==================================================
ESTILO
==================================================

Responda em português brasileiro.

Seja claro, direto e profissional.

Use títulos e listas quando ajudarem.

Não seja excessivamente acadêmico.

O usuário quer entender a economia japonesa e também quer os números.

Quando houver números importantes, coloque-os em destaque.

==================================================
RESTRIÇÃO
==================================================

Se a pergunta não tiver relação com a economia do Japão, explique brevemente que você é especializado em economia japonesa e peça uma pergunta relacionada ao tema.

Fora isso, responda normalmente.

==================================================
`;
}

function determinarConsultas(pergunta) {
  const q = pergunta.toLowerCase();

  const consultas = [
    `"${pergunta}" Japan economy`,
    `${pergunta} Japan`,
    `${pergunta} Japão economia`
  ];

  if (
    q.includes("pib") ||
    q.includes("gdp") ||
    q.includes("crescimento") ||
    q.includes("economia")
  ) {
    consultas.push(
      "Japan GDP 2026 IMF",
      "Japan nominal GDP 2026 IMF",
      "Japan real GDP growth 2026 IMF",
      "Japan GDP current prices 2026",
      "Japan GDP yen 2026"
    );
  }

  if (
    q.includes("inflação") ||
    q.includes("inflacao") ||
    q.includes("preços") ||
    q.includes("precos")
  ) {
    consultas.push(
      "Japan inflation 2026 IMF",
      "Japan CPI 2026 Bank of Japan",
      "Japan inflation latest 2026"
    );
  }

  if (
    q.includes("juros") ||
    q.includes("taxa") ||
    q.includes("boJ".toLowerCase()) ||
    q.includes("banco do japão") ||
    q.includes("banco do japao")
  ) {
    consultas.push(
      "Bank of Japan policy rate 2026",
      "Japan interest rate latest 2026",
      "BOJ monetary policy 2026"
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
      "USD JPY exchange rate September 2026",
      "Japan yen exchange rate 2026",
      "USDJPY latest 2026"
    );
  }

  if (
    q.includes("dívida") ||
    q.includes("divida") ||
    q.includes("déficit") ||
    q.includes("deficit")
  ) {
    consultas.push(
      "Japan government debt 2026 IMF",
      "Japan fiscal deficit 2026 IMF",
      "Japan public debt yen 2026"
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
      "Japan unemployment 2026 official",
      "Japan wages 2026 official",
      "Japan labor market 2026"
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
      "Japan exports imports 2026 official",
      "Japan trade balance 2026",
      "Japan current account 2026"
    );
  }

  if (
    q.includes("população") ||
    q.includes("populacao") ||
    q.includes("demografia") ||
    q.includes("natalidade") ||
    q.includes("idos")
  ) {
    consultas.push(
      "Japan population 2026 official",
      "Japan demographics 2026",
      "Japan birth rate 2026"
    );
  }

  if (
    q.includes("indústria") ||
    q.includes("industria") ||
    q.includes("produção") ||
    q.includes("producao") ||
    q.includes("industrial")
  ) {
    consultas.push(
      "Japan industrial production 2026",
      "Japan manufacturing 2026",
      "Japan industry latest 2026"
    );
  }

  if (
    q.includes("consumo") ||
    q.includes("investimento") ||
    q.includes("investimentos")
  ) {
    consultas.push(
      "Japan private consumption 2026",
      "Japan investment 2026",
      "Japan household spending 2026"
    );
  }

  return [...new Set(consultas)].slice(0, 16);
}

async function buscarDadosWeb(pergunta) {
  if (!process.env.SERPER_API_KEY) {
    return {
      erro: "SERPER_API_KEY não configurada",
      resultados: []
    };
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
        continue;
      }

      const data = await response.json();

      if (Array.isArray(data.organic)) {
        for (const item of data.organic) {
          resultados.push({
            titulo: item.title || "",
            link: item.link || "",
            snippet: item.snippet || ""
          });
        }
      }
    } catch (erro) {
      console.error("Erro Serper:", erro);
    }
  }

  const unicos = [];
  const vistos = new Set();

  for (const item of resultados) {
    const chave = item.link || item.titulo;

    if (!chave || vistos.has(chave)) {
      continue;
    }

    vistos.add(chave);
    unicos.push(item);
  }

  return {
    consultas,
    resultados: unicos.slice(0, 60)
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
      const urls = [
        `https://www.imf.org/external/datamapper/api/v1/${indicador}/JPN`,
        `https://www.imf.org/external/datamapper/api/v1/${indicador}?periods=2026`
      ];

      let data = null;

      for (const url of urls) {
        try {
          const response = await fetch(url);

          if (!response.ok) {
            continue;
          }

          data = await response.json();

          if (data) {
            break;
          }
        } catch (erro) {
          continue;
        }
      }

      if (data) {
        dados[indicador] = data;
      }
    } catch (erro) {
      console.error(`Erro IMF ${indicador}:`, erro);
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
          if (content && typeof content.text === "string") {
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
      if (step && typeof step.text === "string") {
        partes.push(step.text);
      }

      if (step && Array.isArray(step.content)) {
        for (const content of step.content) {
          if (content && typeof content.text === "string") {
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
    throw new Error("GEMINI_API_KEY não configurada");
  }

  const contextoWeb = JSON.stringify(
    dadosWeb,
    null,
    2
  ).slice(0, 90000);

  const contextoIMF = JSON.stringify(
    dadosIMF,
    null,
    2
  ).slice(0, 90000);

  const historicoSeguro = Array.isArray(historico)
    ? historico.slice(-10)
    : [];

  const input = `
PERGUNTA DO USUÁRIO:
${pergunta}

HISTÓRICO RECENTE:
${JSON.stringify(historicoSeguro, null, 2)}

========================
DADOS DO FMI
========================

${contextoIMF}

========================
RESULTADOS DE PESQUISA
========================

${contextoWeb}

========================
INSTRUÇÕES ESPECÍFICAS PARA ESTA RESPOSTA
========================

Analise os dados acima antes de responder.

1. Responda diretamente à pergunta.
2. Procure primeiro o número ou valor solicitado.
3. Se houver mais de um valor, explique a diferença.
4. Informe unidade e período.
5. Informe se é oficial, estimativa, projeção ou conversão.
6. Informe a fonte.
7. Se a pergunta envolver 2026, diferencie dados já observados de projeções para o ano completo.
8. Se houver um valor em dólares e o usuário perguntar em ienes, procure primeiro um valor oficial em ienes. Se não houver, faça uma conversão claramente identificada como conversão.
9. Não invente números.
10. Não diga que um número não existe simplesmente porque não está no primeiro resultado da pesquisa. Use todos os dados fornecidos.
11. Se houver dados conflitantes, mostre os principais valores e explique qual é mais recente.
12. Para perguntas amplas sobre a economia japonesa, forneça um panorama quantitativo.
`;

  const response = await fetch(
    "https://generativelanguage.googleapis.com/v1/interactions",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": process.env.GEMINI_API_KEY
      },
      body: JSON.stringify({
        model: GEMINI_MODEL,
        input,
        system_instruction: gerarSystemPrompt(),
        store: false
      })
    }
  );

  const textoErro = await response.text();

  if (!response.ok) {
    console.error(
      "Erro Gemini:",
      response.status,
      textoErro
    );

    throw new Error(
      `Gemini HTTP ${response.status}`
    );
  }

  let data;

  try {
    data = JSON.parse(textoErro);
  } catch (erro) {
    throw new Error(
      "Resposta inválida recebida do Gemini"
    );
  }

  const resposta = extrairTextoGemini(data);

  if (!resposta) {
    console.error(
      "Resposta Gemini sem texto:",
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
      agente: "Especialista em Economia do Japão",
      modelo: GEMINI_MODEL,
      fontes: [
        "FMI",
        "Serper",
        "Gemini"
      ],
      data: obterDataAtual()
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
      "Pergunta recebida:",
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
      data: obterDataAtual()
    });

  } catch (erro) {
    console.error(
      "ERRO FINAL:",
      erro
    );

    return res.status(500).json({
      error: "Erro interno do servidor",
      details:
        process.env.NODE_ENV === "development"
          ? erro.message
          : undefined
    });
  }
}
