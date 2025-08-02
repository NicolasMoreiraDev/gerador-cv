<?php
// Requer a biblioteca FPDF
require('fpdf/fpdf.php');

// --- CLASSE PDF PERSONALIZADA (para cabeçalho e rodapé, se necessário no futuro) ---
// A classe FPDF é o padrão.
class PDF extends FPDF
{
    // Futuramente, adicionar um cabeçalho ou rodapé padrão aqui
}

// --- VERIFICAÇÃO E COLETA DOS DADOS DO FORMULÁRIO ---
if ($_SERVER['REQUEST_METHOD'] == 'POST') {

    // Função auxiliar para limpar os dados (medida de segurança)
    function clean_input($data) {
        return htmlspecialchars(stripslashes(trim($data)));
    }

    // Coleta dos dados pessoais
    $nome = clean_input($_POST['nome']);
    $email = clean_input($_POST['email']);
    $telefone = clean_input($_POST['telefone']);
    $linkedin = clean_input($_POST['linkedin']);

    // Coleta dos dados de experiência (são arrays)
    $cargos = $_POST['cargo'];
    $empresas = $_POST['empresa'];
    $periodos = $_POST['periodo'];
    $descricoes = $_POST['descricao'];

    // Coleta dos dados de formação
    $curso = clean_input($_POST['curso']);
    $instituicao = clean_input($_POST['instituicao']);


    // --- INÍCIO DA GERAÇÃO DO PDF ---
    $pdf = new PDF('P','mm','A4');
    $pdf->AddPage();
    $pdf->SetMargins(20, 20, 20); // Define as margens da página

    // --- CABEÇALHO DO CURRÍCULO (DADOS PESSOAIS) ---

    // Nome em destaque
    $pdf->SetFont('Arial','B',24);
    $pdf->Cell(0, 10, utf8_decode($nome), 0, 1, 'C');//utf8_decode converte caracteres especiais para UTF-8
    $pdf->Ln(5); // Pula uma linha

    // Contatos (E-mail, Telefone, LinkedIn)
    $pdf->SetFont('Arial','',12);
    $contact_info = "Email: " . $email . " | Telefone: " . $telefone;
    $pdf->Cell(0, 10, $contact_info, 0, 1, 'C');
    if (!empty($linkedin)) {
        $pdf->SetTextColor(44, 117, 181); // Cor azul para o link
        $pdf->Cell(0, 5, $linkedin, 0, 1, 'C', false, $linkedin); // Adiciona o link com underline
        $pdf->SetTextColor(0,0,0); // Restaura a cor do texto para preto
    }
    $pdf->Ln(10); // Pula uma linha maior

    // --- SEÇÃO DE EXPERIÊNCIA PROFISSIONAL ---

    $pdf->SetFont('Arial','B',16);
    $pdf->Cell(0, 10, utf8_decode('Experiência Profissional'), 0, 1, 'L');
    $pdf->SetDrawColor(0,0,0); // Cor da linha preta
    $pdf->Line($pdf->GetX(), $pdf->GetY(), $pdf->GetX() + 170, $pdf->GetY()); // Desenha uma linha
    $pdf->Ln(5);

    // Loop para adicionar cada experiência profissional
    if (!empty($cargos)) {
        for ($i = 0; $i < count($cargos); $i++) {
            if (!empty($cargos[$i])) { // Só adiciona se o campo cargo não estiver vazio
                $pdf->SetFont('Arial','B',12);
                $pdf->Cell(0, 8, utf8_decode($cargos[$i]), 0, 1, 'L');

                $pdf->SetFont('Arial','I',11);
                $empresa_periodo = utf8_decode($empresas[$i]) . ' | ' . utf8_decode($periodos[$i]);
                $pdf->Cell(0, 8, $empresa_periodo, 0, 1, 'L');

                $pdf->SetFont('Arial','',11);
                // MultiCell é usado para textos longos que quebram a linha automaticamente
                $pdf->MultiCell(0, 6, utf8_decode($descricoes[$i]), 0, 'L');
                $pdf->Ln(5);
            }
        }
    }

    // --- SEÇÃO DE FORMAÇÃO ACADÊMICA ---

    $pdf->SetFont('Arial','B',16);
    $pdf->Cell(0, 10, utf8_decode('Formação Acadêmica'), 0, 1, 'L');
    $pdf->Line($pdf->GetX(), $pdf->GetY(), $pdf->GetX() + 170, $pdf->GetY());
    $pdf->Ln(5);// Pula uma linha maior

    $pdf->SetFont('Arial','B',12);
    $pdf->Cell(0, 8, utf8_decode($curso), 0, 1, 'L');
    $pdf->SetFont('Arial','I',11);
    $pdf->Cell(0, 8, utf8_decode($instituicao), 0, 1, 'L');
    $pdf->Ln(5);


    // --- ENVIA O PDF GERADO ---
    $pdf->Output('I', 'curriculo.pdf'); // 'I' envia para o navegador, 'D' força o download

} else {
    // Acesso inválido
    header('Location: index.html');
    exit();
}
?>