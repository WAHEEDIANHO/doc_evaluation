import request from 'supertest';
import { AppModule } from '../app.module';
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';


describe("Test Login", () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule]
    }).compile();

    app =  moduleFixture.createNestApplication();
    await app.init()
  })
  
  afterAll(async () => {
    await app.close()
  })

  it('should return 200 with token', async () => {
    const response = await request(app.getHttpServer()).post('/auth/')
      .send({ username: 'test', password: 'test' })
  });

})