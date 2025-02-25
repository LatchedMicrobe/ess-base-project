Feature: Categorias em Playlist(s)
#    As a usuário autenticado
#    I want to editar categoria(s) de uma playlist
#    So that eu possa identificar uma playlist para fins de busca e identificação

#Background:
#    Given O usuário autenticado "Rodrigo Pontes"
#    And com login: "rpol", senha: "1234" e email: rpol@cin.ufpe.br

Scenario: Adicionar categoria a uma playlist na edição de uma playlist
    Given O sistema tem as categorias de nome "Rock" e "Brega"
    And O usuário tem uma playlist de nome "Rockzera" cadastrada no sistema
    When O usuário manda uma requisição "PUT" no endpoint "/playlists", com o ID da playlist de nome "Rockzera", cujo body possui os ids das categorias de nome "Rock" e a de nome "Brega" em categories
    Then O sistema deve retornar o código "200"
    And O sistema deveria ter as categorias de nome "Rock" e de nome "Brega" cadastrada nessa playlist

Scenario: Excluir categoria de uma playlist na edição de uma playlist
    Given O sistema tem as categorias de nome "Funk"
    And O usuário tem uma playlist de nome "Funkzera" cadastrada no sistema que tem a categoria de nome "Funk"
    When O usuário manda uma requisição "PUT" no endpoint "/playlists", com o ID da playlist de nome "Rockzera", cujo body não possui os ids das categorias de nome "Funk" em categories
    Then O sistema deve retornar o código "200"
    And O sistema não deveria ter as categorias de nome "Funk" cadastrada nessa playlist

#Scenario: Cadastro de música em uma playlist sem categorias
#    Given que o usuário tem uma playlist de ID "24" foi cadastrada no sistema
#    And a playlist de ID "24" não tem músicas
#    And a playlist de ID "24" não tem categorias cadastradas no sistema
#    When eu faço uma requisição "POST"  ao sistema no endpoint "/playlist/24/songs" para cadastrar a música de ID "45" com o campo "genero" preenchido com "Brega" na playlist
#    Then o sistema deve mandar um código "201"
#    And o sistema deveria ter a categoria com nome "Brega" e ID "4" como nova categoria cadastrada da playlist