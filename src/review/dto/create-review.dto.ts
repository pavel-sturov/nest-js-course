import {
  IsNumber,
  IsString,
  Max,
  Min,
} from 'class-validator'
import { INVALID_MIN_LENGTH } from '../review.constants'

export class CreateReviewDto {
  @IsString()
  name: string

  @IsString()
  title: string

  @IsString()
  description: string

  @IsNumber()
  @Max(5)
  @Min(1, {
    message: INVALID_MIN_LENGTH,
  })
  rating: number

  @IsString()
  productId: string
}