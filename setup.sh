#!/bin/bash

# Script de Setup Automático - Galeria Cities PT
# Use: bash setup.sh (Linux/Mac) ou setup.bat (Windows)

echo "🎨 Galeria Cities PT - Setup Automático"
echo "========================================"
echo ""

# Verificar Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js não encontrado!"
    echo "Download em: https://nodejs.org (versão 18+)"
    exit 1
fi

NODE_VERSION=$(node --version)
echo "✅ Node.js $NODE_VERSION encontrado"
echo ""

# Verificar npm
if ! command -v npm &> /dev/null; then
    echo "❌ npm não encontrado!"
    exit 1
fi

NPM_VERSION=$(npm --version)
echo "✅ npm $NPM_VERSION encontrado"
echo ""

# Instalar dependências
echo "📦 Instalando dependências..."
npm install
if [ $? -ne 0 ]; then
    echo "❌ Erro ao instalar dependências"
    exit 1
fi
echo "✅ Dependências instaladas"
echo ""

# Verificar se .env.local existe
if [ ! -f .env.local ]; then
    echo "📝 Criando ficheiro .env.local..."
    cp .env.example .env.local
    echo "⚠️  AÇÃO NECESSÁRIA:"
    echo "   1. Abrir ficheiro .env.local"
    echo "   2. Adicionar chaves Supabase:"
    echo "      - VITE_SUPABASE_URL"
    echo "      - VITE_SUPABASE_ANON_KEY"
    echo "   3. Guardar ficheiro"
    echo ""
    echo "   Encontre as chaves em:"
    echo "   https://app.supabase.com → Projeto → Settings → API"
    echo ""
    read -p "Pressione ENTER quando tiver adicionado as chaves..."
else
    echo "✅ Ficheiro .env.local encontrado"
fi

echo ""
echo "🚀 Setup Completo!"
echo "========================================"
echo ""
echo "Próximo passo:"
echo "  npm run dev"
echo ""
echo "Abre em: http://localhost:5173"
echo ""
