Feature: Recuperação de Senha
    As a usuário cadastrado
    I want to recuperar a senha da minha conta
    So that eu possa me autenticar novamente no sistema

#GUI Scenario
Scenario: Recuperação de Senha com Sucesso
    Given eu estou na página "Recuperação de Senha"
    And existe usuário com o e-mail "batman@cin.ufpe.br"
    And eu preenchi o campo "e-mail" com "batman@cin.ufpe.br"
    When eu seleciono a opção "Recuperar senha"
    Then eu sou encaminhado para a página "Login"
    And aparece a mensagem "E-mail de recuperação enviado"

#GUI Scenario
Scenario: Falha na Recuperação de Senha por Conta Inexistente
    Given eu estou na página "Recuperação de Senha"
    And não existe usuário com o e-mail "batman@cin.ufpe.br"
    And eu preenchi o campo "e-mail" com "batman@cin.ufpe.br"
    When eu seleciono a opção "Recuperar senha"
    Then aparece a mensagem "O email não está cadastrado"
    And eu permaneço na página "Recuperação de Senha"

#GUI Scenario
Scenario: Alteração de Senha via Recuperação com Sucesso
    Given eu estou na página "Criar Nova Senha"
    And eu preenchi o campo "nova senha" com "senha123"
    And eu preenchi o campo "confirmar senha" com "senha123"
    When eu seleciono a opção "Alterar"
    Then eu sou encaminhado para a página "Login"
    And aparece a mensagem "Senha alterada com sucesso"

#GUI Scenario
Scenario: Falha na Alteração de Senha via Recuperação por Senha Insuficiente
    Given eu estou na página "Criar Nova Senha"
    And eu preenchi o campo "nova senha" com "123"
    And eu preenchi o campo "confirmar senha" com "123"
    When eu seleciono a opção "Alterar"
    Then aparece a mensagem "Sua senha deve conter pelo menos 6 caracteres"
    And eu permaneço na página "Criar Nova Senha"

#GUI Scenario
Scenario: Falha na Alteração de Senha via Recuperação por Senhas Diferentes
    Given eu estou na página "Criar Nova Senha"
    And eu preenchi o campo "nova senha" com "senha123"
    And eu preenchi o campo "confirmar senha" com "senha123456"
    When eu seleciono a opção "Alterar"
    Then aparece a mensagem "Senhas não correspondem"
    And eu permaneço na página "Criar Nova Senha"
