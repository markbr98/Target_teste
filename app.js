/**
 * Sistema Integrado - Desafios Operacionais
 * 1. Comissões de Vendas
 * 2. Movimentação de Estoque
 * 3. Cálculo de Juros por Atraso
 */

// ============================================================
// DADOS INICIAIS (FONTE: JSONS DO ENUNCIADO)
// ============================================================
const DADOS_VENDAS = {
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

const ESTOQUE_PADRAO = [
  { codigoProduto: 101, descricaoProduto: "Caneta Azul", estoque: 150 },
  { codigoProduto: 102, descricaoProduto: "Caderno Universitário", estoque: 75 },
  { codigoProduto: 103, descricaoProduto: "Borracha Branca", estoque: 200 },
  { codigoProduto: 104, descricaoProduto: "Lápis Preto HB", estoque: 320 },
  { codigoProduto: 105, descricaoProduto: "Marcador de Texto Amarelo", estoque: 90 }
];

// Estado da Aplicação
let produtosEstoque = JSON.parse(JSON.stringify(ESTOQUE_PADRAO));
let historicoMovimentacoes = [];
let proximoIdMovimentacao = 1001;

// ============================================================
// FORMATADORES AUXILIARES
// ============================================================
function formatarMoeda(valor) {
  return Number(valor).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}

function formatarPercentual(taxa) {
  return `${(taxa * 100).toFixed(1).replace('.', ',')}%`;
}

function formatarDataBR(dataISO) {
  if (!dataISO) return '-';
  const partes = dataISO.split('-');
  if (partes.length !== 3) return dataISO;
  return `${partes[2]}/${partes[1]}/${partes[0]}`;
}

// ============================================================
// NAVEGAÇÃO ENTRE ABAS
// ============================================================
function inicializarAbas() {
  const botoesAba = document.querySelectorAll('.tab-btn');
  const paineisAba = document.querySelectorAll('.tab-panel');

  botoesAba.forEach(botao => {
    botao.addEventListener('click', () => {
      const targetId = botao.getAttribute('data-tab');

      botoesAba.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });

      paineisAba.forEach(p => p.classList.remove('active'));

      botao.classList.add('active');
      botao.setAttribute('aria-selected', 'true');
      
      const targetPainel = document.getElementById(targetId);
      if (targetPainel) {
        targetPainel.classList.add('active');
      }
    });
  });
}

// ============================================================
// MÓDULO 1: COMISSÕES DE VENDAS
// ============================================================
function calcularComissaoVenda(valor) {
  if (valor < 100.00) {
    return {
      taxa: 0.0,
      percentualStr: '0%',
      faixaStr: 'Abaixo de R$ 100,00',
      badgeClass: 'badge-neutral',
      comissao: 0.0
    };
  } else if (valor < 500.00) {
    return {
      taxa: 0.01,
      percentualStr: '1%',
      faixaStr: 'R$ 100,00 a R$ 499,99',
      badgeClass: 'badge-info',
      comissao: valor * 0.01
    };
  } else {
    return {
      taxa: 0.05,
      percentualStr: '5%',
      faixaStr: 'A partir de R$ 500,00',
      badgeClass: 'badge-success',
      comissao: valor * 0.05
    };
  }
}

function processarVendas() {
  const resumoVendedores = {};
  let totalVendasGeral = 0;
  let totalComissoesGeral = 0;
  const listaDetalhada = [];

  DADOS_VENDAS.vendas.forEach((venda, idx) => {
    const { vendedor, valor } = venda;
    const calc = calcularComissaoVenda(valor);

    if (!resumoVendedores[vendedor]) {
      resumoVendedores[vendedor] = {
        vendedor,
        totalVendas: 0,
        qtdVendas: 0,
        comissaoTotal: 0
      };
    }

    resumoVendedores[vendedor].totalVendas += valor;
    resumoVendedores[vendedor].qtdVendas += 1;
    resumoVendedores[vendedor].comissaoTotal += calc.comissao;

    totalVendasGeral += valor;
    totalComissoesGeral += calc.comissao;

    listaDetalhada.push({
      indice: idx + 1,
      vendedor,
      valor,
      comissao: calc.comissao,
      taxaStr: calc.percentualStr,
      faixaStr: calc.faixaStr,
      badgeClass: calc.badgeClass
    });
  });

  return {
    resumoVendedores: Object.values(resumoVendedores),
    totalVendasGeral,
    totalComissoesGeral,
    qtdVendasGeral: DADOS_VENDAS.vendas.length,
    listaDetalhada
  };
}

