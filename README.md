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
http://localhost:3000/api
```

5️⃣ Observações finais

Certifique-se de que o PostgreSQL está rodando no host definido no .env.

A porta padrão do backend do projeto é 3000.

Depois de configurar e aplicar as migrações, você já pode iniciar o projeto com:

```bash
npm run start:dev
```

Acessar Online:

https://zeine-backend.onrender.com/

![Diagrama](image.png)
