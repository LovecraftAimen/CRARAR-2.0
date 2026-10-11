# CRARAR

### Centro de Resgate, Acolhimento e Reintegração de Animais de Rua

**Sistema de gestão e acompanhamento animal para uma iniciativa comunitária de Presidente Dutra, Bahia.**

O CRARAR é uma iniciativa dedicada ao acolhimento, à assistência e ao cuidado de animais em situação de rua, bem como daqueles levados pela população em busca de atendimento.

Este repositório apresenta o sistema desenvolvido para apoiar a organização das atividades do projeto, reunindo cadastros, histórico de atendimentos, controle de produtos e indicadores operacionais em uma única aplicação web.

O projeto une desenvolvimento de software, conhecimento veterinário e compromisso comunitário para contribuir com uma gestão mais organizada e um acompanhamento mais consistente dos animais atendidos.

---

## Apresentação

O trabalho de uma iniciativa de proteção animal envolve muito mais do que o atendimento clínico. É necessário organizar informações, acompanhar o histórico dos animais, manter registros dos responsáveis, administrar recursos e compreender a dimensão do trabalho realizado.

O sistema CRARAR foi concebido para apoiar essas necessidades por meio de uma plataforma centralizada, com interface administrativa, indicadores estatísticos e geração de relatórios.

A tecnologia funciona como ferramenta de apoio à equipe, facilitando o acesso às informações e oferecendo uma visão mais clara das atividades desenvolvidas.

**Projeto:** CRARAR — Centro de Resgate, Acolhimento e Reintegração de Animais de Rua
**Localização:** Presidente Dutra, Bahia, Brasil
**Desenvolvimento:** Yan Carvalho
**Parceria veterinária:** Glauber Ben-Hur, médico-veterinário

---

## Demonstração visual

A interface reúne as principais áreas administrativas do sistema em uma experiência unificada. As capturas de tela abaixo devem mostrar a aplicação real, permitindo visualizar sua estrutura e suas funcionalidades.

<!--
Adicione as capturas reais em docs/screenshots/ e remova os comentários:

<p align="center">
  <img src="docs/screenshots/dashboard.png" alt="Dashboard principal do CRARAR" width="100%">
</p>

<p align="center">
  <em>Dashboard principal — visão geral dos registros e indicadores.</em>
</p>

<p align="center">
  <img src="docs/screenshots/animais.png" alt="Gestão de animais" width="49%">
  <img src="docs/screenshots/atendimentos.png" alt="Gestão de atendimentos" width="49%">
</p>

<p align="center">
  <img src="docs/screenshots/estatisticas.png" alt="Estatísticas e indicadores" width="49%">
  <img src="docs/screenshots/relatorio.png" alt="Relatório executivo" width="49%">
</p>
-->

### Áreas da aplicação

| Área         | Finalidade                                           |
| ------------ | ---------------------------------------------------- |
| Dashboard    | Visão geral dos registros e indicadores do projeto.  |
| Animais      | Cadastro e consulta dos animais acompanhados.        |
| Tutores      | Organização dos responsáveis associados aos animais. |
| Atendimentos | Registro e consulta do histórico veterinário.        |
| Produtos     | Gerenciamento dos produtos cadastrados.              |
| Estatísticas | Análise dos dados por período e do histórico total.  |
| Relatórios   | Visualização e exportação de relatórios em PDF.      |

---

## Funcionalidades

### Gestão de animais

Centraliza os registros dos animais acompanhados pelo projeto, permitindo organizar informações cadastrais e consultar os dados disponíveis de cada animal.

* Cadastro e atualização de registros.
* Associação entre animais e tutores.
* Consulta de informações cadastrais.
* Registro de informações relacionadas a adoções e óbitos, conforme os campos implementados.

### Gestão de tutores e responsáveis

Organiza os registros das pessoas responsáveis pelos animais, facilitando a associação entre os cadastros e o acesso às informações necessárias à rotina administrativa.

### Histórico de atendimentos veterinários

Permite registrar e consultar os atendimentos realizados, contribuindo para a organização das informações clínicas disponíveis no sistema.

* Registro de atendimentos.
* Consulta ao histórico por animal.
* Organização de diagnósticos e tratamentos.
* Registro de procedimentos, incluindo castrações e cirurgias.
* Registro de informações relacionadas a óbitos.

### Controle de produtos

Reúne as operações de gerenciamento dos produtos cadastrados, incluindo criação, consulta, atualização e exclusão de registros.

### Indicadores e análise de dados

O módulo estatístico oferece uma visão consolidada das informações armazenadas.

* Contagem de consultas e atendimentos.
* Indicadores de animais e tutores cadastrados.
* Informações sobre adoções e animais vinculados ao CRARAR.
* Indicadores de castrações.
* Filtros por mês, trimestre, semestre, ano e histórico total.
* Gráfico de atendimentos dos últimos sete dias.
* Distribuição dos animais por espécie.

### Relatórios executivos