function renderizarModuloComissoes() {
  const dados = processarVendas();

  // 1. Atualizar Métricas Principais
  document.getElementById('metric-total-vendas').textContent = formatarMoeda(dados.totalVendasGeral);
  document.getElementById('metric-qtd-vendas').textContent = `${dados.qtdVendasGeral} vendas realizadas`;
  document.getElementById('metric-total-comissoes').textContent = formatarMoeda(dados.totalComissoesGeral);
  
  const percComissaoTotal = (dados.totalComissoesGeral / dados.totalVendasGeral) * 100;
  document.getElementById('metric-comissao-percentual').textContent = `${percComissaoTotal.toFixed(2)}% do faturamento total`;

  const ticketMedioGeral = dados.totalVendasGeral / dados.qtdVendasGeral;
  document.getElementById('metric-ticket-medio').textContent = formatarMoeda(ticketMedioGeral);

  // Encontrar vendedor com maior comissão
  const topVendedor = [...dados.resumoVendedores].sort((a, b) => b.comissaoTotal - a.comissaoTotal)[0];
  if (topVendedor) {
    document.getElementById('metric-top-vendedor').textContent = topVendedor.vendedor;
    document.getElementById('metric-top-valor').textContent = `${formatarMoeda(topVendedor.comissaoTotal)} acumulados`;
  }

  // 2. Renderizar Tabela de Resumo Consolidado
  const tbodyResumo = document.getElementById('tbody-comissoes-resumo');
  tbodyResumo.innerHTML = '';

  dados.resumoVendedores.forEach(item => {
    const ticketMedio = item.totalVendas / item.qtdVendas;
    const percEfetivo = (item.comissaoTotal / item.totalVendas) * 100;

    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><strong>${item.vendedor}</strong></td>
      <td class="num-col">${formatarMoeda(item.totalVendas)}</td>
      <td class="num-col">${item.qtdVendas}</td>
      <td class="num-col">${formatarMoeda(ticketMedio)}</td>
      <td class="num-col"><span class="badge badge-info">${percEfetivo.toFixed(2)}%</span></td>
      <td class="num-col text-emerald font-bold">${formatarMoeda(item.comissaoTotal)}</td>
    `;
    tbodyResumo.appendChild(tr);
  });

  // Linha de Totais Gerais
  const trTotal = document.createElement('tr');
  trTotal.style.background = 'rgba(255, 255, 255, 0.05)';
  trTotal.style.fontWeight = '700';
  trTotal.innerHTML = `
    <td><strong>TOTAL GERAL</strong></td>
    <td class="num-col font-bold">${formatarMoeda(dados.totalVendasGeral)}</td>
    <td class="num-col font-bold">${dados.qtdVendasGeral}</td>
    <td class="num-col font-bold">${formatarMoeda(ticketMedioGeral)}</td>
    <td class="num-col font-bold"><span class="badge badge-purple">${percComissaoTotal.toFixed(2)}%</span></td>
    <td class="num-col text-emerald font-bold">${formatarMoeda(dados.totalComissoesGeral)}</td>
  `;
  tbodyResumo.appendChild(trTotal);

  // 3. Popular Dropdown de Filtro de Vendedores
  const selectFiltro = document.getElementById('filtro-vendedor');
  selectFiltro.innerHTML = '<option value="todos">Todos os Vendedores (Todas as Vendas)</option>';
  dados.resumoVendedores.forEach(item => {
    const opt = document.createElement('option');
    opt.value = item.vendedor;
    opt.textContent = `${item.vendedor} (${item.qtdVendas} vendas)`;
    selectFiltro.appendChild(opt);
  });

  // 4. Renderizar Tabela Detalhada com Filtro
  function atualizarTabelaDetalhada(filtro) {
    const tbodyDetalhado = document.getElementById('tbody-vendas-detalhadas');
    tbodyDetalhado.innerHTML = '';

    const filtradas = filtro === 'todos'
      ? dados.listaDetalhada
      : dados.listaDetalhada.filter(v => v.vendedor === filtro);

    filtradas.forEach(venda => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td class="text-muted">#${venda.indice}</td>
        <td><strong>${venda.vendedor}</strong></td>
        <td class="num-col">${formatarMoeda(venda.valor)}</td>
        <td><span class="text-muted">${venda.faixaStr}</span></td>
        <td><span class="badge ${venda.badgeClass}">${venda.taxaStr}</span></td>
        <td class="num-col ${venda.comissao > 0 ? 'text-emerald font-bold' : 'text-muted'}">
          ${formatarMoeda(venda.comissao)}
        </td>
      `;
      tbodyDetalhado.appendChild(tr);
    });
  }

  selectFiltro.onchange = (e) => atualizarTabelaDetalhada(e.target.value);
  atualizarTabelaDetalhada('todos');

  // 5. Visualizador de JSON
  const btnToggleJson = document.getElementById('btn-toggle-json-vendas');
  const jsonContainer = document.getElementById('json-vendas-container');
  const btnCloseJson = document.getElementById('btn-close-json-vendas');
  const codeBlock = document.getElementById('json-vendas-code');

  codeBlock.textContent = JSON.stringify(DADOS_VENDAS, null, 2);

  btnToggleJson.onclick = () => {
    jsonContainer.classList.toggle('hidden');
  };
  btnCloseJson.onclick = () => {
    jsonContainer.classList.add('hidden');
  };
}

