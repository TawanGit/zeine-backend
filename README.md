# Como Configurar o Projeto

1️⃣ Instale as dependências

```bash
npm install
```

Rode o seu banco de dados postgres com docker

```bash
docker-compose up -d
```

2️⃣ Configure as variáveis de ambiente

Crie um arquivo .env na raiz do projeto e adicione as seguintes variáveis:

# Configuração do banco de dados

```bash
DATABASE_URL="postgresql://nestuser:nestpassword@localhost:5432/nestdb?schema=public"
SECRET_KEY="your_secret_key_here"
```

# Configuração do Cloudinary

Precisamos que você coloque os dados da sua cloudinary, para armazenar as fotos dos contatos

```bash
CLOUDINARY_API_SECRET=
CLOUDINARY_API_KEY=
CLOUDINARY_CLOUD_NAME=
```

5️⃣ Documentação das Rotas
Para ver o mapeamento das rotas, acesse:

```bash
http://localhost:3001/api
```

5️⃣ Observações finais

Certifique-se de que o PostgreSQL está rodando no host definido no .env.

A porta padrão do backend do projeto é 3001.

Depois de configurar e aplicar as migrações, você já pode iniciar o projeto com:

```bash
npm run start:dev
```

#  Testes

Você pode rodar os testes com: 

```bash
npm run test
```

# Arquitetura
Como é um projeto simples, foi definida uma arquitetura Modular, muito utilizada no NestJS

Temos: Auth, Cloudinary, Database, User, Contacts

Em cada módulo temos services e controllers, onde o controller é responsável por receber a requisição e o service lida com toda a lógica

O modulo database é responsável por se conectar ao banco de dados.
O modulo cloudinary é responsável pelo storage de fotos. 
o modulo contact é responsável por lidar com os contatos.
o modulo user é responsável por lidar os usuários.
o modulo auth é responsável por lidar com a autenticação.


# Acessar Online:

https://zeine-backend.onrender.com/

# Diagrama 
![Diagrama](image.png)
