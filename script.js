// script.js

document.addEventListener('DOMContentLoaded', function() {
    // Seleciona o formulário pelo ID
    const cvForm = document.getElementById('cv-form');

    // Adiciona um 'ouvinte' para o evento de SUBMISSÃO do formulário
    cvForm.addEventListener('submit', function(event) {
        // 1. Previne o comportamento padrão do formulário (que é recarregar a página)
        event.preventDefault();

        // 2. Coleta TODOS os dados do formulário de uma vez só
        const formData = new FormData(cvForm);

        // 3. Envia os dados para o script PHP usando fetch
        fetch('generate.php', {
            method: 'POST',
            body: formData
        })
        .then(response => response.blob()) // 4. Pega a resposta como um 'blob' (um tipo de arquivo)
        .then(blob => {
            // 5. Cria uma URL temporária para o arquivo PDF recebido
            const url = window.URL.createObjectURL(blob);
            
            // 6. Cria um link <a> invisível para iniciar o download
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = url;
            a.download = 'meu-curriculo.pdf'; // O nome do arquivo que será baixado
            document.body.appendChild(a);
            
            // 7. Simula o clique no link para iniciar o download e depois o remove
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        })
        .catch(error => console.error('Erro:', error)); // Captura qualquer erro de rede
    });

    // Adicionar a lógica para o botão "Adicionar Experiência" no futuro
});