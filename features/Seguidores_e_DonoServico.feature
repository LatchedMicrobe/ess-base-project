Feature: Ver dono de playlists e quantidade de usuários que a salvaram
    As a Usuário autenticado no aplicativo
    I want to ver seguidores e donos de playlists
    So that eu possa analisar as informações de uma playlist

Scenario: Informações de salvamento
    Given uma playlist com ID "10" e nome "Sertanejo Desconcertante" está cadastrada no sistema
    And usuários de ID "14", "15" e "16" salvaram a playlist
    When um usuário realiza uma requisição "GET" no endpoint "/playlists/10/saves"
    Then o sistema retorna o código "200"
    And o servidor retorna "quantidade de seguidores = 3"

Scenario: Informações de salvamento sem usuários
    Given uma playlist com ID "12" e nome "Clássicas do Reginaldo Rossi" está cadastrada no sistema
    And nenhum usuário salvou a playlist
    When um usuário realiza uma requisição "GET" no endpoint "/playlists/12/saves"
    Then o sistema retorna o código "200"
    And o sistema retorna a mensagem "Não existem usuários que salvaram essa playlist"

Scenario: Adicionar um novo salvamento em uma playlist
    Given uma playlist com ID "14" e nome "Pagode Furioso" está cadastrada no sistema
    And usuários de ID "20", "21" e "22" salvaram em seus campos "biblioteca" a playlist
    When uma requisição "POST" é feita no endpoint "/playlists/14/saves"
    Then o campo "salvamentos" é incrementado
