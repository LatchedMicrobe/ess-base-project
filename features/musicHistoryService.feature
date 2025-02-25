Scenario: exibir histórico de músicas
Given o usuário “Thiago” de senha “senha123” está autenticado e tem o ID “2”
When o usuário faz uma requisição “GET” no endpoint “/historicomusica/2”
Then o servidor retorna um status “200” OK”
And a resposta contém uma lista com o histórico do usuário

Scenario: exibir histórico de playlists
Given o usuário “Thiago” de senha “senha123” está autenticado e tem o ID “2”
When o usuário faz uma requisição “GET” no endpoint “/historicoplaylist/2”
Then o servidor retorna um status “200 OK”
And a resposta contém uma lista com o histórico do usuário

Scenario: apagar histórico de músicas
Given o usuário “Thiago” de senha “senha123” está autenticado e tem o ID “2”
When o usuário faz uma requisição DELETE no endpoint “/historicomusica/2”
Then o servidor retorna uma resposta “204 No Content”

Scenario: “adicionar” música no histórico vazio
Given o usuário “Thiago” de senha “senha123” está autenticado e tem o ID “2”
And o histórico de músicas do usuário está vazio
When o usuário “Thiago” faz uma requisição “POST” em ‘/historicomusica/2” com uma música de ID “99”
Then o sistema retorna “201 Created”
And a música de ID “99” é adicionada ao histórico do usuário

Scenario: “adicionar” playlist no histórico vazio
Given o usuário “Thiago” de senha “senha123” está autenticado e tem o ID “2”
And o histórico de playlists do usuário está vazio
When o usuário “Thiago” faz uma requisição “POST” em ‘/historicoplaylist/2’ com uma playlist de ID “99”
Then o sistema retorna “201 Created”
And a playlist de ID “99” é adicionada ao histórico do usuário

Scenario: “adicionar” música no histórico preenchido 
Given o usuário “Thiago” de senha “senha123” está autenticado e tem o ID “2”
And a música com ID “35”  está armazenada em ‘/historicomusica/2”
When o usuário “Thiago” faz uma requisição “POST” em ‘/historicomusica/2” com uma música de ID “99”
Then o sistema retorna “200 OK”
And o histórico de músicas do usuário é atualizado com os IDs “99” e “35”, nessa ordem
