// script.js - Versão Completa e Unificada

document.addEventListener('DOMContentLoaded', function() {

    // --- SELEÇÃO DE ELEMENTOS GLOBAIS ---
    // Seleciona os elementos principais que usaremos em diferentes funções
    const cvForm = document.getElementById('cv-form');
    const addExpBtn = document.getElementById('add-exp-btn');

    // ===================================================================
    // --- FUNCIONALIDADE 1: ADICIONAR ENTRADAS DE EXPERIÊNCIA ---
    // ===================================================================

    // Verifica se o botão "Adicionar Experiência" existe na página antes de adicionar o listener
    if (addExpBtn) {
        let experienceCount = 2; // Começa em 2, pois a primeira experiência já está no HTML

        addExpBtn.addEventListener('click', function() {
            const newExperienceEntry = document.createElement('div');
            newExperienceEntry.classList.add('experience-entry');

            // Cria o bloco HTML para os novos campos
            const newExperienceHTML = `
                <hr style="margin: 2rem 0; border-top: 1px solid #e0e0e0;">
                <label for="cargo${experienceCount}">Cargo:</label>
                <input type="text" id="cargo${experienceCount}" name="cargo[]">

                <label for="empresa${experienceCount}">Empresa:</label>
                <input type="text" id="empresa${experienceCount}" name="empresa[]">

                <label for="periodo${experienceCount}">Período:</label>
                <input type="text" id="periodo${experienceCount}" name="periodo[]">

                <label for="descricao${experienceCount}">Descrição das Atividades:</label>
                <textarea id="descricao${experienceCount}" name="descricao[]" rows="4"></textarea>
            `;

            newExperienceEntry.innerHTML = newExperienceHTML;
            
            // Insere o novo bloco de experiência antes do botão "Adicionar Experiência"
            addExpBtn.parentNode.insertBefore(newExperienceEntry, addExpBtn);
            
            experienceCount++; // Incrementa o contador para a próxima entrada
        });
    }

    // ===================================================================
    // --- FUNCIONALIDADE 2: SUBMETER FORMULÁRIO E GERAR PDF ---
    // ===================================================================

    // Verifica se o formulário existe na página
    if (cvForm) {
        cvForm.addEventListener('submit', function(event) {
            // Previne o recarregamento da página
            event.preventDefault();

            // Coleta todos os dados do formulário, incluindo os campos adicionados dinamicamente
            const formData = new FormData(cvForm);

            // Envia os dados para o script PHP
            fetch('generate.php', {
                method: 'POST',
                body: formData
            })
            .then(response => {
                // Se a resposta não for OK, lança um erro para o catch
                if (!response.ok) {
                    throw new Error('Houve um problema com a resposta do servidor.');
                }
                return response.blob(); // Pega a resposta como um arquivo (blob)
            })
            .then(blob => {
                // Cria uma URL temporária para o arquivo PDF
                const url = window.URL.createObjectURL(blob);
                
                // Cria um link <a> invisível para iniciar o download
                const a = document.createElement('a');
                a.style.display = 'none';
                a.href = url;
                a.download = 'meu-curriculo.pdf';
                document.body.appendChild(a);
                
                // Simula o clique no link para baixar o arquivo
                a.click();

                // Limpa a URL temporária e remove o link da página
                window.URL.revokeObjectURL(url);
                document.body.removeChild(a);
            })
            .catch(error => {
                console.error('Erro ao gerar o PDF:', error);
                alert('Ocorreu um erro ao gerar seu PDF. Tente novamente.');
            });
        });
    }
});