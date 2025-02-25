import { loadFeature, defineFeature } from 'jest-cucumber';
import supertest from 'supertest';
import app from '../../src/app';
import dbConn from '../../src/database/postgresConnection';
import Playlist from '../../src/entities/playlist.entity';
import User from '../../src/entities/user.entity';
import Category from '../../src/entities/category.entity';
import { mock } from 'node:test';
import userRoutes from '../../src/routes/user.routes';
import exp from 'constants';
import { In } from 'typeorm';


const feature = loadFeature('../features/categoriaService.feature');
const request = supertest(app);




defineFeature(feature, (test) => {

  const userRepo = dbConn.getRepository(User)
  const categoryRepo = dbConn.getRepository(Category)
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
  

  test('Adicionar categoria a uma playlist na edição de uma playlist', ({ given, when, and, then }) => {
    
    given(/^O sistema tem as categorias de nome "(.*)" e "(.*)"$/, async (arg0,arg1) => {
      
      let category1 = new Category()
      let category2 = new Category()

      category1.categoryName = arg0
      category2.categoryName = arg1
      await categoryRepo.save(category1)
      await categoryRepo.save(category2)

    });

    and(/^O usuário tem uma playlist de nome "(.*)" cadastrada no sistema$/, async (arg0) => {
      let playlist = new Playlist()
      playlist.name = arg0
      playlist.description = "Rock ne papai"
      playlist.saveCount = 0
      playlist.categories = []
      playlist.songs = []
      playlist.user = mockedUser
      await userRepo.save(mockedUser)
      await playlistRepo.save(playlist) 
    });

    when(/^O usuário manda uma requisição "(.*)" no endpoint "(.*)", com o ID da playlist de nome "(.*)", cujo body possui os ids das categorias de nome "(.*)" e a de nome "(.*)" em categories$/, async (arg0, arg1,arg2,arg3,arg4) => {


      const playlist = await playlistRepo.findOne({where:{user:mockedUser}})
      const category12 = await categoryRepo.findOne({where:{categoryName:arg3}})
      const category22 = await categoryRepo.findOne({where:{categoryName:arg4}})

      bodyOfRequest = {
        "name":playlist?.name,
        "description":playlist?.description,
        "categories":[category12?.categoryID,category22?.categoryID],
        "saveCount":0,
        "songIds":[]
      }
      
      if(arg0 == "PUT"){
        response = await request.put(arg1+"/"+playlist?.playlistID.toString()).send(bodyOfRequest)
      }
      
      
    });
    then(/^O sistema deve retornar o código "(.*)"$/, async (arg0) => {
      expect(response.status).toBe(parseInt(arg0))
    });

    and(/^O sistema deveria ter as categorias de nome "(.*)" e de nome "(.*)" cadastrada nessa playlist$/, async (arg0,arg1) => {
      
      const category1 = await categoryRepo.findOne({where:{categoryName:arg0}})
      const category2 = await categoryRepo.findOne({where:{categoryName:arg1}})
      const playlist = await playlistRepo.findOne({where:{user:mockedUser}, relations:["categories"]})

      expect(playlist?.categories).toStrictEqual([category1,category2])

    });

  });

  test('Excluir categoria de uma playlist na edição de uma playlist', ({ given, when, and, then }) => {
    
    given(/^O sistema tem as categorias de nome "(.*)"$/, async (arg0) => {
      
      let category1 = new Category()

      category1.categoryName = arg0
      await categoryRepo.save(category1)

    });

    and(/^O usuário tem uma playlist de nome "(.*)" cadastrada no sistema que tem a categoria de nome "(.*)"$/, async (arg0,arg1) => {
      const category12 = await categoryRepo.findOne({where:{categoryName:arg1}})
      let playlist = new Playlist()
      if(category12 != null){
        playlist.name = arg0
        playlist.description = "Funk ne papai"
        playlist.saveCount = 0
        playlist.categories = [category12]
        playlist.songs = []
      }
      
      playlist.user = mockedUser
      await userRepo.save(mockedUser)
      await playlistRepo.save(playlist) 
    });
    when(/^O usuário manda uma requisição "(.*)" no endpoint "(.*)", com o ID da playlist de nome "(.*)", cujo body não possui os ids das categorias de nome "(.*)" em categories$/, async (arg0, arg1,arg2,arg3) => {


      const playlist = await playlistRepo.findOne({where:{user:mockedUser}})
      const category12 = await categoryRepo.findOne({where:{categoryName:arg3}})


      bodyOfRequest = {
        "name":playlist?.name,
        "description":playlist?.description,
        "categories":[],
        "saveCount":0,
        "songIds":[]
      }
      
      if(arg0 == "PUT"){
        response = await request.put(arg1+"/"+playlist?.playlistID.toString()).send(bodyOfRequest)
      }
      
      
    });
    then(/^O sistema deve retornar o código "(.*)"$/, async (arg0) => {
      expect(response.status).toBe(parseInt(arg0))
    });

    and(/^O sistema não deveria ter as categorias de nome "(.*)" cadastrada nessa playlist$/, async (arg0) => {
      
      const category1 = await categoryRepo.findOne({where:{categoryName:arg0}})
      const playlist = await playlistRepo.findOne({where:{user:mockedUser}, relations:["categories"]})

      expect(playlist?.categories).not.toStrictEqual(category1)

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