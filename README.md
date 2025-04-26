# 🧹 Limpa e Filtra Conexões no LinkedIn

Script de automação para filtrar e remover conexões do LinkedIn com base em palavras-chave, diretamente pelo navegador.

## 📌 Descrição:

Este script foi desenvolvido para ajudar na **gestão da sua rede de conexões no LinkedIn**, permitindo que você:

- 🧠 **Mantenha contatos relevantes**, exemplo: gestores e diretores, mas vai depender do que cada um buscar.
- 🧼 **Remova conexões em massa**, de forma automatizada, com base em palavras-chave.
- 👀 **Visualize antes de remover**, com opção de selecionar manualmente quais conexões deseja excluir.

## ⚙️ Como funciona:

1. O script percorre todas as conexões carregadas na página.
2. Analisa o título profissional de cada conexão.
3. Compara com as palavras-chave de **manutenção** e **remoção**.
4. Exibe a lista de conexões candidatas à remoção.
5. Permite ao usuário confirmar **quais deseja remover**.
6. Realiza a remoção automática com cliques simulados.

## 🛠️ Requisitos:

- Navegador (preferencialmente Chrome)
- Estar logado no LinkedIn
- Acessar a página de conexões: `https://www.linkedin.com/mynetwork/invite-connect/connections/`
- Necessário todas as conexões estarem carregadas na pagina para um melhor resultado.

## 🚀 Como usar:

1. Acesse a página de conexões no LinkedIn.
2. Abra o console do navegador (`F12` ou `Ctrl+Shift+I` → aba **Console**).
3. Cole e execute o script.

## ✏️ Configuração:

Para personalizar a filtragem para manter e remover conexões, só modificar as consts abaixo, a const de manter e a const de remover:

const keywordsToRemove = []; // ex: 
// Conexões com as chaves vazias, será removido todas as conexões que nao estao na const para manter, conexões termos inseridos dentro serão removidas, ex ["Marketing", "Vendas"] .

const keywordsToKeep = ["gestor", "diretor"]; 
// Conexões com estes termos serão mantidas

🧠 Exemplo de uso:
- Conexões com o título: "Diretor de Operações" → Mantidas ✅
- Conexões com o título: "Marketing" ou "Vendas" → Candidatas à remoção ❌
- Conexões com o título: "Consultor" (sem palavra-chave de manutenção) → Candidata à remoção ❌

⚠️ Aviso:
- Usar moderadamente para não gerar bloqueio ou restrição no linkedin

