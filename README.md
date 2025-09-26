# Bondy Desafio Fullstack

## 📋 Sobre o Projeto

Este é um projeto fullstack desenvolvido como desafio técnico, implementando um sistema de autenticação completo com GraphQL, React e MongoDB. O projeto utiliza uma arquitetura de monorepo gerenciada pelo Lerna.

# README - Instruções para Configuração do Projeto

## Pré-requisitos
- Node.js instalado (versão 18.x ou superior)
- Yarn (npm/yarn) instalado
- MongoDB configurado (se aplicável)

## Como Configurar

1. Clone o repositório:
```bash
git clone https://github.com/seu-usuario/bondy-desafio-fullstack.git
```

2. Instale as dependências:
```bash
yarn install
```

4. Inicie o servidor de desenvolvimento:
```bash
yarn run start
```

## Comandos Lerna Específicos
- `npx lerna run start --parallel` - Inicia todos os serviços em paralelo
## Estrutura do Projeto
```
bondy-desafio-fullstack/
├── packages/
│   ├── backend/     # API GraphQL com Serverless
│   └── frontend/    # Aplicação React
├── lerna.json       # Configuração do Lerna
└── package.json     # Scripts do monorepo
```
