Feature: Histórico de músicas
As a usuário cadastrado no aplicativo
I want to ver o histórico de músicas e artistas escutados
So that eu posso analisar quanto e como eu gasto o meu tempo escutando música

Scenario: exibir histórico de músicas
Given o usuário “Thiago” está no “Perfil”
And o usuário  escutou a música “X” do cantor “Carlos”
When o usuário  seleciona a opção “Histórico de músicas”
Then o usuário  está na página “Histórico de músicas”
And é exibido no histórico a música “X” do cantor “Carlos” no topo

Scenario: exibir histórico de playlists
Given o usuário “Thiago” está na “Perfil”
And o usuário  deu play numa playlist chamada “Rock 2000”
When o usuário  seleciona a opção “Histórico de Playlists”
Then o usuário  está na página “Histórico de Playlists”
And é exibido no histórico a playlists “Rock 2000” no topo

Scenario: apagar o histórico de músicas
Given o usuário “Thiago” está na página “Histórico de músicas”
And é exibido no histórico a música “X” do cantor “Carlos”
When o usuário seleciona a opção “Apagar histórico”
Then o usuário permanece em “Histórico de músicas”
And o histórico está vazio

Scenario: adicionar uma música no histórico de músicas
Given o usuário “Thiago” está na página “Histórico de músicas”
And o histórico está vazio
When o usuário vai para a página “Página Inicial”
And seleciona a música “X” do cantor “Carlos”
And o usuário vai para a página “Histórico de músicas”
Then o usuário permanece em “Histórico de músicas”
And a música “X” do cantor “Carlos” é exibida no topo do histórico

Scenario: adicionar uma playlist no histórico de playlists
Given o usuário “Thiago” está na página “Histórico de Playlists”
And o histórico está vazio
When o usuário vai para a página “Página Inicial”
And seleciona a playlist “Rock 2000” e dá play
And o usuário vai para a página “Histórico de Playlists”
Then o usuário permanece em “Histórico de Playlists”
And a playlist “Rock 2000” é exibida no topo do histórico

Scenario: colocando uma música no topo do histórico
Given o usuário “Thiago” está na página “Histórico de Músicas”
And a música “X” do cantor “Carlos” e a música “Y” do cantor “Pedro” estão exibidas no histórico
And a música “X” está acima da música “Y”
When o usuário vai para a “Página Inicial”
And seleciona a música “Y” do cantor “Pedro” e dá play
And o usuário vai para o “Histórico de Músicas”
Then o usuário permanece em “Histórico de Músicas”
And a música “Y” está no topo, enquanto a música “X” está abaixo