// ============================================================
// MÓDULO 2: MOVIMENTAÇÃO DE ESTOQUE
// ============================================================
function renderizarTabelaEstoque() {
  const tbody = document.getElementById('tbody-estoque-atual');
  tbody.innerHTML = '';

  const maxEstoqueRef = 350; // Para a barra percentual visual

  produtosEstoque.forEach(p => {
    const perc = Math.min(100, Math.round((p.estoque / maxEstoqueRef) * 100));
    let colorClass = 'var(--primary)';
    if (p.estoque <= 50) colorClass = 'var(--rose)';
    else if (p.estoque <= 100) colorClass = 'var(--amber)';
    else colorClass = 'var(--emerald)';

    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><span class="badge badge-neutral">#${p.codigoProduto}</span></td>
      <td><strong>${p.descricaoProduto}</strong></td>
      <td class="num-col font-bold" style="font-size: 1.05rem;">${p.estoque} un.</td>
      <td style="width: 140px;">
        <div class="stock-bar-wrapper">
          <div class="stock-bar-bg">
            <div class="stock-bar-fill" style="width: ${perc}%; background: ${colorClass};"></div>
          </div>
          <span style="font-size: 0.75rem; color: var(--text-muted);">${p.estoque}</span>
        </div>
      </td>
    `;
    tbody.appendChild(tr);
  });

  // Atualizar Select de Produtos no Formulário
  const selectProduto = document.getElementById('mov-produto');
  const valorAtual = selectProduto.value;
  selectProduto.innerHTML = '<option value="">Selecione um produto...</option>';
  
  produtosEstoque.forEach(p => {
    const opt = document.createElement('option');
    opt.value = p.codigoProduto;
    opt.textContent = `[${p.codigoProduto}] ${p.descricaoProduto} (Estoque: ${p.estoque})`;
    selectProduto.appendChild(opt);
  });

  if (valorAtual) {
    selectProduto.value = valorAtual;
  }
}

function renderizarHistoricoMovimentacoes() {
  const tbody = document.getElementById('tbody-historico-movimentacoes');
  const badgeTotal = document.getElementById('badge-total-movimentacoes');
  badgeTotal.textContent = `${historicoMovimentacoes.length} lançamento(s)`;

  if (historicoMovimentacoes.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="8" class="text-center text-muted py-4">Nenhuma movimentação lançada ainda nesta sessão.</td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = '';
  historicoMovimentacoes.forEach(mov => {
    const isEntrada = mov.tipo === 'Entrada';
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><strong>#${mov.id}</strong></td>
      <td class="text-muted" style="font-size: 0.775rem;">${mov.horaFormatada}</td>
      <td>${mov.descricaoProduto} <small class="text-muted">(${mov.codigoProduto})</small></td>
      <td>
        <span class="badge ${isEntrada ? 'badge-success' : 'badge-danger'}">
          ${isEntrada ? '▲ Entrada' : '▼ Saída'}
        </span>
      </td>
      <td class="num-col font-bold ${isEntrada ? 'text-emerald' : 'text-danger'}">
        ${isEntrada ? '+' : '-'}${mov.quantidade}
      </td>
      <td>${mov.descricao}</td>
      <td class="num-col text-muted">${mov.estoqueAnterior}</td>
      <td class="num-col font-bold text-accent">${mov.estoqueFinal}</td>
    `;
    tbody.appendChild(tr);
  });
}

