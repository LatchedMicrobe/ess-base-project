Feature: Cadastro e Manutenção de Músicas e Álbuns
    As a Artista
    I want to inserir, remover e atualizar músicas e álbuns
    So that eu posso disponibilizar minhas músicas para os usuários da plataforma

Scenario: Inserindo um single
    Given eu estou na página "Cadastro e Manutenção de Músicas e Álbuns"
    And autenticado como "Artista" com login "joy-division5"
    When eu informo que quero adicionar "1" nova música do gênero "Rock" e subgênero "Post-Punk"
    And cadastro "Something Must Break" como título da música
    And eu confirmo o lançamento da música adicionada
    Then eu estou na página "Perfil do Artista"
    And vejo a mensagem "Lançamento 'Something Must Break' adicionado com sucesso!"
    And vejo o seguinte lançamento na aba "Discografia"
    |Título            |Something Must Break                    |
    |Gênero            |Rock, Post-Punk                         |
    |Categoria         |Single                                  |
    |Ano de lançamento |2024                                    |
    |Músicas           |Something Must Break                    |

Scenario: Inserindo um novo single com participação especial
    Given eu estou na página "Cadastro e Manutenção de Músicas e Álbuns"
    And autenticado como "Artista" com login "elis-regina42"
    When eu informo que quero adicionar "1" nova música do gênero "MPB" e subgênero "Bossa-Nova"
    And cadastro "Águas de Março" como título da música com "Tom Jobim" como participação especial
    And eu confirmo o lançamento da música adicionada
    Then eu estou na página "Perfil do Artista"
    And vejo a mensagem "Lançamento 'Águas de Março' adicionado com sucesso!"
    And vejo o seguinte lançamento na aba "Discografia"
    |Título            |Águas de Março                          |
    |Gênero            |MPB, Bossa nova                         |
    |Categoria         |Single                                  |
    |Ano de lançamento |2024                                    |
    |Músicas           |Águas de Março (feat. Tom Jobim)        |

Scenario: Inserindo um EP
    Given eu estou na página "Cadastro e Manutenção de Músicas e Álbuns"
    And autenticado como "Artista" com login "nirvana14"
    When eu informo que quero adicionar "3" novas músicas do gênero "Rock" e subgênero "Grunge"
    And cadastro "Nevermind" como título do lançamento
    And cadastro as músicas com os seguintes títulos:
    |Título          |
    |Polly           |
    |Come As You Are |
    |Heart-Shaped Box|
    And eu confirmo o lançamento das músicas adicionadas
    Then eu estou na página "Perfil do Artista"
    And vejo a mensagem "Lançamento 'Nevermind' adicionado com sucesso!"
    And vejo o seguinte lançamento na aba "Discografia"
    |Título            |Nevermind                                |
    |Gênero            |Rock, Grunge                             |
    |Categoria         |EP                                       |
    |Ano de lançamento |2024                                     |
    |Músicas           |Polly, Come As You Are, Heart-Shaped Box |

Scenario: Inserindo um double single sem nome
    Given eu estou na página "Cadastro e Manutenção de Músicas e Álbuns"
    And autenticado como "Artista" com login "antoniocarlosjobim"
    When eu informo que quero adicionar "2" novas músicas do gênero "MPB" e subgênero "Bossa-Nova"
    And tento cadastrar "" como título do lançamento
    Then eu estou na página "Cadastro e Manutenção de Músicas e Álbuns"
    And vejo a seguinte mensagem "O nome do lançamento não pode estar em branco!"  

Scenario: Removendo um lançamento
    Given eu estou na página "Cadastro e Manutenção de Músicas e Álbuns"
    And autenticado como "Artista" com login "joy-division5"
    And existe o lançamento "Unknown Pleasures" para o usuario "joy-division5"
    When eu informo que quero remover o lançamento "Unknown Pleasures"
    And eu confirmo a remoção do lançamento
    Then eu estou na página "Perfil do Artista"
    And vejo a mensagem "Lançamento 'Unknown Pleasures' removido com sucesso!"
    And não vejo o lançamento "Unknown Pleasures" na aba "Discografia"