O sistema disponibiliza uma área de geração de relatórios em formato A4, com pré-visualização e exportação em PDF.

Os relatórios reúnem indicadores de atendimento, procedimentos clínicos e informações sobre a população animal cadastrada, conforme os dados disponíveis.

---

## Arquitetura e tecnologias

A aplicação foi desenvolvida com uma arquitetura baseada em componentes, separando a interface, a lógica de apresentação e as operações de acesso aos dados.

| Tecnologia   | Utilização                                                    |
| ------------ | ------------------------------------------------------------- |
| React        | Construção da interface por componentes reutilizáveis.        |
| TypeScript   | Tipagem estática e organização do código.                     |
| Vite         | Ambiente de desenvolvimento e compilação da aplicação.        |
| Tailwind CSS | Estilização e composição visual da interface.                 |
| Supabase     | Persistência de dados em PostgreSQL e integração com o banco. |
| Lucide React | Biblioteca de ícones da interface.                            |
| html2canvas  | Captura da área visual utilizada na exportação de relatórios. |
| jsPDF        | Geração de documentos PDF.                                    |

### Fluxo simplificado

```text
Interface React
      |
      v
Componentes e lógica TypeScript
      |
      v
Camada de integração com Supabase
      |
      v
Banco de dados PostgreSQL
```

O sistema utiliza o Supabase para armazenar e recuperar os registros, enquanto a aplicação React gerencia a apresentação dos dados e as interações realizadas pelo usuário.

---

## Executando localmente

### Requisitos

* Node.js e npm.
* Git.
* Projeto Supabase configurado.
* Tabelas e permissões compatíveis com a aplicação.

### 1. Clonar o repositório

```bash
git clone https://github.com/FreeSSLY/CRA.git
cd CRA
```

### 2. Instalar as dependências

```bash
npm install
```

### 3. Configurar as variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
VITE_SUPABASE_URL_SITE=sua_url_do_supabase
VITE_SUPABASE_PUBLISHABLE_KEY_MINE=sua_chave_publicavel
```

Preencha os valores com as credenciais publicáveis do projeto Supabase correspondente.

Não compartilhe chaves secretas ou credenciais administrativas. O acesso aos dados deve ser protegido por políticas de autorização e Row Level Security (RLS) adequadas.

### 4. Iniciar o ambiente de desenvolvimento

```bash
npm run dev
```

O endereço local será exibido no terminal pelo Vite.

### 5. Compilar para produção

```bash
npm run build
```

Para visualizar a compilação localmente:

```bash
npm run preview
```

---

## Segurança e integridade dos dados

A aplicação trabalha com informações cadastrais e registros de atendimento. Por isso, a segurança deve fazer parte da configuração e da operação do sistema.

As principais medidas recomendadas incluem:

* Políticas RLS configuradas para as tabelas utilizadas.
* Permissões de leitura e escrita limitadas aos usuários autorizados.
* Proteção das credenciais administrativas.
* Uso de variáveis de ambiente para configurações do projeto.
* Cuidados com a exposição de dados pessoais de tutores e responsáveis.
* Rotinas de backup e recuperação do banco de dados.

A proteção efetiva depende das políticas e permissões configuradas no Supabase e da implementação da aplicação.

---

## Equipe

### Yan Carvalho — Desenvolvimento de software

Responsável pelo desenvolvimento da aplicação, pela implementação das funcionalidades e pela integração das tecnologias que compõem o sistema de gestão do CRARAR.

### Glauber Ben-Hur — Parceria veterinária

Médico-veterinário e parceiro da iniciativa, contribuindo com o conhecimento técnico da área veterinária e com o propósito de cuidado e assistência animal do projeto.

### Tecnologia e cuidado em colaboração

O CRARAR demonstra como o desenvolvimento de software pode apoiar iniciativas locais, aproximando ferramentas digitais das necessidades práticas de uma equipe que trabalha com cuidado animal.

---

## Impacto e propósito

O sistema foi desenvolvido para apoiar uma iniciativa comunitária cuja atuação está ligada à proteção e ao acolhimento de animais em Presidente Dutra, Bahia.

Ao reunir informações em um ambiente centralizado, a aplicação busca facilitar a organização dos registros, o acompanhamento dos atendimentos e a visualização dos dados relacionados às atividades do projeto.

A proposta é contribuir para uma gestão mais estruturada, permitindo que a tecnologia apoie o trabalho humano, veterinário e comunitário realizado em favor dos animais.

---

## Licença

Nenhuma licença de distribuição foi especificada neste documento. Consulte o repositório antes de reutilizar, modificar ou redistribuir o código.

---

<p align="center">
  <strong>CRARAR</strong><br>
  Centro de Resgate, Acolhimento e Reintegração de Animais de Rua<br><br>
  Presidente Dutra — Bahia, Brasil<br><br>
  Desenvolvido por Yan Carvalho<br>
  Em parceria com Glauber Ben-Hur, médico-veterinário
</p>
