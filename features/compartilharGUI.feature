Feature: Compartilhar página personalizada
    As a Usuário autenticado no aplicativo
    I want to compartilhar uma página à minha escolha
    So that eu possa compartilhar meus gostos com outras pessoas

Scenario: Compartilhar playlist
    Given estou na página da playlist "Gospel Metálico"
    When seleciono a opção "compartilhar"
    Then continuo na página da playlist "Gospel Metálico"
    And recebo um link direcionado para a playlist "Gospel Metálico"

Scenario: Compartilhar artista
    Given estou na página do artista "Queen"
    When seleciono a opção "compartilhar"
    Then continuo na página do artista "Queen"
    And recebo um link direcionado para a página do artista "Queen"

Scenario: Compartilhar música
    Given estou na página da música "The Line"
    When seleciono a opção "compartilhar"
    Then continuo na página da música "The Line"
    And recebo um link direcionado para a página da música "The Line"
