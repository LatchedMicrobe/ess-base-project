Feature: Busca com Filtro
#    As a usuário autenticado
#    I want to buscar por somente músicas, playlists, artistas, gêneros ou subgêneros
#    So that eu possa especificar qual o conjunto no qual estou fazendo a busca

#Background:
#    Given O usuário autenticado "Rodrigo Pontes"
#    And com login: "rpol", senha: "1234" e email: rpol@cin.ufpe.br

Scenario: Pesquisar sem um Filtro
    Given O sistema possui um artista de nome "Breganaldo" e um de nome "Rocknaldo", uma música de nome "Brega tem dessas" e uma de nome "Rock ou morte"
    When O usuário realizo uma requisição "GET" ao sistema com endpoint "/search" com um parametro de query ds igual a "Brega"
    Then O sistema deve me retornar o código "200"
    And O sistema deveria me retornar os artistas de nome "Breganaldo", as músicas de nome "Brega tem dessas"

Scenario: Pesquisar com um Filtro
    Given O sistema possui um artista de nome "Rocknaldo", uma música de nome "Rock ou morte" e uma playlist de nome "Rockzera"
    When O usuário realizo uma requisição "GET" ao sistema com endpoint "/search" com parametro de query ds igual a "Rock" e filter a "artist"
    Then O sistema deve me retornar o código "200"
    And O sistema deveria me retornar as playlists de nome "Rocknaldo"

