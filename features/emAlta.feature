Feature: Visualizar e interagir com músicas na seção Em Alta
    As a Usuário autenticado no aplicativo
    I want Visualizar e interagir com as músicas mais populares na seção Em Alta
    So that Eu possa ouvir e descobrir as músicas mais tocadas no momento 

    Scenario: Exibir músicas na seção "Em Alta"
        Given O usuário "João" está autenticado no sistema
        And Existem músicas categorizadas como "Em Alta" no banco de dados
        When O usuário acessa a página inicial do aplicativo
        Then O sistema exibe a seção "Em Alta" com uma lista de músicas populares
        And Cada música deve conter:O título da música, nome do artista e a capa do álbum (ou imagem associada)
    
    Scenario: Exibir mensagem quando não há músicas em alta
        Given O usuário "Clara" acessa a seção "Em Alta"
        And Não existem músicas selecionadas como "Em Alta" no banco de dados
        When O sistema carrega a seção "Em Alta"
        Then O sistema exibe a mensagem "Nenhuma música em alta no momento"
        And Não exibe nenhum item na seção