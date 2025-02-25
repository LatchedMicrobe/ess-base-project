Feature: cadastro e manutenção de artista
    As a artista do sistema
    I want to me cadastrar e modificar meus dados no sistema
    So that eu possa fazer login e utilizar a plataforma de streaming

Scenario: Cadastro de artista com sucesso
    Given eu estou na página "Cadastro de Artista"
    And não existe Artista com o campo "nome artístico" preenchido com "Daniel Silva"
    And não existe Artista com o campo "login" preenchido com "Dan32"
    And não existe Artista com o campo "e-mail" preenchido com "daniel32@gmail.com"
    When eu preencho o campo "nome artístico" com "Daniel Silva"
    And eu preencho o campo "login" com "Dan32"
    And eu preencho o campo "e-mail" com "daniel32@gmail.com"
    And eu preencho o campo "Senha" com "password1"
    And eu seleciono "Cadastrar"
    Then aparece a mensagem "Cadastro realizado com sucesso"
    And sou encaminhado para a página "login"

Scenario: Falha no cadastro de artista por campo obrigatório vazio
    Given eu estou na página "Cadastro de Artista"
    When eu preencho o campo "nome artístico" com "Daniel Silva"
    And eu preencho o campo "login" com ""
    And eu preencho o campo "e-mail" com "daniel32@gmail.com"
    And eu preencho o campo "senha" com "password1"
    Then a opção de cadastrar fica bloqueada
    And aparece a mensagem "Preencha todos os campos obrigatórios"

Scenario: Atualização no cadastro de artista com sucesso
    Given eu estou na página "atualização de cadastro de artista"
    And não existe Artista com o "nome artístico" "Daniel Oliveira"
    When eu preencho o campo "nome artístico" com "Daniel Oliveira"
    And eu preencho o campo "sobre o artista" com "xxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
    And eu seleciono "Confirmar"
    Then aparece a mensagem "Informações alteradas com sucesso"
    
Scenario: Alteração de senha do artista com sucesso
    Given eu estou na página "Alteração de senha"
    And minha senha atual é "senha123"
    When eu preencho o campo "senha atual" com "oldsenhA"
    And eu preencho o campo "nova senha" com "senha123"
    And eu preencho o campo "confirmar senha" com "senha123"
    And eu seleciono "alterar"
    Then aparece a mensagem "senha alterada com sucesso"
    And eu volto pra página "atualização de cadastro de artista"

Scenario: Falha no cadastro de artista por dados já em uso
    Given eu estou na página "Cadastro de Artista"
    And existe Artista com o campo "nome artístico" preenchido com "Linkin Park"
    When eu preencho o campo "nome artístico" com "Linkin Park"
    And eu preencho o campo "login" com "LPark06"
    And eu preencho o campo "e-mail" com "linkinparts@ufpe.br"
    And eu preencho o campo "senha" com "password1"
    And eu seleciono "Cadastrar"
    Then aparece a mensagem "Já existe cadastro com esse nome artístico"

Scenario: Falha no cadastro de artista por dados já em uso
    Given eu estou na página "Atualização de cadastro de Artista"
    And existe Artista com o "login" "LPark10"
    When eu preencho o campo "login" com "LPark10"
    And eu seleciono "Confirmar"
    Then aparece a mensagem "Já existe cadastro com esse login"

Scenario: Falha no cadastro de artista por campo obrigatório vazio
    Given eu estou na página "Atualização de cadastro de Artista"
    When eu preencho o campo "login" com ""
    And eu seleciono "Confirmar"
    Then aparece a mensagem "Preencha todos os campos obrigatórios"

Scenario: Falha no cadastro de artista por dados já em uso
    Given eu estou na página "Cadastro de Artista"
    And existe Artista com o campo "e-mail" preenchido com "linkinparts@ufpe.br"
    When eu preencho o campo "nome artístico" com "Linkin Park"
    And eu preencho o campo "login" com "LPark06"
    And eu preencho o campo "e-mail" com "linkinparts@ufpe.br"
    And eu preencho o campo "senha" com "password1"
    And eu seleciono "Cadastrar"
    Then aparece a mensagem "Já existe cadastro com esse e-mail"