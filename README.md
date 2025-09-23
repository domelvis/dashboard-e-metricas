Bem-vindo ao repositório Dashboard Metrics 🎉
Este projeto é uma plataforma de gerenciamento de métricas, desenvolvida com uma arquitetura de microsserviços usando Node.js para a API, Python para o motor de análise, e PostgreSQL como banco de dados.

O objetivo é fornecer uma solução robusta e escalável para monitorar e visualizar dados de forma eficiente.

🎯 Funcionalidades
Autenticação de Usuários: 🔐 Páginas de login e registro para controle de acesso seguro.

Gerenciamento de Perfil: 👤 Os usuários podem visualizar e atualizar suas informações de perfil.

Visualização de Métricas Detalhadas: 📈 Páginas dedicadas para exibir métricas específicas com gráficos e tabelas.

API REST Completa: ⚙️ Endpoints para gerenciamento de usuários e dados de métricas.

Integração com PostgreSQL: 💾 Armazenamento seguro de dados de usuários e métricas.

Arquitetura Escalável: 🚀 Aplicação modular, pronta para expansão.

🛠 Tecnologias
Node.js 🟢: Responsável pela API principal (node-api).

Python 🐍: Usado para o motor de análise e lógica de negócio (python-engine).

PostgreSQL 🐘: Banco de dados relacional para persistência de dados.

Docker Compose 🐳: Orquestração e gerenciamento dos contêineres.

HTML / CSS / JavaScript: 🌐 Para a interface do usuário (Frontend).

Flask: ⚛️ Framework web do Python para a API de backend.

🖼 Estrutura do Projeto
dashboard-metrics/
├── docker-compose.yml       # 🐳 Orquestra os serviços
├── node-api/                # 🟢 Código da API em Node.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   └── userRoutes.js
│   ├── server.js
│   └── package.json
├── python-engine/           # 🐍 Código do motor de análise em Python
│   ├── auth_service.py
│   ├── analysis.py
│   └── requirements.txt
├── frontend/                # 🌐 Código do Frontend
│   ├── auth/
│   │   ├── login.html
│   │   ├── register.html
│   │   └── forgot_password.html
│   ├── metrics/
│   │   └── detailed_metrics.html
│   └── user/
│       └── profile.html
└── .gitignore               # 🚫
⚡ Como Rodar o Projeto
Clone o repositório:

Bash

git clone https://www.youtube.com/shorts/apr341idq8U
Acesse o diretório do projeto:

Bash

cd dashboard-metrics
Inicie os contêineres com Docker Compose:
Este comando irá construir as imagens e iniciar todos os serviços (Node.js, Python e PostgreSQL).

Bash

docker-compose up --build
Acesse a aplicação no navegador:
A aplicação estará disponível em http://localhost:3000.

🤝 Contribuição
Contribuições são bem-vindas! Se você encontrou um bug ou tem uma ideia para uma nova funcionalidade, sinta-se à vontade para:

Fazer um fork do projeto 🍴.

Criar uma nova branch (git checkout -b feature/nova-funcionalidade).

Fazer o commit das suas mudanças (git commit -m 'Adiciona funcionalidade X').

Fazer o push para a branch (git push origin feature/nova-funcionalidade).

Abrir um Pull Request ✨.

💌 Contato
Juiz Elvis

E-mail: 📧 domelvis@gmail.com

GitHub: 🔗https://github.com/domelvis

LinkedIn: 🔗https://www.linkedin.com/in/elvis-marcelo-pereira-de-souza

Feito com ❤️ por Dom Elvis.