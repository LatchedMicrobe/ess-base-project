Feature: Ver dono de playlists e quantidade de usuários que a salvaram
    As a Usuário autenticado no aplicativo
    I want to ver seguidores e donos de playlists
    So that eu possa analisar as informações de uma playlist

Scenario: Visualizar o dono de uma playlist
    Given o usuário "Break" está na página da playlist de nome "Sucessos de 2010"
    When o usuário seleciona a opção "Criador"
    Then o usuário permanece na página da playlist "Sucessos de 2010"
    And aparece o "nome de usuário" do dono da playlist selecionada

Scenario: Visualizar o dono de uma playlist com usuário deletado
    Given o usuário "Vitor" está na página da playlist de nome "Piseiro Bolado"
    And o usuário dono da playlist selecionada foi deletado
    When o usuário seleciona a opção "Criador"
    Then o usuário permanece na página da playlist "Piseiro Bolado"
    And a mensagem "Usuário não existe" é exibida

Scenario: Visualizar a quantidade de pessoas que salvaram uma playlist
    Given o usuário "Alex" está na página da playlist de nome "Best of Taylor Swift Songs"
    And os usuários "Vitinho" e "Lucas" salvaram a playlist
    When Alex seleciona a opção "Salvamentos"
    Then o usuário permanece na página da playlist "Best of Taylor Swift Songs"
    And aparece a "quantidade de seguidores = 2"
