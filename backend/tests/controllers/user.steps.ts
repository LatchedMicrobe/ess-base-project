import { loadFeature, defineFeature } from "jest-cucumber";
import supertest from 'supertest';
import app from '../../src/app';
import dbConn from "../../src/database/postgresConnection";
import User from "../../src/entities/user.entity";
import { assert } from "console";
import { notEqual } from "assert";

const feature = loadFeature('../features/userService.feature');
const request = supertest(app);

defineFeature(feature, (test) => {

  const userRepo = dbConn.getRepository(User)
  let response: supertest.Response;
  let bodyOfRequest = {}

  beforeEach( async () => {
    const queryRunner = dbConn.createQueryRunner();
    // Obtém todas as entidades do dataSource
    const entities = dbConn.entityMetadatas

    for (const entityMetadata of entities) {
      const tableName = entityMetadata.tableName;
      await queryRunner.query(`DELETE FROM "${tableName}"`);
    }

    bodyOfRequest = {}
  })

  beforeAll( async () => {
    const sleep = (ms : number) => new Promise(resolve => setTimeout(resolve, ms));
    await sleep(1000)
  });

  afterAll(async () => {
    await dbConn.destroy()
  })

  test('Deleção de Usuário no Sistema', ({ given, when, then, and }) => {
      given(/^existe um usuário de login "(.*)"$/, async (arg0) => {
        let mockedUser = new User()
        mockedUser.email = "joaodopedefeijao@gmail.com"
        mockedUser.login = arg0
        mockedUser.name = "joão"
        mockedUser.password = "123456"
        mockedUser.recoveryexpire = null
        mockedUser.recoverytoken = null

        const userRepo = dbConn.getRepository(User)
        await userRepo.save(mockedUser)
      });

      when(/^uma requisição DELETE é feita no endpoint "(.*)"$/, async (arg0) => {
        response = await request.delete(arg0)
      });

      then(/^o usuário de login "(.*)" é removido no banco de dados$/, async (arg0) => {
        let userFound  = await userRepo.findOne({where:{login:arg0}})
        expect(userFound).toBe(null)
      });

      and(/^o sistema retorna o código "(.*)"$/, (arg0) => {
        expect(response.status).toBe(parseInt(arg0))
      });
  });

  test('Cadastro de Usuário no Sistema com Sucesso', ({ given, and, when, then }) => {
      given(/^não existe usuário com o login "(.*)"$/, async (arg0) => {
        let userFound  = await userRepo.findOne({where:{login:arg0}})
        if(userFound) { userRepo.delete(userFound.userID)}
      });

      and(/^não existe usuário com o e-mail "(.*)"$/, async (arg0) => {
        let userFound  = await userRepo.findOne({where:{email:arg0}})
        if(userFound) { userRepo.delete(userFound.userID)}
      });

      when(/^o body da requisição possui name: "(.*)"$/, (arg0) => {
        (bodyOfRequest as any).name = arg0
      });

      and(/^o body da requisição possui login: "(.*)"$/, (arg0) => {
        (bodyOfRequest as any).login = arg0
      });

      and(/^o body da requisição possui email: "(.*)"$/, (arg0) => {
        (bodyOfRequest as any).email = arg0
      });

      and(/^o body da requisição possui password: "(.*)"$/, (arg0) => {
        (bodyOfRequest as any).password = arg0
      });

      and(/^uma requisição POST é feita no endpoint "(.*)"$/, async (arg0) => {
        response = await request.post(arg0).send(bodyOfRequest)
      });

      then(/^o sistema retorna o código "(.*)"$/, (arg0) => {
        expect(response.status).toBe(parseInt(arg0))
      });

      and('o usuário é cadastrado no banco de dados com as informações do body', async () => {
        let userFound  = await userRepo.findOne({where:{login:(bodyOfRequest as any).login}})
        expect(userFound).not.toBe(null)
        expect(userFound?.password).toStrictEqual((bodyOfRequest as any).password)
        expect(userFound?.name).toStrictEqual((bodyOfRequest as any).name)
        expect(userFound?.email).toStrictEqual((bodyOfRequest as any).email)
      });
  });

  test('Falha de Cadastro de Usuário no Sistema por Dados Repetidos', ({ given, when, and, then }) => {
      given(/^existe usuário com o login "(.*)"$/, async (arg0) => {
        let mockedUser = new User()
        mockedUser.email = "dggb@gmail.com"
        mockedUser.login = arg0
        mockedUser.name = "david warrior"
        mockedUser.password = "123456"
        mockedUser.recoveryexpire = null
        mockedUser.recoverytoken = null

        const userRepo = dbConn.getRepository(User)
        await userRepo.save(mockedUser)
      });

      when(/^o body da requisição possui name: "(.*)"$/, (arg0) => {
        (bodyOfRequest as any).name = arg0
      });

      and(/^o body da requisição possui login: "(.*)"$/, (arg0) => {
        (bodyOfRequest as any).login = arg0
      });

      and(/^o body da requisição possui email: "(.*)"$/, (arg0) => {
        (bodyOfRequest as any).email = arg0
      });

      and(/^o body da requisição possui password: "(.*)"$/, (arg0) => {
        (bodyOfRequest as any).password = arg0
      });

      and(/^uma requisição POST é feita no endpoint "(.*)"$/, async (arg0) => {
        response = await request.post(arg0).send(bodyOfRequest)
      });

      then(/^o sistema retorna o código "(.*)"$/, (arg0) => {
        expect(response.status).toBe(parseInt(arg0))
      });

      and(/^o sistema retorna a mensagem de erro "(.*)"$/, (arg0) => {
        expect(response.body).toStrictEqual(arg0)
      });
  });

  test('Atualização de Senha de Usuário no Sistema com Sucesso', ({ given, when, and, then }) => {
      given(/^o usuário de login "(.*)" deseja mudar sua senha para "(.*)"$/, async (arg0, arg1) => {
        let mockedUser = new User()
        mockedUser.email = "joaodopedefeijao@gmail.com"
        mockedUser.login = arg0
        mockedUser.name = "joão"
        mockedUser.password = "123456"
        mockedUser.recoveryexpire = null
        mockedUser.recoverytoken = null

        const userRepo = dbConn.getRepository(User)
        await userRepo.save(mockedUser)
      });

      when(/^o body da requisição possui password: "(.*)"$/, (arg0) => {
        bodyOfRequest = {"password":arg0}
      });

      and(/^uma requisição PATCH é feita no endpoint "(.*)"$/, async (arg0) => {
        response = await request.patch(arg0).send(bodyOfRequest)
      });

      then(/^o sistema retorna o código "(.*)"$/, (arg0) => {
        expect(response.status).toBe(parseInt(arg0))
      });

      and(/^a senha do usuário de login "(.*)" é modificada no banco de dados para "(.*)"$/, async (arg0, arg1) => {
        let userFound  = await userRepo.findOne({where:{login:arg0}})
        expect(userFound?.password).toBe(arg1)
      });
  });

});