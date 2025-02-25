Feature: Histórico de Músicas

Scenario: Buscar todo o histórico de músicas
Given que a API está rodando e tem dados no histórico
When eu faço uma requisição GET para "/musichistory"
Then a resposta deve ter status 200
And deve retornar uma lista de históricos de músicas



Scenario: apagar histórico de músicas
Given a api está rodando e tem dados no histórico
When o usuário de login "qualquer_login" faz uma requisição DELETE no endpoint "/musichistory"
Then o servidor retorna uma resposta "200"

Scenario: mais escutados com apenas uma musica
Given que a API está rodando
And o histórico de músicas do usuário contém a música de id "1" do artista de login "art" reproduzida "10" vezes
When o usuário de login "qualquer_login" faz uma requisição GET para o endpoint "/top10"
Then o sistema retorna um status "200"
And uma lista contendo o top10 é retornada

Scenario: top 5 músicas de 5 artistas no histórico 
Given que a API está rodando
And O histórico de musicas está preenchido
When o usuário de login "qualquer_login" faz uma requisição GET para o endpoint "/top10" 
Then o sistema retorna um status "200" 
And o sistema retorna as musicas na ordem correta