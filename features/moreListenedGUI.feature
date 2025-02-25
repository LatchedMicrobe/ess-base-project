Feature: artistas/músicas/playlists mais escutadas
As a usuário cadastrado no aplicativo
I want to visualizar as músicas e artistas mais escutados no mês
So that eu posso analisar e compartilhar com os meus amigos o quanto eu gosto de tal música/artista/playlist

Scenario: indo para a página de mais escutados sem que tenha escutado nada no mês
Given o usuário “Thiago” está autenticado
And o usuário não tem histórico de reprodução de músicas no mês
And o usuário está na página “Perfil”
When o usuário seleciona a opção “Mais escutados”
Then é exibido uma mensagem de erro na tela
And o usuário é redirecionado para a “Perfil”

Scenario: indo para a página de mais escutados escutando apenas uma música
Given o usuário “Thiago” está na página “Perfil”
And o usuário escutou  a música “X” do cantor “Carlos” “10” vezes
When o usuário seleciona a opção “Mais escutados”
Then o usuário é redirecionado para a página “Mais escutados”
And é exibido na posição “1.” de “Artistas” o cantor “Carlos”
And é exibido na posição “1.” de “Músicas” a música “X” reproduzida umas “10” vezes
And a aba de “Playlists” está vazia

Scenario: indo para os mais escutados com apenas uma playlist
Given o usuário “Thiago” está na página “Perfil”
And o usuário escutou a playlist “Rock 2000”, reproduzindo a música “X” de “Carlos” “1” vez
When o usuário seleciona a opção “Mais escutados”
Then o usuário é redirecionado para a página “Mais escutados”
And é exibido na posição “1.” de “Artistas” o cantor “Carlos”
And é exibido na posição “1.” de “Músicas” a música “X” reproduzida “1” vez
And é exibido na posição “1.” de “Playlists” a playlist “Rock 2000”

Scenario: Mais escutados ao escutar 11 músicas no mês
Given o usuário “Thiago” está na página “Perfil”
And o usuário deu play na música “A” de “Carlos” “100” vezes
And o usuário deu play na música “B” de “Pedro” “99” vezes
And o usuário deu play na música “C” de “Paulo” “98” vezes
And o usuário deu play na música “D” de “Lucas” “97” vezes
And o usuário deu play na música “E” de “Felipe” “96” vezes
And o usuário deu play na música “F” de “Maria” “95” vezes
And o usuário deu play na música “G” de “Fernando” “94” vezes
And o usuário deu play na música “H” de “Breno” “93” vezes
And o usuário deu play na música “I” de “Luna” “92” vezes
And o usuário deu play na música “J” de “Cleiton” “91” vezes
And o usuário deu play na música “K” de “Vitória” “90” vezes
When o usuário  seleciona a opção “Mais escutados”
Then o usuário é redirecionado para a página “Mais escutados”
And é exibido na posição “1.” de “Artistas” o cantor “Carlos” e na posição “1” de “Músicas” a música “A” reproduzida “100” vezes
And é exibido na posição “2.” de “Artistas” o cantor “Pedro” e na posição “2” de “Músicas” a música “B” reproduzida “99” vezes
And é exibido na posição “3.” de “Artistas” o cantor “Paulo” e na posição “3” de “Músicas” a música “C” reproduzida “98” vezes
And é exibido na posição “4.” de “Artistas” o cantor “Lucas” e na posição “4” de “Músicas” a música “D” reproduzida “97” vezes
And é exibido na posição “5.” de “Artistas” o cantor “Felipe” e na posição “5” de “Músicas” a música “E” reproduzida “96” vezes
And é exibido na posição “6.” de “Artistas” o cantor “Maria” e na posição “6” de “Músicas” a música “F” reproduzida “95” vezes
And é exibido na posição “7.” de “Artistas” o cantor “Fernando” e na posição “7” de “Músicas” a música “G” reproduzida “94” vezes
And é exibido na posição “8.” de “Artistas” o cantor “Breno” e na posição “8” de “Músicas” a música “H” reproduzida “93” vezes
And é exibido na posição “9.” de “Artistas” o cantor “Luna” e na posição “9” de “Músicas” a música “I” reproduzida “92” vezes
And é exibido na posição “10.” de “Artistas” o cantor “Cleiton” e na posição “10” de “Músicas” a música “J” reproduzida “91” vezes

