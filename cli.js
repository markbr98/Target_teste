/**
 * Execução em Linha de Comando (CLI) para os 3 Desafios
 */

// ==========================================
// 1. DESAFIO - CÁLCULO DE COMISSÃO DE VENDAS
// ==========================================
const dadosVendas = {
  "vendas": [
    { "vendedor": "João Silva", "valor": 1200.50 },
    { "vendedor": "João Silva", "valor": 950.75 },
    { "vendedor": "João Silva", "valor": 1800.00 },
    { "vendedor": "João Silva", "valor": 1400.30 },
    { "vendedor": "João Silva", "valor": 1100.90 },
    { "vendedor": "João Silva", "valor": 1550.00 },
    { "vendedor": "João Silva", "valor": 1700.80 },
    { "vendedor": "João Silva", "valor": 250.30 },
    { "vendedor": "João Silva", "valor": 480.75 },
    { "vendedor": "João Silva", "valor": 320.40 },

    { "vendedor": "Maria Souza", "valor": 2100.40 },
    { "vendedor": "Maria Souza", "valor": 1350.60 },
    { "vendedor": "Maria Souza", "valor": 950.20 },
    { "vendedor": "Maria Souza", "valor": 1600.75 },
    { "vendedor": "Maria Souza", "valor": 1750.00 },
    { "vendedor": "Maria Souza", "valor": 1450.90 },
    { "vendedor": "Maria Souza", "valor": 400.50 },
    { "vendedor": "Maria Souza", "valor": 180.20 },
    { "vendedor": "Maria Souza", "valor": 90.75 },

    { "vendedor": "Carlos Oliveira", "valor": 800.50 },
    { "vendedor": "Carlos Oliveira", "valor": 1200.00 },
    { "vendedor": "Carlos Oliveira", "valor": 1950.30 },
    { "vendedor": "Carlos Oliveira", "valor": 1750.80 },
    { "vendedor": "Carlos Oliveira", "valor": 1300.60 },
    { "vendedor": "Carlos Oliveira", "valor": 300.40 },
    { "vendedor": "Carlos Oliveira", "valor": 500.00 },
    { "vendedor": "Carlos Oliveira", "valor": 125.75 },

    { "vendedor": "Ana Lima", "valor": 1000.00 },
    { "vendedor": "Ana Lima", "valor": 1100.50 },
    { "vendedor": "Ana Lima", "valor": 1250.75 },
    { "vendedor": "Ana Lima", "valor": 1400.20 },
    { "vendedor": "Ana Lima", "valor": 1550.90 },
    { "vendedor": "Ana Lima", "valor": 1650.00 },
    { "vendedor": "Ana Lima", "valor": 75.30 },
    { "vendedor": "Ana Lima", "valor": 420.90 },
    { "vendedor": "Ana Lima", "valor": 315.40 }
  ]
};

function calcularComissaoItem(valor) {
  if (valor < 100.00) {
    return { taxa: 0.0, comissao: 0.0 };
  } else if (valor < 500.00) {
    return { taxa: 0.01, comissao: valor * 0.01 };
  } else {
    return { taxa: 0.05, comissao: valor * 0.05 };
  }
}

function calcularComissoes(vendas) {
  const relatorio = {};

  for (const venda of vendas) {
    const { vendedor, valor } = venda;
    if (!relatorio[vendedor]) {
      relatorio[vendedor] = {
        totalVendas: 0,
        qtdVendas: 0,
        comissaoTotal: 0
      };
    }

    const { comissao } = calcularComissaoItem(valor);
    relatorio[vendedor].totalVendas += valor;
    relatorio[vendedor].qtdVendas += 1;
    relatorio[vendedor].comissaoTotal += comissao;
  }

  return relatorio;
}

// ==========================================
// 2. DESAFIO - MOVIMENTAÇÃO DE ESTOQUE
// ==========================================
const estoqueInicial = [
  { codigoProduto: 101, descricaoProduto: "Caneta Azul", estoque: 150 },
  { codigoProduto: 102, descricaoProduto: "Caderno Universitário", estoque: 75 },
  { codigoProduto: 103, descricaoProduto: "Borracha Branca", estoque: 200 },
  { codigoProduto: 104, descricaoProduto: "Lápis Preto HB", estoque: 320 },
  { codigoProduto: 105, descricaoProduto: "Marcador de Texto Amarelo", estoque: 90 }
];

class GerenciadorEstoque {
  constructor(produtosIniciais) {
    this.produtos = new Map(produtosIniciais.map(p => [p.codigoProduto, { ...p }]));
    this.movimentacoes = [];
  }

  lancarMovimentacao({ id, codigoProduto, tipo, quantidade, descricao }) {
    const produto = this.produtos.get(codigoProduto);
    if (!produto) {
      throw new Error(`Produto com código ${codigoProduto} não foi encontrado.`);
    }

    if (quantidade <= 0 || isNaN(quantidade)) {
      throw new Error(`Quantidade inválida: ${quantidade}. Deve ser um número maior que zero.`);
    }

    if (this.movimentacoes.some(m => m.id === id)) {
      throw new Error(`Identificador único de movimentação '${id}' já foi utilizado.`);
    }

    const estoqueAnterior = produto.estoque;
    const tipoNormalizado = tipo.trim().toLowerCase();

    let novoEstoque = estoqueAnterior;
    if (tipoNormalizado === 'entrada') {
      novoEstoque += quantidade;
    } else if (tipoNormalizado === 'saida' || tipoNormalizado === 'saída') {
      if (estoqueAnterior < quantidade) {
        throw new Error(
          `Saldo insuficiente para saída! Produto: ${produto.descricaoProduto} | Estoque atual: ${estoqueAnterior} | Solicitado: ${quantidade}`
        );
      }
      novoEstoque -= quantidade;
    } else {
      throw new Error(`Tipo de movimentação inválido: ${tipo}. Use 'entrada' ou 'saída'.`);
    }

    produto.estoque = novoEstoque;

    const registro = {
      id,
      codigoProduto,
      descricaoProduto: produto.descricaoProduto,
      tipo: tipoNormalizado === 'entrada' ? 'Entrada' : 'Saída',
      quantidade,
      descricao,
      estoqueAnterior,
      estoqueFinal: novoEstoque,
      dataHora: new Date().toISOString()
    };

    this.movimentacoes.push(registro);

    return {
      id,
      codigoProduto,
      descricaoProduto: produto.descricaoProduto,
      tipo: registro.tipo,
      descricao,
      quantidade,
      estoqueAnterior,
      estoqueFinal: novoEstoque
    };
  }

