import { loadFeature, defineFeature } from 'jest-cucumber';
import supertest from 'supertest';
import app from '../../src/app';
import MusicHistory from '../../src/entities/musichistory.entity'
import User from '../../src/entities/user.entity';
import Song from '../../src/entities/songs.entity';
import dbConn from '../../src/database/postgresConnection';
import { plainToClass } from 'class-transformer';
import Artist from '../../src/entities/artist.entity';
import Album from '../../src/entities/albuns.entity';

interface TopMusicAndArtists {
    posicao: number;
    nome: string;
    artist_login: string | null;
}

// Carregar a feature
const feature = loadFeature('tests/features/musichistoryget.feature');
const request = supertest(app);


defineFeature(feature, async (test) => {
    let response: supertest.Response;
    let bodyOfRequest = {}
    let mockedUser = new User()
    mockedUser.birthday = new Date()
    mockedUser.login = "qualquer_login"
    mockedUser.musicHistory = []
    mockedUser.name = "qualquer nome"
    mockedUser.password =  "senha qualquer"
    mockedUser.playlists = []
    mockedUser.recoveryexpire = 2
    mockedUser.recoverytoken = "aaaa"
    mockedUser.email = "vitinho@gmail.com"

    let mockerArtist = new Artist();
    mockerArtist.login = "art";
    mockerArtist.name= "artista";
    mockerArtist.email= "email";
    mockerArtist.password =  "123";

    let mockerAlbum = new Album();
    mockerAlbum.name = "album"
    mockerAlbum.qtd_songs= 2;
    mockerAlbum.genero = "tst";
    mockerAlbum.tipo= "tst";

    let mockerSong = new Song();
    mockerSong.path = 'test'


    
    
   

    test('Buscar todo o histórico de músicas', ({ given, when, then, and }) => {
        given('que a API está rodando e tem dados no histórico', async () => {
            expect(app).toBeDefined();
            await dbConn.getRepository(MusicHistory).delete({}); // deleta tudo para garantir que o cenario vai rodar certinho
            mockedUser = await dbConn.getRepository(User).save(mockedUser)
            for(let i = 0; i < 3; i++) {
                let song = await dbConn.getRepository(Song).save({ songID: i, name: `Test Song ${i}`, path:`test${i}`});
                await dbConn.getRepository(MusicHistory).save([{musicHistoryId: i, usuario: mockedUser, song}])
            }
            
        });

        when(/^eu faço uma requisição GET para "(.*)"$/, async (url) => {
            response = await request.get(url);
        });

        then(/^a resposta deve ter status (\d+)$/, (arg0) => {
            expect(response.status).toBe(parseInt(arg0, 10));
        });

        and('deve retornar uma lista de históricos de músicas', async () => {
            const result = plainToClass(MusicHistory,response.body);
            expect(result).toEqual(await dbConn.getRepository(MusicHistory).find({relations: {
                usuario: true,
                song: true
            },
            order: {
                musicHistoryId: "DESC"
            }
        }));
        });

        
    
    });

    test('apagar histórico de músicas', ({ given, when, then }) => {
        given('a api está rodando e tem dados no histórico', async () => {
            expect(app).toBeDefined();
            await dbConn.getRepository(MusicHistory).delete({}); // deleta tudo para garantir que o cenario vai rodar certinho
            mockedUser = await dbConn.getRepository(User).save(mockedUser)
            for(let i = 0; i < 3; i++) { // povoa o historico de musicas
                let song = await dbConn.getRepository(Song).save({ songID: i, name: `Test Song ${i}`, path:`test${i}`});
                await dbConn.getRepository(MusicHistory).save([{musicHistoryId: i, usuario: mockedUser, song}])
            }
        });

        when(/^o usuário de login "(.*)" faz uma requisição DELETE no endpoint "(.*)"$/, async (login, url) => {
            response = await request.delete(`${url}/${login}`);
        });

        then(/^o servidor retorna uma resposta "(.*)"$/, async (status) => {
            expect(response.status).toBe(parseInt(status, 10));
        });
    });

    test('mais escutados com apenas uma musica', async({given, when, then, and}) => {
        given('que a API está rodando', async () => {
            expect(app).toBeDefined();
        })
        and(/^o histórico de músicas do usuário contém a música de id "(.*)" do artista de login "(.*)" reproduzida "(.*)" vezes$/, async(musicName, artistLogin, vezes) => {
            mockerArtist.login = artistLogin;
            await dbConn.getRepository(Artist).save(mockerArtist);
            const userInstance = await dbConn.getRepository(User).save(mockedUser)
            mockerAlbum.artist = mockerArtist;
            mockerAlbum.songs = []
            for(let i = 1; i <= 3; i++) { // criado songs
                let song = await dbConn.getRepository(Song).save({ name: `Test Song ${i}`, path:`test${i}`});

                for(let j = 0; j< parseInt(vezes) && i == parseInt(musicName); j++) {
                    await dbConn.getRepository(MusicHistory).save([{ usuario: userInstance, song}])

                }
                
                mockerAlbum.songs.push(song);
            }
            
            const albumInstance = await dbConn.getRepository(Album).save(mockerAlbum); // criando album

           
            

            
        })
        when(/^o usuário de login "(.*)" faz uma requisição GET para o endpoint "(.*)"$/, async(userLogin, url) => {
            const userInstance = await dbConn.getRepository(User).findOne({where: {login: userLogin}})
            response = await request.get(`${url}/${userInstance?.userID}`);
        })
        then(/^o sistema retorna um status "(.*)"$/, async (status) => {
            expect(response.status).toBe(parseInt(status, 10));
        })
        and('uma lista contendo o top10 é retornada', async () => {
            expect(response.body).toEqual([{"artist_login": "art", "nome": "Test Song 1", "posicao": "1"}])
        })
    })

    test('top 5 músicas de 5 artistas no histórico', async({given, when, then, and}) => {
        given('que a API está rodando', async () => {
            expect(app).toBeDefined();
        })
        and('O histórico de musicas está preenchido', async () => {
            let mockerArtist1 = new Artist();
            mockerArtist1.login = "art1";
            mockerArtist1.name= "artista1";
            mockerArtist1.email= "email1";
            mockerArtist1.password =  "123";

            let mockerAlbum1 = new Album();
            mockerAlbum1.name = "album1"
            mockerAlbum1.genero = "tst";
            mockerAlbum1.tipo= "tst";

            
            await dbConn.getRepository(Artist).save(mockerArtist1);
            const userInstance = await dbConn.getRepository(User).save(mockedUser)
            mockerAlbum1.artist = mockerArtist1;
            mockerAlbum1.qtd_songs = 1
            mockerAlbum1.songs = []
            
            let song = await dbConn.getRepository(Song).save({ name: `1`, path:`test1`});

            for(let i = 0; i< 5; i++) {
                await dbConn.getRepository(MusicHistory).save({ usuario: userInstance, song})
            }
            mockerAlbum1.songs.push(song);
            await dbConn.getRepository(Album).save(mockerAlbum1); // criando album

            let mockerArtist2 = new Artist();
            mockerArtist2.login = "art2";
            mockerArtist2.name= "artista2";
            mockerArtist2.email= "email2";
            mockerArtist2.password =  "123";

            let mockerAlbum2 = new Album();
            mockerAlbum2.name = "album2"
            mockerAlbum2.qtd_songs= 1;
            mockerAlbum2.genero = "tst";
            mockerAlbum2.tipo= "tst";

            await dbConn.getRepository(Artist).save(mockerArtist2);
            
            mockerAlbum2.artist = mockerArtist2;
            mockerAlbum2.songs = []
            
            song = await dbConn.getRepository(Song).save({ name: `2`, path:`test2`});

            for(let i = 0; i< 4; i++) {
                await dbConn.getRepository(MusicHistory).save({ usuario: userInstance, song})
            }
            mockerAlbum2.songs.push(song);
            await dbConn.getRepository(Album).save(mockerAlbum2); // criando album

            let mockerArtist3 = new Artist();
            mockerArtist3.login = "art3";
            mockerArtist3.name= "artista3";
            mockerArtist3.email= "email3";
            mockerArtist3.password =  "123";

            let mockerAlbum3 = new Album();
            mockerAlbum3.name = "album3"
            mockerAlbum3.qtd_songs= 1;
            mockerAlbum3.genero = "tst";
            mockerAlbum3.tipo= "tst";

            await dbConn.getRepository(Artist).save(mockerArtist3);
            mockerAlbum3.artist = mockerArtist3;
            mockerAlbum3.songs = []
            
            song = await dbConn.getRepository(Song).save({ name: `3`, path:`test3`});

            for(let i = 0; i< 3; i++) {
                await dbConn.getRepository(MusicHistory).save({ usuario: userInstance, song})
            }
            mockerAlbum3.songs.push(song);
            await dbConn.getRepository(Album).save(mockerAlbum3); // criando album

            let mockerArtist4 = new Artist();
            mockerArtist4.login = "art4";
            mockerArtist4.name= "artista4";
            mockerArtist4.email= "email4";
            mockerArtist4.password =  "123";

            let mockerAlbum4 = new Album();
            mockerAlbum4.name = "album4"
            mockerAlbum4.qtd_songs= 1;
            mockerAlbum4.genero = "tst";
            mockerAlbum4.tipo= "tst";
            await dbConn.getRepository(Artist).save(mockerArtist4);
            mockerAlbum4.artist = mockerArtist4;
            mockerAlbum4.songs = []
            
            song = await dbConn.getRepository(Song).save({ name: `4`, path:`test4`});

            for(let i = 0; i< 2; i++) {
                await dbConn.getRepository(MusicHistory).save({ usuario: userInstance, song})
            }
            mockerAlbum4.songs.push(song);
            await dbConn.getRepository(Album).save(mockerAlbum4); // criando album

            let mockerArtist5 = new Artist();
            mockerArtist5.login = "art5";
            mockerArtist5.name= "artista5";
            mockerArtist5.email= "email5";
            mockerArtist5.password =  "123";

            let mockerAlbum5 = new Album();
            mockerAlbum5.name = "album5"
            mockerAlbum5.qtd_songs= 1;
            mockerAlbum5.genero = "tst";
            mockerAlbum5.tipo= "tst";

            await dbConn.getRepository(Artist).save(mockerArtist5);
            mockerAlbum5.artist = mockerArtist5;
            mockerAlbum5.songs = []
            
            song = await dbConn.getRepository(Song).save({ name: `5`, path:`test5`});

            for(let i = 0; i< 1; i++) {
                await dbConn.getRepository(MusicHistory).save({ usuario: userInstance, song})
            }
            mockerAlbum5.songs.push(song);
            await dbConn.getRepository(Album).save(mockerAlbum5); // criando album
        
        })

        when(/^o usuário de login "(.*)" faz uma requisição GET para o endpoint "(.*)"$/, async (userLogin, url) => {
            const userInstance = await dbConn.getRepository(User).findOne({where: {login: userLogin}})
            response = await request.get(`${url}/${userInstance?.userID}`);
        })
        then(/^o sistema retorna um status "(.*)"$/, async (status) => {
            expect(response.status).toBe(parseInt(status, 10));
        })
        and('o sistema retorna as musicas na ordem correta', async () => {
            expect(response.body).toEqual([{"artist_login": "art1", "nome": "1", "posicao": "1"},
                {"artist_login": "art2", "nome": "2", "posicao": "2"},
                {"artist_login": "art3", "nome": "3", "posicao": "3"},
                {"artist_login": "art4", "nome": "4", "posicao": "4"},
                {"artist_login": "art5", "nome": "5", "posicao": "5"}
            ])
        })
        
    })

    beforeAll(async () => {
        const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
        await sleep(1000) // eh necessario sleep para  esperar a api subir antes de realizar os testes
    
      });
    
    beforeEach(async () =>{
        
        const queryRunner = dbConn.createQueryRunner();
        // Obtém todas as entidades do dataSource
        const entities = dbConn.entityMetadatas
    
        for (const entityMetadata of entities) {
          const tableName = entityMetadata.tableName;
          console.log(`Deleting rows from table: ${tableName}`);
          await queryRunner.query(`TRUNCATE TABLE "${tableName}" CASCADE`);
        }
        console.log("All rows deleted.");
    
    })
       
          
              
      
    afterAll(async () => {
        await dbConn.destroy();  // Fecha a conexão após todos os testes
    });
    



    
})
