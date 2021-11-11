import { Injectable } from '@nestjs/common'

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!'
  }

  auth(token: number | undefined): { isAuth: boolean } {
    return { isAuth: token === 2 }
  }
}
