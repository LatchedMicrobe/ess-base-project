Feature: Cadastro e Manutenção de Músicas e Álbuns
    As a Artista
    I want to inserir, remover e atualizar músicas e álbuns
    So that eu posso disponibilizar minhas músicas para os usuários da plataforma

Scenario: Inserindo single no sistema
    Given o usuario de login "joydivision" está autenticado como artista
    When o campo do body "genero" está preenchido com "Rock"
    And o campo "subgenero" está preenchido com "Post-Punk"
    And o campo "name" está preenchido com "Something Must Break"
    And o campo "songs" está preenchido com "'Something Must Break'"
    And o campo "songs_paths" está preenchido com "'pasta/song.mp3'"
    And o campo "artist_login" está preenchido com "joydivision"
    And uma requisição "POST" é feita no endpoint "/albums"
    Then o sistema retorna o código "201"
    And o lançamento é registrado no banco de dados
    And o campo "tipo" está preenchido com "Single"

Scenario: atualizando um lançamento 
    Given o usuario de login "joydivision" está autenticado como artista
    And existe um lançamento com id "1" para esse usuario
    And o lançamento possui o campo "songs" com "'Something Must Break'"
    When o campo do body "songs" esta preenchido com "'Dead Souls'"
    And o campo "artist_login" está preenchido com "joydivision"
    And uma requisição "PATCH" é feita no endpoint "/albums/1"
    Then o sistema retorna o código "200"
    And a musica atualizada agora se chama "'Dead Souls'"

Scenario: falha ao atualizar música com campo nome vazio
    Given o usuario de login "joydivision" está autenticado como artista
    And existe um lançamento com id "1" para esse usuario
    And o lançamento possui o campo "songs" com "'Something Must Break'"
    When o campo do body "songs" está preenchido com "''"
    And o campo "artist_login" está preenchido com "joydivision"
    And uma requisição "PATCH" é feita no endpoint "/albums/1"
    Then o sistema retorna o código "400"

Scenario: removendo um lançamento do sistema
    Given o usuario de login "joydivision" está autenticado como artista
    And existe um lancamento com id "1" para esse usuario
    When o campo do body "artist_login" está preenchido com "joydivision"
    And uma requisição "DELETE" é feita no endpoint "/albums/1"
    Then o sistema retorna o código "200"
    And o lançamento é removido do banco de dados



#Scenario: Inserindo single com feat no sistema
#   Given o usuario de login "elis" está autenticado como artist
#    When uma requisição "POST" é feita no endpoint "/albums"
#    And o campo "genero" está preenchido com "MPB"
#    And o campo "subgenero" está preenchido com "Bossa-Nova"
#    And o campo "nome_lancamento" está preenchido com "Águas de Março"
#    And o campo "nome_musicas" está preenchido com "'Águas de Março'"
#    And o campo "artist_login" está preenchido com "tomjob"
#    And o campo "feat" está preenchido com "Tom Jobim"
#    Then o sistema retorna o código "201"
#    And o lançamento é registrado no banco de dados
#    And o campo "tipo" está preenchido com "Single"
#    And o campo "nome_musicas" está preenchido com "'Águas de Março (feat. Tom Jobim)'"

#Scenario: inserindo um EP no sistema
#    Given o usuario de login "kurt" está autenticado como artista
#    When uma requisição "POST" é feita no endpoint "/albums"
#    And o campo "genero" está preenchido com "Rock"
#    And o campo "subgenero" está preenchido com "Grunge"
#    And o campo "nome_lancamento" está preenchido com "Nevermind"
#    And o campo "nome_musicas" está preenchido com "'Polly', 'Come As You Are', 'Heart-Shaped-Box'"
#    And o campo "artist_login" está preenchido com "kurt"
#    Then o sistema retorna o código "201"
#    And o lançamento é registrado no banco de dados
#    And o campo "tipo" está preenchido com "EP"

#Scenario: removendo uma música de um lançamento no servidor
#    Given o usuario de login "rapper" está autenticado como aartista
#    And existe um lançamento com id "1" para esse usuario
#    And o lançamento possui o campo "nome_musicas" com "'Opening', 'Song1', 'Song2', 'Ending'"
#    And existe uma musica com id "13" para esse usuario
#    When uma requisição "DELETE" é feita no endpoint "/albums/:albumId/songs/:songId"
#    And o campo "musicas_removidas" da requisição está preenchido com "'Opening'"
#    Then o sistema retorna o código "200"
#    And a musica é removida do banco de dados
#    And o lançamento é atualizado do banco de dados
#    And o campo "nome_musicas" do lancamento está preenchido com "'Song1', 'Song2', 'Ending'"