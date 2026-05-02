# 🎨 Galeria Portugal – Frontend

Plataforma de galeria de arte digital com autenticação, quizzes, visualização de obras em realidade aumentada (Parede Virtual) e loja integrada.

## Tecnologias

- React 18 + TypeScript
- Vite
- TailwindCSS
- React Router v6
- Strapi (backend headless)

## 👥 Colaboração

Este repositório faz parte de um projeto de grupo (3 membros).  
O **backend** está em [galeria-portugal-backend](https://github.com/Vero279/galeria-portugal-backend).

### Regras de trabalho

- **Nunca** trabalhar diretamente na branch `main`.
- Cada membro cria uma **branch** para cada funcionalidade/correção.
- Antes de começar: `git pull origin main`
- Abrir **Pull Request** (PR) para a `main` e pedir revisão dos colegas.
- Resolver conflitos em conjunto.

### Workflow básico

```bash
# Clonar
git clone https://github.com/Vero279/galeria-portugal-frontend.git
cd galeria-portugal-frontend
npm install

# Criar branch
git checkout -b feature/minha-feature

# Commit e push
git add .
git commit -m "descrição clara"
git push origin feature/minha-feature

# Abrir Pull Request no GitHub
⚙️ Configuração local
Instalar dependências

bash
npm install
Variáveis de ambiente – copie .env.example para .env e preencha:

env
VITE_STRAPI_URL=http://localhost:1337
VITE_STRAPI_ADMIN_TOKEN=seu_token_admin_do_strapi
VITE_STRAPI_ADMIN_TOKEN apenas necessário se o frontend for atribuir roles aos utilizadores. Em produção, evite expor este token; use permissões públicas no Strapi.

Iniciar servidor de desenvolvimento

bash
npm run dev
Abra http://localhost:5173.

🚀 Publicação (deploy)
Recomendamos Netlify (gratuito e fácil).

Passos no Netlify
Criar conta em netlify.com

Add new site → Import an existing project → GitHub

Selecionar este repositório

Configurar:

Build command: npm run build

Publish directory: dist

Variáveis de ambiente (Netlify → Site settings → Environment variables):

VITE_STRAPI_URL = URL do backend publicado (ex: https://galeria-backend.up.railway.app)

VITE_STRAPI_ADMIN_TOKEN = (não adicionar em produção; use permissões públicas)

Clicar Deploy site

O Netlify fará deploy automático sempre que houver push na branch main.

🔗 Ligação com o backend Strapi
O frontend espera que o backend esteja acessível em VITE_STRAPI_URL.

Configure CORS no Strapi para aceitar pedidos do domínio do frontend (ver README do backend).

No painel do Strapi (publicado), conceda permissões find e findOne à role Public para os content‑types que devem ser visíveis sem login (City, Artist, Artwork, etc.).

📦 Scripts disponíveis
Comando	Descrição
npm run dev	Servidor de desenvolvimento
npm run build	Compilar para produção
npm run preview	Pré‑visualizar a build
npm run lint	Verificar código com ESLint
npm run typecheck	Verificar tipos TypeScript
🧩 Estrutura de pastas (resumo)
text
src/
├── components/      # Componentes reutilizáveis (Navbar, ArtworkCard, etc.)
├── pages/           # Páginas da aplicação
├── hooks/           # Hooks personalizados (useCities, useAuth, etc.)
├── context/         # Contextos (AuthContext)
├── services/        # Comunicação com a API (strapi.ts)
├── lib/             # Constantes, tipos globais
├── utils/           # Logger, errorHandler, validação de ambiente
└── main.tsx / App.tsx
📝 Notas importantes
Token admin: Não o inclua no código nem no .env em produção. Em desenvolvimento local pode ser usado para testes.

Backup: Os dados (conteúdos do Strapi) estão na base de dados do serviço de alojamento (Railway, etc.). Faça exportações periódicas.

Comunicação: Use GitHub Issues ou um chat para coordenar tarefas.

Licença
MIT
