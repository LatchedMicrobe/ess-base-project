Feature: Compartilhar página personalizada
    As a Usuário autenticado no aplicativo
    I want to compartilhar uma página à minha escolha
    So that eu possa compartilhar meus gostos com outras pessoas

Scenario: Compartilhar playlist da biblioteca
    Given Usuário de ID "16", login "Julio" e senha "1234" está autenticado no sistema
    And Usuário quer compartilhar uma playlist com ID "27" e nome "Eletro pop"
    When o usuário realiza uma requisição "POST" no endpoint "/playlist/27/share"
    Then o sistema retorna código "201"
    And o sistema retorna link gerado

Scenario: Compartilhamento de música
    Given Usuário de ID "20", login "Rodrigo" e senha "2345" está autenticado no sistema
    And Usuário quer compartilhar uma música com ID "27" e nome "A raposa e as uvas"
    When o usuário realiza requisição "POST" no endpoint "/songs/27/share"
    Then o sistema retorna código "201"
    And o sistema retorna link gerado

Scenario: Compartilhamento de música deletada
    Given Usuário de ID "20", login "Alex" e senha "3456" está autenticado no sistema
    And Usuário quer compartilhar uma música com ID "27" e nome "A raposa e as uvas"
    And a música de ID "27" foi deletada
    When o usuário realiza requisição "POST" no endpoint "/songs/27/share"
    Then o sistema retorna código "204"
    And o sistema retorna mensagem "Música inexistente"
