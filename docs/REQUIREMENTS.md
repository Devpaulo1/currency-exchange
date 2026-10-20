# Requisitos do Projeto - Currency Exchange App

## 1. Contexto e Objetivo
Aplicação Single Page Application (SPA) desenvolvida em React com Tailwind CSS para consulta de taxas de câmbio, conversão de moedas e análise de histórico utilizando a API Frankfurter. O objetivo é centralizar o fluxo de conversão e análise financeira em uma interface moderna e responsiva.

## 2. Requisitos Funcionais (RF)
* **RF01**: O usuário deve poder selecionar a moeda de origem e a moeda de destino.
* **RF02**: O usuário deve poder inserir um valor numérico para conversão.
* **RF03**: A aplicação deve calcular e exibir o valor convertido com base na cotação mais recente obtida da API.
* **RF04**: A aplicação deve permitir inverter rapidamente as moedas de origem e destino.
* **RF05**: O usuário deve poder selecionar diferentes períodos históricos (7 dias, 15 dias, 30 dias, 3 meses, 6 meses, 1 ano, 5 anos, 10 anos).
* **RF06**: A aplicação deve exibir um gráfico histórico com os dados obtidos.
* **RF07**: A aplicação deve exibir uma tabela contendo data, moeda de origem, moeda de destino e cotação.
* **RF08**: A tabela deve permitir filtros por intervalo de datas e por cotação mínima/máxima, além de ordenação por data e cotação.
* **RF09**: O usuário deve exportar os dados filtrados em formato CSV diretamente no navegador.

## 3. Requisitos Não Funcionais (RNF)
* **RNF01**: Utilizar React com Vite para construção e empacotamento.
* **RNF02**: Estilização baseada em utilitários com Tailwind CSS.
* **RNF03**: Consumo de dados via requisições assíncronas (`fetch` com `async/await`) consumindo a API Frankfurter.
* **RNF04**: Responsividade completa para dispositivos móveis e desktops.

## 4. Critérios de Aceite
* A conversão deve atualizar dinamicamente ao alterar valores ou moedas.
* O gráfico e a tabela devem refletir os dados reais retornados pela API conforme o período selecionado.
* A exportação de CSV não deve permitir arquivos vazios e deve conter apenas os dados filtrados.