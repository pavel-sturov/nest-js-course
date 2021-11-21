import {
  HttpStatus,
  INestApplication,
} from '@nestjs/common'
import {
  Test,
  TestingModule,
} from '@nestjs/testing'
import { disconnect } from 'mongoose'
import * as request from 'supertest'
import { USER_NOT_FOUND } from '../dist/auth/auth.constants'
import { AppModule } from '../src/app.module'
import { WRONG_PASSWORD } from '../src/auth/auth.constants'
import { AuthDto } from '../src/auth/dto/auth.dto'

const loginDto: AuthDto = {
  login:    'a@gmail.com',
  password: '123123',
}

describe('AuthController (e2e)', () => {
  let app: INestApplication

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleFixture.createNestApplication()
    await app.init()
  })

  it('/auth/login (POST) - success', () => {
    return request(app.getHttpServer())
      .post('/auth/login')
      .send(loginDto)
      .expect(HttpStatus.OK)
      .expect(async ({ body }: request.Response) => {
        expect(body.access_token).toBeDefined()
      })
  })

  it('/auth/login (POST) - fail', () => {
    return request(app.getHttpServer())
      .post('/auth/login')
      .send({ ...loginDto, password: 'wrongPassword' })
      .expect(HttpStatus.UNAUTHORIZED, {
        statusCode: HttpStatus.UNAUTHORIZED,
        message:    WRONG_PASSWORD,
        error:      'Unauthorized',
      })
  })

  it('/auth/login (POST) - fail', () => {
    return request(app.getHttpServer())
      .post('/auth/login')
      .send({ ...loginDto, login: 'wrongEmail@gmail.com' })
      .expect(HttpStatus.UNAUTHORIZED, {
        statusCode: HttpStatus.UNAUTHORIZED,
        message:    USER_NOT_FOUND,
        error:      'Unauthorized',
      })
    // .expect(401, {
    //   statusCode: 401,
    //   message:    WRONG_PASSWORD,
    //   error:      'Unauthorized',
    //
    // })
  })

  afterAll(() => {
    disconnect()
  })
})
