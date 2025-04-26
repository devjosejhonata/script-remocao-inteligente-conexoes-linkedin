
// Função para normalizar o texto (remover acentos, espaços extras e deixar minúsculo)
function normalizeText(text) {
    return text
        .normalize("NFD") // Separa caracteres acentuados (ex: "é" vira "e" + acento)
        .replace(/[\u0300-\u036f]/g, "") // Remove os acentos
        .toLowerCase() // Converte para minúsculas
        .trim(); // Remove espaços em branco nas extremidades
}

// Verifica se pelo menos uma palavra-chave de manutenção está presente no título
function shouldKeepConnection(title, keywordsToKeep) {
    let normalizedTitle = normalizeText(title); // Normaliza o título do usuário
    let regex = new RegExp(`\\b(${keywordsToKeep.map(normalizeText).join("|")})\\b`, "i"); // Cria uma expressão regular com as palavras-chave
    return regex.test(normalizedTitle); // Retorna true se encontrar alguma palavra-chave no título
}

// Função principal que executa a lógica de remoção de conexões com base nas palavras-chave
async function removeConnectionsByKeywords(keywordsToRemove, keywordsToKeep, maxRemovals = 50) {
    console.log("🔍 Buscando conexões para remover...");
    
    // Captura todos os cartões de conexão na página do LinkedIn
    let connections = document.querySelectorAll('.mn-connection-card');
    console.log(`🔍 Encontradas ${connections.length} conexões na página.`);

    let candidatesForRemoval = []; // Armazena conexões candidatas à remoção

    // Itera sobre todas as conexões visíveis na página
    for (let connection of connections) {
        // Coleta elementos de nome, cargo e tempo de conexão
        let nameElement = connection.querySelector('.mn-connection-card__name');
        let titleElement = connection.querySelector('.mn-connection-card__occupation');
        let timeElement = connection.querySelector('.time-badge');

        // Extrai os textos, com fallback caso algum elemento não seja encontrado
        let name = nameElement ? nameElement.innerText.trim() : "Nome não encontrado";
        let title = titleElement ? titleElement.innerText.trim() : "Cargo não encontrado";
        let timeConnected = timeElement ? timeElement.innerText.trim() : "Tempo de conexão não encontrado";

        let normalizedTitle = normalizeText(title); // Normaliza o título para comparação

        // Se contiver palavra-chave de manutenção, pula essa conexão
        if (shouldKeepConnection(title, keywordsToKeep)) {
            continue;
        }

        // Se a lista de remoção estiver vazia, considera todas que não estão na lista de manutenção
        // ou se o título contiver palavras a serem removidas
        if (keywordsToRemove.length === 0 || keywordsToRemove.some(keyword => normalizedTitle.includes(normalizeText(keyword)))) {
            // Adiciona aos candidatos para remoção
            candidatesForRemoval.push({ connection, name, title, timeConnected });
        }
    }

    console.log(`📊 O número de conexões encontradas para remoção é: ${candidatesForRemoval.length}`);

    // Se nenhuma conexão for marcada para remoção, finaliza
    if (candidatesForRemoval.length === 0) {
        console.log("✅ Nenhuma conexão encontrada para remoção.");
        return;
    }

    // Limita ao número máximo de remoções definido
    candidatesForRemoval = candidatesForRemoval.slice(0, maxRemovals);

    // Exibe a lista de conexões candidatas para revisão do usuário
    console.log("\n⚠️ As seguintes conexões serão listadas para remoção:");
    candidatesForRemoval.forEach((user, index) => {
        console.log(`${(index + 1).toString().padStart(2, '0')}. ${user.name}\nCargo do usuário:\n${user.title}\n${user.timeConnected}\n`);
    });

    // Solicita input do usuário para confirmar remoção
    let input = prompt("❗ Digite os números das conexões que deseja remover, separados por vírgula, ou digite 'todas' para remover todas: ");
    if (!input) {
        console.log("❌ Nenhuma opção escolhida. Remoção cancelada.");
        return;
    }

    // Interpreta a entrada do usuário
    let selectedIndices = input.trim().toLowerCase() === "todas" 
        ? Array.from({ length: candidatesForRemoval.length }, (_, i) => i) // Seleciona todos
        : input.split(',').map(num => parseInt(num.trim(), 10) - 1).filter(num => num >= 0 && num < candidatesForRemoval.length); // Seleciona índices válidos

    if (selectedIndices.length === 0) {
        console.log("❌ Nenhum número válido informado. Remoção cancelada.");
        return;
    }

    console.log("\n⏳ Iniciando remoção...");
    let removedCount = 0; // Contador de remoções bem-sucedidas

    // Executa a remoção para cada conexão selecionada
    for (let index of selectedIndices) {
        let user = candidatesForRemoval[index];
        let { connection, name, title, timeConnected } = user;

        // Abre o menu de opções da conexão
        let menuButton = connection.querySelector('.artdeco-dropdown__trigger');
        if (!menuButton) {
            console.log(`⚠️ Botão de opções não encontrado para ${name}, pulando...`);
            continue;
        }

        menuButton.click();
        await new Promise(resolve => setTimeout(resolve, 2000)); // Aguarda o menu abrir

        // Procura a opção "Remover conexão"
        let removeButton = [...document.querySelectorAll('.artdeco-dropdown__content span')].find(span => span.innerText.includes("Remover conexão"));
        if (!removeButton) {
            console.log(`⚠️ Botão 'Remover conexão' não encontrado para ${name}, pulando...`);
            continue;
        }

        removeButton.click();
        await new Promise(resolve => setTimeout(resolve, 2000)); // Aguarda o modal de confirmação abrir

        //  Confirma a remoção
        let confirmButton = [...document.querySelectorAll('button')].find(btn => btn.innerText.includes("Remover"));
        if (!confirmButton) {
            console.log(`⚠️ Botão de confirmação não encontrado para ${name}, pulando...`);
            continue;
        }

        confirmButton.click();
        removedCount++; // Incrementa contador
        console.log(`✅ Conexão removida com sucesso! (${removedCount}/${selectedIndices.length})\n${name}\nCargo do usuário:\n${title}\n${timeConnected}\n`);
        await new Promise(resolve => setTimeout(resolve, 3000)); // Aguarda antes de continuar para evitar sobrecarga
    }

    // Exibe resumo ao final
    console.log(`🎯 Processo finalizado! Total removido: ${removedCount}`);
}

//  Palavras-chave de remoção (vazio = remover todas que não estão na lista de manutenção)
const keywordsToRemove = [];

//  Palavras-chave que indicam conexões que devem ser mantidas
const keywordsToKeep = [
    "gestor", "diretor"
];

// Chamada da função principal com os parâmetros definidos
removeConnectionsByKeywords(keywordsToRemove, keywordsToKeep, 50);
