# Sistema Integrado - Solução dos 3 Desafios Operacionais

**Desenvolvido por:** Marcos Feitosa  
**E-mail:** [marcosfanjo@gmail.com](mailto:marcosfanjo@gmail.com)  
**WhatsApp:** [(87) 9 9932-3312](https://wa.me/5587999323312)

Sistema desenvolvido em ambiente Node.js com interface web responsiva e modular, executando em **localhost:3000**, contemplando a resolução completa dos três desafios propostos em um único ambiente, com suporte nativo a **Tema Claro (padrão)** e **Tema Escuro**.

---

## 🚀 Como Acessar e Rodar

O servidor local está em execução no endereço:
👉 **[http://localhost:3000](http://localhost:3000)**

Para reiniciar ou executar manualmente a qualquer momento:
```bash
# Servidor Web (Dashboard)
node server.js

# Execução em Linha de Comando (Relatório direto no terminal)
node cli.js
```

---

## 📋 Detalhamento das Soluções

### 1. Cálculo de Comissão de Vendas
Processamento de todas as vendas do time comercial com aplicação das regras individuais:
- **Abaixo de R$ 100,00:** 0% de comissão (isento).
- **Abaixo de R$ 500,00 (de R$ 100,00 a R$ 499,99):** 1% de comissão.
- **A partir de R$ 500,00:** 5% de comissão.

#### Resumo dos Resultados Apurados:
| Vendedor | Total em Vendas | Qtd. Vendas | Ticket Médio | % Efetivo Médio | Comissão Total |
| :--- | :---: | :---: | :---: | :---: | :---: |
| **João Silva** | R$ 10.754,70 | 10 | R$ 1.075,47 | 4,61% | **R$ 495,68** |
| **Maria Souza** | R$ 9.874,30 | 9 | R$ 1.097,14 | 4,72% | **R$ 465,95** |
| **Carlos Oliveira** | R$ 7.928,35 | 8 | R$ 991,04 | 4,78% | **R$ 379,37** |
| **Ana Lima** | R$ 8.763,95 | 9 | R$ 973,77 | 4,62% | **R$ 404,98** |
| **TOTAL GERAL** | **R$ 37.321,30** | **36** | **R$ 1.036,70** | **4,68%** | **R$ 1.745,98** |

*Recursos da UI:* Filtro dinâmico por vendedor, tabela analítica auditável por venda e visualizador do JSON bruto.

---

### 2. Controle e Movimentação de Estoque
Gerenciamento de estoque dos 5 produtos iniciais com registro de movimentações de **Entrada** e **Saída**:
- Produtos:
  - `101`: Caneta Azul (150 un.)
  - `102`: Caderno Universitário (75 un.)
  - `103`: Borracha Branca (200 un.)
  - `104`: Lápis Preto HB (320 un.)
  - `105`: Marcador de Texto Amarelo (90 un.)
- **Requisitos Atendidos:**
  - Número identificador único para cada movimentação (com botão de auto-incremento ou digitação manual).
  - Descrição detalhada do tipo e motivo da movimentação (ex: "Entrada por compra NF 123", "Saída para consumo interno").
  - Retorno visual imediato com a quantidade final do estoque atualizado.
  - Validação para impedir saídas que ultrapassem o saldo disponível no depósito (evita estoque negativo).
  - Histórico de auditoria com saldo anterior e saldo final de cada lançamento.

---

### 3. Cálculo de Juros por Atraso (2,5% ao dia)
Calculadora de juros moratórios e liquidação na data atual:
- **Fórmula:**
  $$\text{Dias de Atraso} = \max(0, \text{Data Hoje} - \text{Data Vencimento})$$
  $$\text{Juros / Multa} = \text{Valor Original} \times 0{,}025 \times \text{Dias de Atraso}$$
  $$\text{Valor Total Atualizado} = \text{Valor Original} + \text{Juros}$$
- **Exemplo de Cálculo:**
  - Valor: **R$ 1.000,00**
  - Vencimento há 5 dias:
    - Multa/Juros: $1.000 \times 0{,}025 \times 5 = \mathbf{R\$\;125{,}00}$
    - Total Atualizado: $\mathbf{R\$\;1.125{,}00}$
- *Recursos da UI:* Seletor de data de vencimento, atalho para "Hoje", botões de simulação rápida (0, 5, 10, 15, 30 dias de atraso) e memória de cálculo detalhada.

---

## 📁 Estrutura de Arquivos
- [`index.html`](file:///C:/Users/anjof/.gemini/antigravity-ide/scratch/desafios-comercial-estoque-juros/index.html) - Estrutura da interface com navegação por abas.
- [`styles.css`](file:///C:/Users/anjof/.gemini/antigravity-ide/scratch/desafios-comercial-estoque-juros/styles.css) - Estilização moderna, tema escuro sofisticado e responsivo.
- [`app.js`](file:///C:/Users/anjof/.gemini/antigravity-ide/scratch/desafios-comercial-estoque-juros/app.js) - Lógica de negócio, validações e reatividade dos 3 desafios.
- [`server.js`](file:///C:/Users/anjof/.gemini/antigravity-ide/scratch/desafios-comercial-estoque-juros/server.js) - Servidor HTTP nativo sem dependências externas.
- [`cli.js`](file:///C:/Users/anjof/.gemini/antigravity-ide/scratch/desafios-comercial-estoque-juros/cli.js) - Script de execução em modo terminal/console.
