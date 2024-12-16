Feature: Ver e salvamentos donos das playlists
    As a Usuário autenticado no aplicativo
    I want To ver seguidores e donos de playlists
    So that eu posso analisar as informações de uma playlists

Scenario: Informações de salvamento
    Given uma "playlist" com ID "10" e nome "Sertanejo Desconcertante" esta cadastrada no sistema
    And usuários de ID "14", "15" e "16" têm salvo a playlist
    When um usuário realiza uma requisição "GET" no endpoint "/playlists/10/Saves"
    Then sistema retorna o código "200"
    And o servidor retorna "quantidade de seguidores = 3";

Scenario: informações de salvamento
    Given uma "playlist" com ID "12" e nome "Clássicas do Reginaldo Rossi" esta cadastrada no sistema
    And nenhum usuário salvou a playlist
    When um usuário realiza uma requisição "GET" no endpoint "/playlists/12/Saves"
    Then sistema retorna o código "200"
    And sistema retorna mensagem "Não existe usuários que salvaram essa playlist"

Scenario: adicionar um novo salvamento em uma playlist
    Given uma "playlist" com ID "14" e nome "Pagode Furioso" esta cadastrada no sistema
    and Usuários de ID "20", "21" e "22" salvaram em seus campos "biblioteca" a playlist
    When uma requisição "POST" é feita no endpoint "/playlist/14/saves"
    Then o campo "salvamentos" é incrementado