function inicializarModuloEstoque() {
  const form = document.getElementById('form-movimentacao');
  const inputId = document.getElementById('mov-id');
  const btnGerarId = document.getElementById('btn-gerar-id');
  const selectProduto = document.getElementById('mov-produto');
  const hintEstoque = document.getElementById('hint-estoque-atual');
  const btnReset = document.getElementById('btn-reset-estoque');
  const alertBox = document.getElementById('estoque-alerta');
  const alertIcon = document.getElementById('estoque-alerta-icon');
  const alertTitulo = document.getElementById('estoque-alerta-titulo');
  const alertMensagem = document.getElementById('estoque-alerta-mensagem');
  const btnCloseAlerta = document.getElementById('btn-close-alerta-estoque');

  inputId.value = proximoIdMovimentacao;

  btnGerarId.addEventListener('click', () => {
    proximoIdMovimentacao += 1;
    inputId.value = proximoIdMovimentacao;
  });

  selectProduto.addEventListener('change', () => {
    const cod = Number(selectProduto.value);
    const prod = produtosEstoque.find(p => p.codigoProduto === cod);
    if (prod) {
      hintEstoque.textContent = `Estoque disponível para ${prod.descricaoProduto}: ${prod.estoque} un.`;
    } else {
      hintEstoque.textContent = 'Estoque disponível: -';
    }
  });

  btnCloseAlerta.addEventListener('click', () => {
    alertBox.classList.add('hidden');
  });

  btnReset.addEventListener('click', () => {
    if (confirm('Deseja realmente restaurar os dados originais do estoque?')) {
      produtosEstoque = JSON.parse(JSON.stringify(ESTOQUE_PADRAO));
      historicoMovimentacoes = [];
      proximoIdMovimentacao = 1001;
      inputId.value = proximoIdMovimentacao;
      renderizarTabelaEstoque();
      renderizarHistoricoMovimentacoes();
      alertBox.classList.add('hidden');
    }
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const id = Number(inputId.value.trim());
    const codigoProduto = Number(selectProduto.value);
    const tipo = document.querySelector('input[name="mov-tipo"]:checked').value;
    const quantidade = parseInt(document.getElementById('mov-quantidade').value, 10);
    const descricao = document.getElementById('mov-descricao').value.trim();

    // Validações
    if (!id || id <= 0) {
      exibirAlertaEstoque(false, 'Identificador Inválido', 'O número identificador deve ser maior que zero.');
      return;
    }

    if (historicoMovimentacoes.some(m => m.id === id)) {
      exibirAlertaEstoque(false, 'ID Duplicado', `O identificador #${id} já foi utilizado em outra movimentação. Utilize um ID único.`);
      return;
    }

    const produto = produtosEstoque.find(p => p.codigoProduto === codigoProduto);
    if (!produto) {
      exibirAlertaEstoque(false, 'Produto Não Selecionado', 'Por favor, selecione um produto válido da lista.');
      return;
    }

    if (isNaN(quantidade) || quantidade <= 0) {
      exibirAlertaEstoque(false, 'Quantidade Inválida', 'A quantidade deve ser um número inteiro positivo maior que zero.');
      return;
    }

    if (!descricao) {
      exibirAlertaEstoque(false, 'Descrição Obrigatória', 'Informe a descrição do tipo da movimentação.');
      return;
    }

    const estoqueAnterior = produto.estoque;
    let estoqueFinal = estoqueAnterior;

    if (tipo === 'entrada') {
      estoqueFinal += quantidade;
    } else {
      // Saída
      if (estoqueAnterior < quantidade) {
        exibirAlertaEstoque(
          false,
          'Saldo Insuficiente no Depósito',
          `Não é possível dar saída de ${quantidade} unidades. O estoque atual de "${produto.descricaoProduto}" é de apenas ${estoqueAnterior} unidades.`
        );
        return;
      }
      estoqueFinal -= quantidade;
    }

    // Atualiza estoque
    produto.estoque = estoqueFinal;

    const dataAgora = new Date();
    const horaFormatada = dataAgora.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

    // Registra no histórico
    const registro = {
      id,
      codigoProduto,
      descricaoProduto: produto.descricaoProduto,
      tipo: tipo === 'entrada' ? 'Entrada' : 'Saída',
      quantidade,
      descricao,
      estoqueAnterior,
      estoqueFinal,
      horaFormatada
    };

    historicoMovimentacoes.unshift(registro);

    // Feedback visual do resultado
    const tipoNome = tipo === 'entrada' ? 'Entrada' : 'Saída';
    const msgSucesso = `Movimentação #${id} (${tipoNome}: ${quantidade} un.) realizada para "${produto.descricaoProduto}". Estoque anterior: ${estoqueAnterior} un. ➔ Estoque final: ${estoqueFinal} un.`;
    exibirAlertaEstoque(true, 'Movimentação Concluída com Sucesso!', msgSucesso);

    // Atualiza UI
    renderizarTabelaEstoque();
    renderizarHistoricoMovimentacoes();

    // Incrementa próximo ID e limpa campos variáveis
    proximoIdMovimentacao = id + 1;
    inputId.value = proximoIdMovimentacao;
    document.getElementById('mov-quantidade').value = '';
    document.getElementById('mov-descricao').value = '';
  });

  function exibirAlertaEstoque(sucesso, titulo, mensagem) {
    alertBox.className = `alert-banner ${sucesso ? '' : 'error'}`;
    alertIcon.textContent = sucesso ? '✅' : '⚠️';
    alertTitulo.textContent = titulo;
    alertMensagem.textContent = mensagem;
    alertBox.classList.remove('hidden');
    alertBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  renderizarTabelaEstoque();
  renderizarHistoricoMovimentacoes();
}

// ============================================================
// MÓDULO 3: CÁLCULO DE JUROS POR ATRASO (2,5% AO DIA)
// ============================================================
function calcularJurosParametros({ valor, dataVencimentoStr, dataHojeStr }) {
  if (isNaN(valor) || valor <= 0) {
    return null;
  }

  const [anoV, mesV, diaV] = dataVencimentoStr.split('-').map(Number);
  const dataVenc = new Date(anoV, mesV - 1, diaV, 0, 0, 0, 0);

  const [anoH, mesH, diaH] = dataHojeStr.split('-').map(Number);
  const dataHoje = new Date(anoH, mesH - 1, diaH, 0, 0, 0, 0);

  const diffMs = dataHoje.getTime() - dataVenc.getTime();
  const diffDias = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const diasAtraso = Math.max(0, diffDias);

  const taxaDiaria = 0.025; // 2,5% ao dia
  const valorJuros = valor * taxaDiaria * diasAtraso;
  const valorTotal = valor + valorJuros;

  return {
    valorOriginal: valor,
    dataVencimentoStr,
    dataHojeStr,
    diasAtraso,
    taxaDiaria,
    taxaPercentualStr: '2,5%',
    valorJuros,
    valorTotal
  };
}

function inicializarModuloJuros() {
  const formJuros = document.getElementById('form-juros');
  const inputValor = document.getElementById('juros-valor');
  const inputVencimento = document.getElementById('juros-vencimento');
  const inputHoje = document.getElementById('juros-data-hoje');
  const btnHoje = document.getElementById('btn-hoje');
  const chipsCenarios = document.querySelectorAll('.chip-btn');

  // Elementos de Resultado
  const badgeStatus = document.getElementById('badge-status-atraso');
  const resTotal = document.getElementById('res-total-atualizado');
  const resFormulaResumo = document.getElementById('res-formula-resumo');
  const resValorOriginal = document.getElementById('res-valor-original');
  const resDataVencimento = document.getElementById('res-data-vencimento');
  const resDataHoje = document.getElementById('res-data-hoje');
  const resDiasAtraso = document.getElementById('res-dias-atraso');
  const resValorJuros = document.getElementById('res-valor-juros');
  const resFormulaDetalhada = document.getElementById('res-formula-detalhada');

  // Inicializar com a data de hoje do sistema
  const dataAtual = new Date();
  const strHoje = dataAtual.toISOString().slice(0, 10);
  inputHoje.value = strHoje;

  // Por padrão, colocar o vencimento há 5 dias para demonstrar o cálculo imediatamente
  const dataPadraoVenc = new Date(dataAtual);
  dataPadraoVenc.setDate(dataPadraoVenc.getDate() - 5);
  inputVencimento.value = dataPadraoVenc.toISOString().slice(0, 10);

  function atualizarCalculo() {
    const valor = parseFloat(inputValor.value);
    const dataVencStr = inputVencimento.value;
    const dataHojeStr = inputHoje.value;

    if (!valor || !dataVencStr || !dataHojeStr) {
      return;
    }

    const res = calcularJurosParametros({
      valor,
      dataVencimentoStr: dataVencStr,
      dataHojeStr: dataHojeStr
    });

    if (!res) return;

    resValorOriginal.textContent = formatarMoeda(res.valorOriginal);
    resDataVencimento.textContent = formatarDataBR(res.dataVencimentoStr);
    resDataHoje.textContent = formatarDataBR(res.dataHojeStr);
    resTotal.textContent = formatarMoeda(res.valorTotal);

    if (res.diasAtraso === 0) {
      badgeStatus.className = 'badge badge-success';
      badgeStatus.textContent = 'Em Dia (Sem Juros)';
      resDiasAtraso.textContent = '0 dias (No prazo ou antecipado)';
      resValorJuros.className = 'breakdown-value text-emerald font-bold';
      resValorJuros.textContent = 'R$ 0,00';
      resFormulaResumo.textContent = 'Sem aplicação de multa/juros por atraso';
      resFormulaDetalhada.textContent = `${formatarMoeda(res.valorOriginal)} × 2,5% × 0 dias = R$ 0,00`;
    } else {
      badgeStatus.className = 'badge badge-danger';
      badgeStatus.textContent = `${res.diasAtraso} ${res.diasAtraso === 1 ? 'Dia' : 'Dias'} de Atraso`;
      resDiasAtraso.textContent = `${res.diasAtraso} ${res.diasAtraso === 1 ? 'dia corrido' : 'dias corridos'}`;
      resValorJuros.className = 'breakdown-value text-danger font-bold';
      resValorJuros.textContent = `+ ${formatarMoeda(res.valorJuros)}`;
      resFormulaResumo.textContent = `${formatarMoeda(res.valorOriginal)} + ${formatarMoeda(res.valorJuros)} de juros`;
      
      const percTotalAcumulado = (res.diasAtraso * 2.5).toFixed(1).replace('.', ',');
      resFormulaDetalhada.textContent = `${formatarMoeda(res.valorOriginal)} × 2,5% × ${res.diasAtraso} dias (${percTotalAcumulado}%) = ${formatarMoeda(res.valorJuros)}`;
    }
  }

  btnHoje.addEventListener('click', () => {
    const hojeReal = new Date().toISOString().slice(0, 10);
    inputHoje.value = hojeReal;
    atualizarCalculo();
  });

  chipsCenarios.forEach(chip => {
    chip.addEventListener('click', () => {
      chipsCenarios.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');

      const dias = parseInt(chip.getAttribute('data-days'), 10);
      const refHoje = new Date(inputHoje.value + 'T00:00:00');
      refHoje.setDate(refHoje.getDate() - dias);
      inputVencimento.value = refHoje.toISOString().slice(0, 10);
      atualizarCalculo();
    });
  });

  formJuros.addEventListener('submit', (e) => {
    e.preventDefault();
    atualizarCalculo();
  });

  inputValor.addEventListener('input', atualizarCalculo);
  inputVencimento.addEventListener('input', () => {
    chipsCenarios.forEach(c => c.classList.remove('active'));
    atualizarCalculo();
  });
  inputHoje.addEventListener('input', () => {
    chipsCenarios.forEach(c => c.classList.remove('active'));
    atualizarCalculo();
  });

  // Executa o primeiro cálculo
  atualizarCalculo();
}

// ============================================================
// GERENCIADOR DE TEMAS (CLARO E ESCURO)
// ============================================================
function aplicarTema(tema) {
  const root = document.documentElement;
  const icon = document.getElementById('theme-icon');
  const label = document.getElementById('theme-label');

  if (tema === 'dark') {
    root.setAttribute('data-theme', 'dark');
    if (icon) icon.textContent = '☀️';
    if (label) label.textContent = 'Tema Claro';
  } else {
    root.removeAttribute('data-theme');
    if (icon) icon.textContent = '🌙';
    if (label) label.textContent = 'Tema Escuro';
  }
  localStorage.setItem('app-theme', tema);
}

function inicializarTema() {
  // Padrão: Tema Claro conforme solicitado
  const temaSalvo = localStorage.getItem('app-theme') || 'light';
  aplicarTema(temaSalvo);

  const btnToggle = document.getElementById('btn-theme-toggle');
  if (btnToggle) {
    btnToggle.addEventListener('click', () => {
      const temaAtual = document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
      const novoTema = temaAtual === 'dark' ? 'light' : 'dark';
      aplicarTema(novoTema);
    });
  }
}

// ============================================================
// INICIALIZAÇÃO GERAL DO SISTEMA
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
  inicializarTema();
  inicializarAbas();
  renderizarModuloComissoes();
  inicializarModuloEstoque();
  inicializarModuloJuros();
  console.log('Sistema Operacional Integrado - Desenvolvido por Marcos Feitosa');
});