Scenario: Removendo um lançamento que não existe
    Given eu estou na página "Cadastro e Manutenção de Músicas e Álbuns"
    And autenticado como "Artista" com login "joy-division5"
    When eu informo que quero remover o lançamento "The Rise And the Fall of Ziggy Stardust"
    Then eu estou na página "Cadastro e Manutenção de Músicas e Álbuns"
    And vejo a mensagem "Não existe um lançamento 'The Rise And the Fall of Ziggy Stardust' para o artista!"

Scenario: Atualizando o subgênero de um lançamento
    Given eu estou na página "Cadastro e Manutenção de Músicas e Álbuns"
    And autenticado como "Artista" com login "rapper-de-anime123"
    And existe um lançamento para o artista "rapper-de-anime123" com os campos
    |Título            |Dan-da-Dan                              |
    |Gênero            |Rap                                     |
    |Categoria         |EP                                      |
    |Ano de lançamento |2024                                    |
    |Músicas           |Opening, Song1, Song2, Ending           |
    When eu informo que quero atualizar o lançamento "Dan-da-Dan"
    And eu informo o subgênero "Rap Japonês" para o lançamento
    Then eu estou na página "Perfil do Artista"
    And vejo a mensagem "Lançamento 'Dan-da-Dan' atualizado com sucesso!"
    And vejo o seguinte lançamento na aba "Discografia"
    |Título            |Dan-da-Dan                              |
    |Gênero            |Rap, Rap Japonês                        |
    |Categoria         |EP                                      |
    |Ano de lançamento |2024                                    |
    |Músicas           |Opening, Song1, Song2, Ending           |

Scenario: Removendo uma música de um lançamento
    Given eu estou na página "Cadastro e Manutenção de Músicas e Álbuns"
    And autenticado como "Artista" com login "rapper-de-anime123"
    And existe um lançamento para o artista "rapper-de-anime123" com os campos
    |Título            |Dan-da-Dan                              |
    |Gênero            |Rap                                     |
    |Categoria         |EP                                      |
    |Ano de lançamento |2024                                    |
    |Músicas           |Opening, Song1, Song2, Ending           |
    When eu informo que quero atualizar o lançamento "Dan-da-Dan"
    And eu tento excluir a música com título "Opening"
    Then eu estou na página "Perfil do Artista"
    And vejo a mensagem "Lançamento 'Dan-da-Dan' atualizado com sucesso!"
    And vejo o seguinte lançamento na aba "Discografia"
    |Título            |Dan-da-Dan                              |
    |Gênero            |Rap                                     |
    |Categoria         |EP                                      |
    |Ano de lançamento |2024                                    |
    |Músicas           |Song1, Song2, Ending                    |

Scenario: Atualizando o título de uma música de um lançamento
    Given eu estou na página "Cadastro e Manutenção de Músicas e Álbuns"
    And autenticado como "Artista" com login "nirvana14"
    And existe um lançamento para o artista "nirvana" com os campos
    |Título            |Nevermind                                                  |
    |Gênero            |Rock, Grunge                                               |
    |Categoria         |EP                                                         |
    |Ano de lançamento |2024                                                       |
    |Músicas           |Polly, Come As You Are, Heart-Shaped Box                   |
    When eu informo que quero atualizar o lançamento "Nevermind"
    And eu informo que quero modificar o título da música com nome "Polly"
    And eu informo o novo título "Polly (Versão Acústica)"
    Then eu estou na página "Perfil do Artista"
    And vejo a mensagem "Lançamento 'Nevermind' atualizado com sucesso"
    And vejo o seguinte lançamento na aba "Discografia"
    |Título            |Nevermind                                                  |
    |Gênero            |Rock, Grunge                                               |
    |Categoria         |EP                                                         |
    |Ano de lançamento |2024                                                       |
    |Músicas           |Polly (Versão Acústica), Come As You Are, Heart-Shaped Box |