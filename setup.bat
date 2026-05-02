@echo off
REM Script de Setup Automático - Galeria Cities PT para Windows
REM Use: setup.bat

title Galeria Cities PT - Setup Automático
echo.
echo 🎨 Galeria Cities PT - Setup Automático
echo ========================================
echo.

REM Verificar Node.js
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Node.js não encontrado!
    echo Download em: https://nodejs.org (versão 18+)
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
echo ✅ Node.js %NODE_VERSION% encontrado
echo.

REM Verificar npm
where npm >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ npm não encontrado!
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('npm --version') do set NPM_VERSION=%%i
echo ✅ npm %NPM_VERSION% encontrado
echo.

REM Instalar dependências
echo 📦 Instalando dependências...
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Erro ao instalar dependências
    pause
    exit /b 1
)
echo ✅ Dependências instaladas
echo.

REM Verificar se .env.local existe
if not exist .env.local (
    echo 📝 Criando ficheiro .env.local...
    copy .env.example .env.local
    echo ⚠️  AÇÃO NECESSÁRIA:
    echo    1. Abrir ficheiro .env.local
    echo    2. Adicionar chaves Supabase:
    echo       - VITE_SUPABASE_URL
    echo       - VITE_SUPABASE_ANON_KEY
    echo    3. Guardar ficheiro
    echo.
    echo    Encontre as chaves em:
    echo    https://app.supabase.com → Projeto → Settings → API
    echo.
    pause
) else (
    echo ✅ Ficheiro .env.local encontrado
)

echo.
echo 🚀 Setup Completo!
echo ========================================
echo.
echo Próximo passo:
echo   npm run dev
echo.
echo Abre em: http://localhost:5173
echo.
pause