  obterEstoqueAtual() {
    return Array.from(this.produtos.values());
  }
}

// ==========================================
// 3. DESAFIO - CÁLCULO DE JUROS POR ATRASO
// ==========================================
function calcularJurosHoje({ valor, dataVencimento, dataHoje = new Date() }) {
  if (isNaN(valor) || valor <= 0) {
    throw new Error("O valor informado deve ser um número positivo.");
  }

  // Normalizar datas para considerar dias cheios (meia-noite)
  const [anoVenc, mesVenc, diaVenc] = dataVencimento.split('-').map(Number);
  const dataVenc = new Date(anoVenc, mesVenc - 1, diaVenc, 0, 0, 0, 0);

  const hoje = new Date(
    dataHoje.getFullYear(),
    dataHoje.getMonth(),
    dataHoje.getDate(),
    0, 0, 0, 0
  );

  const diffMs = hoje.getTime() - dataVenc.getTime();
  const diffDias = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const diasAtraso = Math.max(0, diffDias);

  const taxaDiaria = 0.025; // 2.5% ao dia
  const valorJuros = valor * taxaDiaria * diasAtraso;
  const valorTotal = valor + valorJuros;

  return {
    valorOriginal: valor,
    dataVencimento: dataVenc.toISOString().slice(0, 10),
    dataHoje: hoje.toISOString().slice(0, 10),
    diasAtraso,
    taxaDiariaPercentual: 2.5,
    valorJuros,
    valorTotal
  };
}

// ==========================================
// EXECUÇÃO DE DEMONSTRAÇÃO
// ==========================================
console.log("==================================================");
console.log("DESAFIO 1: CÁLCULO DE COMISSÃO POR VENDEDOR");
console.log("==================================================");
const relatorioComissao = calcularComissoes(dadosVendas.vendas);
console.table(
  Object.entries(relatorioComissao).map(([vendedor, dados]) => ({
    Vendedor: vendedor,
    "Qtd Vendas": dados.qtdVendas,
    "Total Vendido (R$)": dados.totalVendas.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
    "Comissão Total (R$)": dados.comissaoTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
  }))
);

console.log("\n==================================================");
console.log("DESAFIO 2: MOVIMENTAÇÃO DE ESTOQUE");
console.log("==================================================");
const estoque = new GerenciadorEstoque(estoqueInicial);

console.log("Estoque Inicial:");
console.table(estoque.obterEstoqueAtual());

console.log("\nLançando movimentação 1 (Entrada de 30 canetas):");
const mov1 = estoque.lancarMovimentacao({
  id: 1,
  codigoProduto: 101,
  tipo: "entrada",
  quantidade: 30,
  descricao: "Entrada por pedido de reposição NF-4589"
});
console.log(`-> Resultado: Produto: ${mov1.descricaoProduto} | Estoque anterior: ${mov1.estoqueAnterior} | Estoque final: ${mov1.estoqueFinal}`);

console.log("\nLançando movimentação 2 (Saída de 15 cadernos):");
const mov2 = estoque.lancarMovimentacao({
  id: 2,
  codigoProduto: 102,
  tipo: "saida",
  quantidade: 15,
  descricao: "Saída para kit escolar de colaboradores"
});
console.log(`-> Resultado: Produto: ${mov2.descricaoProduto} | Estoque anterior: ${mov2.estoqueAnterior} | Estoque final: ${mov2.estoqueFinal}`);

console.log("\nEstoque Atualizado após movimentações:");
console.table(estoque.obterEstoqueAtual());

console.log("\n==================================================");
console.log("DESAFIO 3: CÁLCULO DE JUROS (2,5% AO DIA)");
console.log("==================================================");
// Exemplo: Boleto de R$ 1.000,00 vencido há 5 dias
const hoje = new Date();
const dataVencimentoExemplo = new Date(hoje);
dataVencimentoExemplo.setDate(dataVencimentoExemplo.getDate() - 5);
const strVencimento = dataVencimentoExemplo.toISOString().slice(0, 10);

const resultadoJuros = calcularJurosHoje({
  valor: 1000.00,
  dataVencimento: strVencimento
});

console.log(`Valor Original: ${resultadoJuros.valorOriginal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`);
console.log(`Data de Vencimento: ${resultadoJuros.dataVencimento}`);
console.log(`Data de Hoje: ${resultadoJuros.dataHoje}`);
console.log(`Dias de Atraso: ${resultadoJuros.diasAtraso} dias`);
console.log(`Multa/Juros (2,5% ao dia): ${resultadoJuros.valorJuros.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`);
console.log(`Valor Total Atualizado: ${resultadoJuros.valorTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`);
console.log("==================================================");

module.exports = {
  dadosVendas,
  calcularComissaoItem,
  calcularComissoes,
  estoqueInicial,
  GerenciadorEstoque,
  calcularJurosHoje
};
