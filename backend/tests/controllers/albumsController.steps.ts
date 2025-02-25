import { loadFeature, defineFeature } from 'jest-cucumber';
import supertest from 'supertest';
import app from '../../src/app';
import dbConn from '../../src/database/postgresConnection';
import Album from '../../src/entities/albuns.entity';
import Artist from '../../src/entities/artist.entity';
import Songs from '../../src/entities/songs.entity'

const feature = loadFeature('../features/albunsService.feature');
const request = supertest(app);

defineFeature(feature, (test) => {
    let response: supertest.Response;
    let mockedArtist = new Artist()
    interface AlbumData {
        genero: string;
        subgenero: string;
        name: string;
        songs: string[];
        songs_paths: string[];
        artist_login: string;
        feat: string
    }
      
    const album_data: AlbumData = {
        genero: "",
        subgenero: "",
        name: "",
        songs: [],
        songs_paths: [],
        artist_login: "",
        feat: ""
    };

    test('Inserindo single no sistema', ({ given, when, and, then }) => {
        given(/^o usuario de login "(.*)" está autenticado como artista$/, async (arg0) => {
            const artistRepo = dbConn.getRepository(Artist)
            mockedArtist.login = arg0
            mockedArtist.name = "Joy Division"
            mockedArtist.email = "jd@gmail.com"
            mockedArtist.password = "pleasehelpme"
            mockedArtist.bio = "Banda Pioneira do Pós-Punk Inglês."
            artistRepo.save(mockedArtist)
        });

        when(/^o campo do body "(.*)" está preenchido com "(.*)"$/, async (arg0, arg1) => {
            if (arg0 === "genero"){
                album_data.genero = arg1;
            }
        });
      
        and(/^o campo "(.*)" está preenchido com "(.*)"$/, async (arg0, arg1) => {
            if(arg0 === "subgenero"){
                album_data.subgenero = arg1;
            }
        });
    
        and(/^o campo "(.*)" está preenchido com "(.*)"$/, async (arg0, arg1) => {
            if(arg0 === "name"){
                album_data.name = arg1;
            }
        });
    
        and(/^o campo "(.*)" está preenchido com "'(.*)'"$/, async (arg0, arg1) => {
            if(arg0 === "songs"){
                album_data.songs = [arg1];
            }
        });

        and(/^o campo "(.*)" está preenchido com "'(.*)'"$/, async (arg0, arg1) => {
            if(arg0 === "songs_paths"){
                album_data.songs_paths = [arg1];
            }
        });
    
        and(/^o campo "(.*)" está preenchido com "(.*)"$/, async (arg0, arg1) => {
            if(arg0 === "artist_login"){
                album_data.artist_login = arg1;
            }
        });
      
        and(/^uma requisição "(.*)" é feita no endpoint "(.*)"$/, async (arg0, arg1) => {
            if (arg0 === "POST"){
                response = await request.post(arg1).send(album_data);
            }

        });

        then(/^o sistema retorna o código "(.*)"$/, async (arg0) => {
            expect(response.status).toBe(parseInt(arg0));
        });

        and('o lançamento é registrado no banco de dados', async () => {
            let albumRepo = dbConn.getRepository(Album)
            let album = await albumRepo.find()
            let album_zero = album[0]
            expect(album_zero.artist = mockedArtist)
        });

        and(/^o campo "(.*)" está preenchido com "(.*)"$/, async (arg0, arg1) => {
            if (arg0 === "tipo"){
                expect(response.body.tipo).toBe(arg1);
            }
        });
    });

    interface UpdateRequest {
        songs: string[];
        artist_login: string;
    }

    let update_request : UpdateRequest  = {
        songs: [],
        artist_login: ""
    }


    test('atualizando um lançamento', ({ given, when, and, then }) => {
        given(/^o usuario de login "(.*)" está autenticado como artista$/, async (arg0) => {
            //feito no teste anterior
        });

        and(/^existe um lançamento com id "(.*)" para esse usuario$/, (arg0) => {
            //feito no teste anterior
        });

        and(/^o lançamento possui o campo "(.*)" com "(.*)"$/, (arg0, arg1) => {
            //feito no teste anterior
        });

        when(/^o campo do body "(.*)" esta preenchido com "'(.*)'"$/, async (arg0, arg1) => {
            if (arg0 === "songs"){
                update_request.songs = [arg1]
            }
        });

        and(/^o campo "(.*)" está preenchido com "(.*)"$/, async (arg0, arg1) => {
            if (arg0 === "artist_login"){
                update_request.artist_login = arg1
            }
        });

        and(/^uma requisição "(.*)" é feita no endpoint "(.*)"$/, async (arg0, arg1) => {
            if (arg0 === "PATCH"){
                response = await request.patch(arg1).send(update_request);
            }
        });

        then(/^o sistema retorna o código "(.*)"$/, async (arg0) => {
            expect(response.status).toBe(parseInt(arg0));
        });

        and(/^a musica atualizada agora se chama "'(.*)'"$/, async (arg0) => {
            let songRepo = dbConn.getRepository(Songs)
            let song = await songRepo.find()
            expect(song[0].name).toBe(arg0)
        });
        
    });

    let update_request2 : UpdateRequest  = {
        songs: [],
        artist_login: ""
    }

    test('falha ao atualizar música com campo nome vazio', ({ given, when, and, then }) => {
        given(/^o usuario de login "(.*)" está autenticado como artista$/, async (arg0) => {
            //feito no teste anterior
        });

        and(/^existe um lançamento com id "(.*)" para esse usuario$/, (arg0) => {
            //feito no teste anterior
        });

        and(/^o lançamento possui o campo "(.*)" com "'(.*)'"$/, (arg0) => {
            //feito no teste anterior
        });

        when(/^o campo do body "(.*)" está preenchido com "'(.*)'"$/, async (arg0, arg1) => {
            if (arg0 === "songs"){
                update_request2.songs = [arg1]
            }
        });

        and(/^o campo "(.*)" está preenchido com "(.*)"$/, async (arg0, arg1) => {
            if (arg0 === "artist_login"){
                update_request2.artist_login = arg1
            }
        });

        and(/^uma requisição "(.*)" é feita no endpoint "(.*)"$/, async (arg0, arg1) => {
            if (arg0 === "PATCH"){
                response = await request.patch(arg1).send(update_request2);
            }
        });

        then(/^o sistema retorna o código "(.*)"$/, async (arg0) => {
            expect(response.status).toBe(parseInt(arg0));
        });
        
    });

    interface DeleteRequest {
        artist_login : string;
    }

    let delete_request : DeleteRequest  = {
        artist_login : ""
    }

    test('removendo um lançamento do sistema', ({ given, when, and, then }) => {
        given(/^o usuario de login "(.*)" está autenticado como artista$/, async (arg0) => {
            //feito no teste anterior
        });

        and(/^existe um lancamento com id "(.*)" para esse usuario$/, (arg0) => {
            //feito no teste anterior
        });

        when(/^o campo do body "(.*)" está preenchido com "(.*)"$/, async (arg0, arg1) => {
            if (arg0 === "artist_login"){
                delete_request.artist_login = arg1
            }
        });

        and(/^uma requisição "(.*)" é feita no endpoint "(.*)"$/, async (arg0, arg1) => {
            if (arg0 === "DELETE"){
                response = await request.delete(arg1).send(delete_request);
            }
        });

        then(/^o sistema retorna o código "(.*)"$/, async (arg0) => {
            expect(response.status).toBe(parseInt(arg0));
        });

        and(/^o lançamento é removido do banco de dados$/, async () => {
            let albumRepo = dbConn.getRepository(Album)
            let album = await albumRepo.find()
            expect(album.length).toBe(0)
        });
      
        
    });

    
    beforeAll(async () => {
        const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
        await sleep(1000); // É necessário sleep para esperar a API subir antes de realizar os testes
        const queryRunner = dbConn.createQueryRunner();
        // Obtém todas as entidades do dataSource
        const entities = dbConn.entityMetadatas
    
        for (const entityMetadata of entities) {
          const tableName = entityMetadata.tableName;
          await queryRunner.query(`DELETE FROM "${tableName}"`);
        }
    });

    afterAll(async () => {
        const queryRunner = dbConn.createQueryRunner();
        // Obtém todas as entidades do dataSource
        const entities = dbConn.entityMetadatas
    
        for (const entityMetadata of entities) {
          const tableName = entityMetadata.tableName;
          await queryRunner.query(`DELETE FROM "${tableName}"`);
        }
        await dbConn.destroy(); // Fecha a conexão após todos os testes
    });
    
});