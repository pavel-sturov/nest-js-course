import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { AuthModule } from './auth/auth.module'
import { ProductModule } from './product/product.module'
import { ReviewModule } from './review/review.module'
import { TopPageModule } from './top-page/top-page.module'

@Module({
  imports:     [
    AuthModule,
    TopPageModule,
    ProductModule,
    ReviewModule,
    ConfigModule.forRoot({
      envFilePath: '.env',
    }),
  ],
  controllers: [AppController],
  providers:   [AppService],
})
export class AppModule {
}
