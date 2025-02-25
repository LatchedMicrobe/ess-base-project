import { loadFeature, defineFeature } from "jest-cucumber";
import supertest from 'supertest';
import app from '../../src/app';
import dbConn from "../../src/database/postgresConnection";
import User from "../../src/entities/user.entity";
import { assert } from "console";
import { notEqual } from "assert";

const feature = loadFeature('../features/passwordRecoveryService.feature');
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

  test('Recuperação de Senha no Sistema com Sucesso', ({ given, when, and, then }) => {
        given(/^existe um usuário de e-mail "(.*)"$/, async (arg0) => {
            let mockedUser = new User()
            mockedUser.email = arg0
            mockedUser.login = "jhonny1234"
            mockedUser.name = "joão"
            mockedUser.password = "123456"
            mockedUser.recoveryexpire = null
            mockedUser.recoverytoken = null

            const userRepo = dbConn.getRepository(User)
            await userRepo.save(mockedUser)
        });

        when(/^o body da requisição possui e-mail: "(.*)"$/, (arg0) => {
            bodyOfRequest = {"email":arg0}
        });

        and(/^uma requisição POST é feito no endpoint "(.*)"$/, async (arg0) => {
            response = await request.post(arg0).send(bodyOfRequest)
        });

        then(/^o sistema retorna o código "(.*)"$/, (arg0) => {
            expect(response.status).toBe(parseInt(arg0))
        });

        and(/^o sistema envia um e-mail para o e-mail "(.*)"$/, (arg0) => {
            expect(response.body.accepted).toStrictEqual([arg0])
        });
    }, 10000);
});
