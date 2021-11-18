import { INestApplication } from '@nestjs/common'
import {
  Test,
  TestingModule,
} from '@nestjs/testing'
import {
  disconnect,
  Types,
} from 'mongoose'
import * as request from 'supertest'
import { CreateReviewDto } from '../dist/review/dto/create-review.dto'
import { AppModule } from '../src/app.module'
import {
  INVALID_MIN_LENGTH,
  REVIEW_NOT_FOUND,
} from '../src/review/review.constants'

const validProductId   = new Types.ObjectId().toHexString()
const invalidProductId = new Types.ObjectId().toHexString()

const validTestDto: CreateReviewDto = {
  name:        'Test',
  title:       'Title',
  description: 'Description',
  rating:      5,
  productId:   validProductId,
}

describe('AppController (e2e)', () => {
  let app: INestApplication
  let createdId: string

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleFixture.createNestApplication()
    await app.init()
  })

  it('/review/create (POST) - success', () => {
    return request(app.getHttpServer())
      .post('/review/create')
      .send(validTestDto)
      .expect(201)
      .expect(async ({ body }: request.Response) => {
        createdId = body._id
        expect(createdId).toBeDefined()
      })
  })

  it('/review/create (POST) - fail', () => {
    return request(app.getHttpServer())
      .post('/review/create')
      .send({ ...validTestDto, rating: 0 })
      .expect(400)
      .expect(async ({ body }: request.Response) => {
        console.log(body)
        expect(body.message[0]).toBe(INVALID_MIN_LENGTH)
        // createdId = body._id
        // expect(createdId).toBeDefined()
      })
  })

  it('/review/byProduct/:productId (GET) - success', () => {
    return request(app.getHttpServer())
      .get(`/review/byProduct/${validProductId}`)
      .expect(200)
      .expect(async ({ body }: request.Response) => {
        expect(body).toBeInstanceOf(Array)
        expect(body.length > 0).toBeTruthy()
        expect(body.find(({ productId: expectedId }) => expectedId === validProductId).productId).toBe(validProductId)
      })
  })

  it('/review/byProduct/:productId (GET) - fail', () => {
    return request(app.getHttpServer())
      .get(`/review/byProduct/${invalidProductId}`)
      .expect(200)
      .expect(({ body }: request.Response) => {
        expect(body).toBeInstanceOf(Array)
        expect(body.length).toBe(0)
      })
  })

  it('/review/:id (DELETE) - success', () => {
    return request(app.getHttpServer())
      .delete(`/review/${createdId}`)
      .expect(200)
  })

  it('/review/:id (DELETE) - fail', () => {
    return request(app.getHttpServer())
      .delete(`/review/${invalidProductId}`)
      .expect(404, {
        statusCode: 404,
        message:    REVIEW_NOT_FOUND,
      })
  })

  afterAll(() => {
    disconnect()
  })
})
