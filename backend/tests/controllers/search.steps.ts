import { loadFeature, defineFeature } from 'jest-cucumber';
import supertest from 'supertest';
import app from '../../src/app';
import dbConn from '../../src/database/postgresConnection';
import Playlist from '../../src/entities/playlist.entity';
import User from '../../src/entities/user.entity';
import Song from '../../src/entities/songs.entity';
import Artist from '../../src/entities/artist.entity';

const feature = loadFeature('../features/buscaPorFiltroService.feature');
const request = supertest(app);

defineFeature(feature, (test) => {

    const userRepo = dbConn.getRepository(User)
    const artistRepo = dbConn.getRepository(Artist)
    const songRepo = dbConn.getRepository(Song)
    const playlistRepo = dbConn.getRepository(Playlist)
  
    let response: supertest.Response;
    let bodyOfRequest = {}
    let mockedUser = new User()
    mockedUser.birthday = new Date()
    mockedUser.login = "rpol"
    mockedUser.musicHistory = []
    mockedUser.name = "Rodrigo Pontes"
    mockedUser.password =  "12345678"
    mockedUser.email = "rpol@cin.ufpe.br"
    mockedUser.playlists = []
    mockedUser.recoveryexpire = 2
    mockedUser.recoverytoken = "aaaa"


    test('Pesquisar sem um Filtro', ({ given, when, then, and }) => {
        given(/^O sistema possui um artista de nome "(.*)" e um de nome "(.*)", uma música de nome "(.*)" e uma de nome "(.*)"$/, async (arg0, arg1,arg2,arg3,arg4,arg5) => {
          let artist1 = new Artist()
          artist1.login = "lmpa"
          artist1.name = arg0
          artist1.email = "lmpa@cin.ufpe.br"
          artist1.password = "12345678"
          artist1.bio = "rip"
          artist1.albuns = []
          let artist2 = new Artist()
          artist2.login = "rpol"
          artist2.name = arg1
          artist2.email = "rpol@cin.ufpe.br"
          artist2.password = "12345678"
          artist2.bio = "rip"
          artist2.albuns = []
          let song1 = new Song()
          song1.name = arg2
          song1.path = "/Hello.mp3"
          song1.musicHistory = []
          let song2 = new Song()
          song2.name = arg3
          song2.path = "Hi.mp3"
          song2.musicHistory = []


          await userRepo.save(mockedUser)
          await artistRepo.save(artist1)
          await artistRepo.save(artist2)
          await songRepo.save(song1)
          await songRepo.save(song2)
        });
    
        when(/^O usuário realizo uma requisição "(.*)" ao sistema com endpoint "(.*)" com um parametro de query ds igual a "(.*)"$/, async (arg0, arg1, arg2) => {
          if(arg0 ==  'GET'){
            let endpointUsed = arg1+"?ds="+arg2
            response = await request.get(endpointUsed)
          }
        });
    
        then(/^O sistema deve me retornar o código "(.*)"$/, (arg0) => {
          expect(response.status).toBe(parseInt(arg0))
        });
    
        and(/^O sistema deveria me retornar os artistas de nome "(.*)", as músicas de nome "(.*)"$/, async (arg0, arg1,arg2) => {
          let artist = await artistRepo.findOne({where:{name:arg0}})
          let song = await songRepo.findOne({where:{name:arg1}})
          expect(response.body[0].name).toBe(artist?.name)
          expect(response.body[1].name).toBe(song?.name)
        });
      });

      test('Pesquisar com um Filtro', ({ given, when, then, and }) => {
        given(/^O sistema possui um artista de nome "(.*)", uma música de nome "(.*)" e uma playlist de nome "(.*)"$/, async (arg0, arg1,arg2) => {
          let artist1 = new Artist()
          artist1.login = "lmpa"
          artist1.name = arg0
          artist1.email = "lmpa@cin.ufpe.br"
          artist1.password = "12345678"
          artist1.bio = "rip"
          artist1.albuns = []

          let song1 = new Song()
          song1.name = arg1
          song1.path = "/Hello.mp3"
          song1.musicHistory = []

          let playlist1 = new Playlist()
          playlist1.categories = []
          playlist1.description = ""
          playlist1.name = arg2
          playlist1.saveCount = 0
          playlist1.songs = []
          playlist1.user = mockedUser


          await userRepo.save(mockedUser)
          await artistRepo.save(artist1)
          await songRepo.save(song1)
          await playlistRepo.save(playlist1)
        });
    
        when(/^O usuário realizo uma requisição "(.*)" ao sistema com endpoint "(.*)" com parametro de query ds igual a "(.*)" e filter a "(.*)"$/, async (arg0, arg1, arg2,arg3) => {
          if(arg0 ==  'GET'){
            let endpointUsed = arg1+"?ds="+arg2+"&filter="+arg3
            response = await request.get(endpointUsed)
          }
        });
    
        then(/^O sistema deve me retornar o código "(.*)"$/, (arg0) => {
          expect(response.status).toBe(parseInt(arg0))
        });
    
        and(/^O sistema deveria me retornar as playlists de nome "(.*)"$/, async (arg0, arg1,arg2) => {
          let artist = await artistRepo.findOne({where:{name:arg0}})
          expect(response.body[0].name).toBe(artist?.name)
        });
      });

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
          await queryRunner.query(`DELETE FROM "${tableName}"`);
        }
        console.log("All rows deleted.");
    
      })
       
          
              
      
      afterAll(async () => {
        await dbConn.destroy();  // Fecha a conexão após todos os testes
      });
});