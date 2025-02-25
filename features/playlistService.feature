Feature: playlist


Scenario: Criação de playlist
Given O usuário de email "ricardo@gmail.com" não tem nenhuma playlist cadastrada no sistema
When O body da requisição possui UserID como o id do usuário de email "ricardo@gmail.com", nome como "Minha playlist" e descrição como "As melhores do pop"
And Uma requisição "POST" é feita no endpoint "/playlists"
Then O sistema retorna o código "201"
And A nova playlist é criada no banco de dados

Scenario: Remoção de playlist
Given O usuário de email "ricardo@gmail.com" tem uma playlist de nome "Minha Playlist" cadastrado no sistema
When Uma requisição "DELETE" é feita no endpoint "/playlists" com o ID da playlist do usuário
Then O sistema retorna o cógigo "200"
And A playlist é excluida do sistema 

Scenario: Obter todas as playlists de um usuário
Given O usuário de email "ricardo@gmail" tem "2" playlists cadastradas
When Uma requisição "GET" é feita no endpoint "/playlists" tendo um parametro de query igual ao ID do usuário com email "ricardo@gmail"
Then O sistema retorna o código "200"
And é retornado com as informações das "2" pĺaylists do usuário de email "ricardo@gmail"

Scenario: Adicionar uma nova música em uma playlist
Given o usuário possui uma playlist de nome "o melhor do pop"
And Deseja-se adicionar uma música de nome "Welcome to the  jungle" já previamente criada no sistema
When o body da requisição possui songIDs como o id da música cadastrada
And Uma requisição "PUT" é feita no endpoint "/playlists" com o ID da playlist de nome "o melhor do pop"
Then O sistema deve retornar código "200"
And A nova música é adicionada na playlist

Scenario: Remover uma música de uma playlist
Given O usuário possui uma playlist de nome "o melhor do rock" que contém uma música de nome "welcome to the jungle"
When o body da requisição possui songIDs como vazio
And Uma requisição "PUT" é feita no endpoint "/playlists" com o ID da playlist de nome "o melhor do rock"
Then O sistema deve retornar código "200"
And A playlist não deve ter nenhuma música


