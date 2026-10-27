# Currency Exchange App

Aplicação SPA desenvolvida em **React + Vite** para conversão e análise de moedas utilizando a [API Frankfurter](https://api.frankfurter.dev/).

Projeto desenvolvido de forma incremental, aplicando os conteúdos vistos em aula.

## 🔗 Links importantes

- **Repositório GitHub:** [https://github.com/Devpaulo1/currency-exchange](https://github.com/Devpaulo1/currency-exchange)
- **Protótipo Figma:** [https://www.figma.com/design/1lQGsNAGGErvUkbJE6jhFb/Currency-Exchange](https://www.figma.com/design/1lQGsNAGGErvUkbJE6jhFb/Currency-Exchange?node-id=0-1&p=f&t=p2TE1CLP1JS8RRr9-0)
- **Documentação detalhada:** Pasta [`/docs`](./docs)
- **Collection Postman:** [`docs/Currency Exchange App - Frankfurter API.postman_collection.json`](./docs/Currency%20Exchange%20App%20-%20Frankfurter%20API.postman_collection.json)

## 🚀 Funcionalidades

- **Conversor de moedas** - Conversão em tempo real entre diferentes moedas com taxas atualizadas via Frankfurter API
- **Gráfico histórico** - Visualização da variação cambial com períodos de 7d, 15d, 30d, 3m, 6m, 1y, 5y e 10y
- **Tabela de cotações históricas** - Listagem com filtros por data e valor, ordenação por coluna e exportação para CSV
- **Bandeiras dinâmicas** - Exibição das bandeiras das moedas utilizando [FlagCDN](https://flagcdn.com/)
- **Suporte a 3 idiomas** - Português, Inglês e Espanhol (PT/EN/ES)
- **Design Cyber Fintech Glassmorphism** - Interface dark mode com efeito glassmorphism, grid neon e detalhes em emerald/cyan
- **Responsivo** - Adaptado para desktop e mobile

## 🛠️ Tecnologias utilizadas

- [React 19](https://react.dev/) - Biblioteca para construção da interface
- [Vite](https://vitejs.dev/) - Build tool e dev server
- [Tailwind CSS v4](https://tailwindcss.com/) - Estilização
- [Recharts](https://recharts.org/) - Gráficos interativos
- [Lucide React](https://lucide.dev/) - Ícones
- [Frankfurter API](https://api.frankfurter.dev/) - API pública para taxas de câmbio

## 📁 Estrutura do projeto

```text
src/
├── components/      # Componentes reutilizáveis (CurrencyConverter, HistoricalChart, HistoricalTable)
├── context/         # Context API (LanguageContext)
├── hooks/           # Custom Hooks (useCurrency)
├── services/        # Camada de consumo da API (currencyService)
├── utils/           # Funções utilitárias (currencyFlags, csvExporter)
├── App.jsx          # Componente principal
├── index.css        # Estilos globais e Tailwind
└── main.jsx         # Ponto de entrada da aplicação
```

## 📚 Documentação

Na pasta [`docs/`](./docs) você encontra:

| Arquivo | Descrição |
| --- | --- |
| [`REQUIREMENTS.md`](./docs/REQUIREMENTS.md) | Requisitos funcionais e não-funcionais |
| [`COMPONENTS.md`](./docs/COMPONENTS.md) | Documentação dos componentes |
| [`FIGMA.md`](./docs/FIGMA.md) | Guia de estilo, tokens e link do protótipo |
| [`API_TESTS.md`](./docs/API_TESTS.md) | Testes e validações da API Frankfurter |
| [`FUNCTION_TESTS.md`](./docs/FUNCTION_TESTS.md) | Testes funcionais da aplicação |
| [`AI_USAGE.md`](./docs/AI_USAGE.md) | Registro de uso de IA no desenvolvimento |
| [`Currency Exchange App - Frankfurter API.postman_collection.json`](./docs/Currency%20Exchange%20App%20-%20Frankfurter%20API.postman_collection.json) | Collection Postman para testes da API |

## ⚙️ Como rodar o projeto localmente

### Pré-requisitos
- [Node.js](https://nodejs.org/) (versão 18+)
- [npm](https://www.npmjs.com/) ou [yarn](https://yarnpkg.com/)

### Instalação

```bash
# Clonar o repositório
git clone https://github.com/Devpaulo1/currency-exchange.git

# Entrar na pasta
cd currency-exchange

# Instalar dependências
npm install

# Rodar em modo desenvolvimento
npm run dev

# Gerar build para produção
npm run build

# Visualizar build local
npm run preview

# Rodar lint
npm run lint
```

A aplicação ficará disponível em `http://localhost:5173/`

## 🧩 Conteúdos aplicados

- React e JSX
- Componentização
- Props
- Eventos
- useState
- Lifting State Up
- useEffect
- Custom Hooks
- Consumo de API com `fetch` e `async/await`
- Manipulação de arrays e objetos
- Gráficos com Recharts
- Filtros e ordenação
- Exportação CSV
- Git e GitHub
- Internacionalização (PT/EN/ES)

## 📅 Data de entrega
**27/10/2026**

## 👨‍💻 Autor
[Devpaulo1](https://github.com/Devpaulo1)
