Scenario: mais escutados sem musicas armazenadas
Given o usuário “Thiago” de senha “senha123” está autenticado e tem o ID “2”
And nenhuma música está armazenada no histórico de Thiago
When quando o usuário faz uma requisição GET para o endpoint ‘/maisescutados/2’
Then o sistema retorna um status “200 OK”
And a resposta contém uma lista vazia

Scenario: mais escutados com apenas uma musica
Given o usuário “Thiago” de senha “senha123” está autenticado e tem o ID “2”
And o histórico de músicas do usuário contém a música “X” do artista “Carlos” reproduzida 10 vezes
When o usuário faz uma requisição GET para o endpoint ‘/maisescutados/2’
Then o sistema retorna um status “200 OK”
And uma lista contendo o artista “Carlos”, a música “X” e o número de reproduções igual a 10 é retornada

Scenario: mais escutados com apenas uma playlist
Given o usuário “Thiago” de senha “senha123” está autenticado e tem o ID “2”
And há apenas uma playlist de nome “Rock 2000” no histórico de playlists do usuário
And há apenas a música “X” de “Carlos” reproduzida 1 vez no histórico de músicas do usuário
When o usuário faz uma requisição GET para o endpoint ‘/maisescutados/2’
Then o sistema retorna um status “200 OK”
And a resposta contém o artista “Carlos”, a música “X”, reproduzida 1 vez, e a playlist “Rock 2000”

Scenario: top 5 músicas de 5 artistas no histórico 
Given o usuário “Thiago” de senha “senha123” está autenticado e tem o ID “2” 
And o histórico de músicas do usuário contém a música “A” de “Carlos” reproduzida 100 vezes 
And o histórico de músicas do usuário contém a música “B” de “Pedro” reproduzida 99 vezes 
And o histórico de músicas do usuário contém a música “C” de “Paulo” reproduzida 98 vezes 
And o histórico de músicas do usuário contém a música “D” de “Lucas” reproduzida 97 vezes 
And o histórico de músicas do usuário contém a música “E” de “Felipe” reproduzida 96 vezes 
And o histórico de músicas do usuário contém a música “F” de “Maria” reproduzida 95 vezes 
And o histórico de músicas do usuário contém a música “G” de “Fernando” reproduzida 94 vezes 
And o histórico de músicas do usuário contém a música “H” de “Breno” reproduzida 93 vezes 
And o histórico de músicas do usuário contém a música “I” de “Luna” reproduzida 92 vezes 
And o histórico de músicas do usuário contém a música “J” de “Cleiton” reproduzida 91 vezes 
And o histórico de músicas do usuário contém a música “K” de “Vitória” reproduzida 90 vezes 
When o usuário faz uma requisição GET para o endpoint ‘/maisescutados/2’ 
Then o sistema retorna um status “200 OK” 
And a resposta contém as 10 músicas mais reproduzidas em ordem decrescente 
And a resposta contém a música “A” de “Carlos” reproduzida 100 vezes 
And a resposta contém a música “B” de “Pedro” reproduzida 99 vezes 
And a resposta contém a música “C” de “Paulo” reproduzida 98 vezes 
And a resposta contém a música “D” de “Lucas” reproduzida 97 vezes 
And a resposta contém a música “E” de “Felipe” reproduzida 96 vezes 
And a resposta contém a música “F” de “Maria” reproduzida 95 vezes 
And a resposta contém a música “G” de “Fernando” reproduzida 94 vezes 
And a resposta contém a música “H” de “Breno” reproduzida 93 vezes 
And a resposta contém a música “I” de “Luna” reproduzida 92 vezes 
And a resposta contém a música “J” de “Cleiton” reproduzida 91 vezes

