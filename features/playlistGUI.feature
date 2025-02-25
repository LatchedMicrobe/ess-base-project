Feature: Playlist
    As a usuário
    I want to criar, atualizar e remover playlists
    So that eu poderei organizar minhas músicas favoritas

    

Scenario: Criar uma nova playlist
Given O usuário está na página de "Biblioteca"
When O usuário seleciona para "adicionar uma nova playlist"
Then uma nova playlist vazia e sem nome é adicionada na biblioteca do usuário
And O usuário continua na página de "Biblioteca"

Scenario: Remover uma playlist
Given O usuário está na página de "Biblioteca"
And O usuário tem as playlists "só as pisadinhas" e "Sofrendo demais"
When O usuário seleciona para remover a playlist "só as pisadinhas"
Then O usuário tem apenas a playlist "Sofrendo demais"
And o usuário continua na página de "Biblioteca"

Scenario: Atualizar nome de playlist
Given O usuário está na página de "Biblioteca"
And O usuário tem a playlist "Só as pisadinhas"
When O usuário seleciona para editar a playlist "Só as pisadinhas"
And O usuário escolhe o nome "KPOP de cria"
Then O usuário tem a playlist "KPOP de cria"
And o usuário continua na página de "Biblioteca"

Scenario: Adicionar música em uma playlist
Given O usuário está na página de "Busca"
And O usuário tem a playlist "É ROOOOCK" com as músicas "Welcome to the Jungle" e "Back in Black"
When O usuário busca a múscia "Smoke On the Water"
And seleciona para adicionar a música "Smoke On the Water" na playlist "É ROOOOCK"
Then O usuário tem a playlist "É ROOOOCK" com as músicas "Welcome to the Jungle","Back in Black" e "Smoke On the Water"
And O usuário continua na página de "Busca"

Scenario: Remover música de uma playlist
Given O usuário está na página de "Biblioteca"
And O usuário tem a playlist "É ROOOOCK" com as músicas "Welcome to the Jungle" e "Back in Black"
When O usuário deleta a música "Back in Black" da playlist "É ROOOOCK"
Then O usuário tem a playlist "É ROOOOCK" com a música "Welcome to the Jungle"
And O usuário continua na página de "Biblioteca"

Scenario: Adicionar uma playlist pública na biblioteca do usuário
Given O usuário está na página "Busca"
And O usuário tem a playlist "É ROOOOCK"
When O usuário busca a playlist "Só as melhores do pop"
And O usuário seleciona para adicionar a playlist "Só as melhores do pop" na sua biblioteca
Then O usuário tem as playlists "É ROOOOCK" e "Só as melhores do pop"
And O usuário continua na página de "Busca"

Scenario: Adicionar uma música que já existe na playlist
Given O usuário está na página "Busca"
And O usuário tem a playlist "É ROOOOCK" com a música "Welcome to the Jungle"
When O usuário busca a música "Welcome to the Jungle"
And O usuário tenta adicionar a música "Welcome to the Jungle" na playlist "É ROOOOCK"
Then Uma mensagem de erro escrita: "Música já existe na playlist" é mostrada
And O usuário continua na página de "Busca"

Scenario: Adicionar música na playlist de curtidas
Given O usuário tem a playlist "Curtidas" com a música "Back in Black"
And O usuário está na página de "Busca"
When O usuário busca a música "Welcome to the Jungle" 
And O usuário seleciona para curtir a música "Welcome to the Jungle"
Then O usuário tem a playlist "Curtidas" com as músicas "Back in black" e "Welcome to the Jungle"
And O usuário continua na página de "Busca"

