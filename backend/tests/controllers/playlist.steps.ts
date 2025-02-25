import { loadFeature, defineFeature } from 'jest-cucumber';
import supertest from 'supertest';
import app from '../../src/app';
import dbConn from '../../src/database/postgresConnection';
import Playlist from '../../src/entities/playlist.entity';
import User from '../../src/entities/user.entity';
import Song from '../../src/entities/songs.entity';



const feature = loadFeature('../features/playlistService.feature');
const request = supertest(app);




defineFeature(feature, (test) => {

  let response: supertest.Response;
  let bodyOfRequest = {}
  let mockedUser = new User()
  mockedUser.birthday = new Date()
  mockedUser.login = "qualquer login"
  mockedUser.musicHistory = []
  mockedUser.name = "qualquer nome"
  mockedUser.password =  "senha qualquer"
  mockedUser.playlists = []
  mockedUser.recoveryexpire = 2
  mockedUser.recoverytoken = "aaaa"

  test('Criação de playlist', ({ given, when, and, then }) => {
    given(/^O usuário de email "(.*)" não tem nenhuma playlist cadastrada no sistema$/, async (arg0) => {
      const userRepo = dbConn.getRepository(User)
      mockedUser.email = arg0
      await userRepo.save(mockedUser)
      
    });

    when(/^O body da requisição possui UserID como o id do usuário de email "(.*)", nome como "(.*)" e descrição como "(.*)"$/, async (arg0, arg1, arg2) => {
      const userRepo = dbConn.getRepository(User)
      let userFound  = await userRepo.findOne({where:{email:arg0}})
    
      bodyOfRequest = {"userId":userFound?.userID,"name":arg1,"description":arg2}
    });

    and(/^Uma requisição "(.*)" é feita no endpoint "(.*)"$/, async (arg0, arg1) => {
      if(arg0 == "POST"){
         response = await request.post(arg1).send(bodyOfRequest)
      }
    });


    then(/^O sistema retorna o código "(.*)"$/, async (arg0) => {
      expect(response.status).toBe(parseInt(arg0))
    });

    and('A nova playlist é criada no banco de dados', async () => {
      let playlistRepo = dbConn.getRepository(Playlist)
      let playlist = await playlistRepo.find()
      let onePlaylist = playlist[0]
      expect(onePlaylist.user = mockedUser)

    });
  });

  test('Remoção de playlist', ({ given, when, then, and }) => {
    given(/^O usuário de email "(.*)" tem uma playlist de nome "(.*)" cadastrado no sistema$/, async (arg0, arg1) => {
      const userRepo = dbConn.getRepository(User)
      mockedUser.email = arg0
      await userRepo.save(mockedUser)
      const playlistRepo = dbConn.getRepository(Playlist)
      const playlist = new Playlist()
      playlist.categories = []
      playlist.description =  "qualquer descricao"
      playlist.name = arg1
      playlist.saveCount = 0
      playlist.songs = []
      playlist.user = mockedUser
      await playlistRepo.save(playlist)

    });

    when(/^Uma requisição "(.*)" é feita no endpoint "(.*)" com o ID da playlist do usuário$/, async (arg0, arg1) => {
      if(arg0 == 'DELETE'){
        const playlistRepo = dbConn.getRepository(Playlist)
        let playlist = await playlistRepo.findOne({where:{user:mockedUser}})
        response = await request.delete(arg1+"/"+playlist?.playlistID.toString())
      }
  
    });

    then(/^O sistema retorna o cógigo "(.*)"$/, (arg0) => {
      expect(response.status).toBe(parseInt(arg0))
    });

    and('A playlist é excluida do sistema', async () => {
      const playlistRepo = dbConn.getRepository(Playlist)
      let playlist = await playlistRepo.findOne({where:{user:mockedUser}})
      expect(playlist).toBe(null)
    });
  });

  test('Obter todas as playlists de um usuário', ({ given, when, then, and }) => {
    given(/^O usuário de email "(.*)" tem "(.*)" playlists cadastradas$/, async (arg0, arg1) => {
      mockedUser.email = arg0
      const userRepo = dbConn.getRepository(User)
      await userRepo.save(mockedUser)
      const playlistRepo = dbConn.getRepository(Playlist)
      for(let i=0;i<arg1;i++){
        let playlist = new Playlist()
        playlist.categories = []
        playlist.description = "playlist de ordem "+i.toString()
        playlist.name = "nome "+i.toString()
        playlist.saveCount = 0
        playlist.songs = []
        playlist.user = mockedUser
        await playlistRepo.save(playlist)
      }
    });

    when(/^Uma requisição "(.*)" é feita no endpoint "(.*)" tendo um parametro de query igual ao ID do usuário com email "(.*)"$/, async (arg0, arg1, arg2) => {
      if(arg0 ==  'GET'){
        const userRepo = dbConn.getRepository(User)
        let user = await userRepo.findOne({where:{email:arg2}})
        let endpointUsed = arg1+"?userId="+user?.userID.toString()
        response = await request.get(endpointUsed)
      }
    });

    then(/^O sistema retorna o código "(.*)"$/, (arg0) => {
      expect(response.status).toBe(parseInt(arg0))
    });

    and(/^é retornado com as informações das "(.*)" pĺaylists do usuário de email "(.*)"$/, async (arg0, arg1) => {
      const playlistRepo = dbConn.getRepository(Playlist)
      let playlists = await playlistRepo.find({where:{user:mockedUser}})
      for(let i=0;i<parseInt(arg0);i++){
        expect(response.body[i].playlistID).toBe(playlists[i].playlistID)
      }
    });
  });

  test('Adicionar uma nova música em uma playlist', ({ given, and, when, then }) => {
    given(/^o usuário possui uma playlist de nome "(.*)"$/, async (arg0) => {
      mockedUser.email = "qualqueremail@gmail.com"
      const userRepo = dbConn.getRepository(User)
      await userRepo.save(mockedUser)

      const playlistRepo = dbConn.getRepository(Playlist)

      let playlist = new Playlist()
      playlist.categories = []
      playlist.description = "oi"
      playlist.name = arg0
      playlist.saveCount = 0
      playlist.songs = []
      playlist.user = mockedUser
      await playlistRepo.save(playlist)
    });

    and(/^Deseja-se adicionar uma música de nome "(.*)" já previamente criada no sistema$/, async (arg0) => {
      let song = new Song()
      song.name = arg0
      song.path = "pathqualquer"
      song.views = 1
      const songRepo = dbConn.getRepository(Song)
      await songRepo.save(song)
    });

    when('o body da requisição possui songIDs como o id da música cadastrada', async () => {
      const playlistRepo = dbConn.getRepository(Playlist)
      const playlist = await playlistRepo.findOne({where:{user:mockedUser}})

      const songRepo = dbConn.getRepository(Song)
      const song =  await songRepo.findOne({where:{views:1}})
      bodyOfRequest = {
        "name":playlist?.name,
        "description":playlist?.description,
        "categories":[],
        "saveCount":0,
        "songIds":[song?.songID]
      } 
    });

    and(/^Uma requisição "(.*)" é feita no endpoint "(.*)" com o ID da playlist de nome "(.*)"$/, async (arg0, arg1, arg2) => {
      if(arg0 == "PUT"){
        const playlistRepo = dbConn.getRepository(Playlist)
        const playlist = await playlistRepo.findOne({where:{user:mockedUser}})
        
        let endpointUsed = arg1+"/"+playlist?.playlistID.toString()
        console.log(endpointUsed)
        response = await request.put(endpointUsed).send(bodyOfRequest)
        console.log(response.body)
      }
    });


    then(/^O sistema deve retornar código "(.*)"$/, (arg0) => {
      expect(response.status).toBe(parseInt(arg0))
    });

    and('A nova música é adicionada na playlist', async () => {
      const playlistRepo = dbConn.getRepository(Playlist)
      const playlist = await playlistRepo.findOne({where:{user:mockedUser}, relations:["songs"]})
      expect(playlist?.songs).toHaveLength(1)
    });
  });

  test('Remover uma música de uma playlist', ({ given, when, and, then }) => {
    given(/^O usuário possui uma playlist de nome "(.*)" que contém uma música de nome "(.*)"$/, async (arg0, arg1) => {
      mockedUser.email = "qualqueremail@gmail.com"
      const userRepo = dbConn.getRepository(User)
      await userRepo.save(mockedUser)

      const playlistRepo = dbConn.getRepository(Playlist)

      
      let song = new Song()
      song.name = arg1
      song.path = "qualquer"
      song.views = 0;
      
      const songRepo = dbConn.getRepository(Song)
      let songAdded = await songRepo.save(song)

      let playlist = new Playlist()
      playlist.categories = []
      playlist.description = "oi"
      playlist.name = arg0
      playlist.saveCount = 0
      playlist.songs = [songAdded]
      playlist.user = mockedUser
      await playlistRepo.save(playlist)

    });

    when('o body da requisição possui songIDs como vazio', async () => {
      const playlistRepo = dbConn.getRepository(Playlist)
      const playlist = await playlistRepo.findOne({where:{user:mockedUser}})
      
      bodyOfRequest = {
        "name":playlist?.name,
        "description":playlist?.description,
        "categories":[],
        "saveCount":0,
        "songIds":[]
      } 
    });

    and(/^Uma requisição "(.*)" é feita no endpoint "(.*)" com o ID da playlist de nome "(.*)"$/, async (arg0, arg1, arg2) => {
      if(arg0 == "PUT"){
        const playlistRepo = dbConn.getRepository(Playlist)
        const playlist = await playlistRepo.findOne({where:{user:mockedUser}})
        
        let endpointUsed = arg1+"/"+playlist?.playlistID.toString()
        response = await request.put(endpointUsed).send(bodyOfRequest)
      }
    });

    then(/^O sistema deve retornar código "(.*)"$/, (arg0) => {
      expect(response.status).toBe(parseInt(arg0))
    });

    and('A playlist não deve ter nenhuma música', async () => {
      const playlistRepo = dbConn.getRepository(Playlist)
      const playlist = await playlistRepo.findOne({where:{user:mockedUser}, relations:["songs"]})
      expect(playlist?.songs).toHaveLength(0)
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
