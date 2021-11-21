import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Patch,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common'
import { JwtAuthGuard } from '../auth/guards/jwt.guard'
import { IdValidationPipe } from '../pipes/id-validation.pipe'
import { CreateTopPageDto } from './dto/create-top-page.dto'
import { FindTopPageDto } from './dto/find-top-page.dto'
import { PAGE_NOT_FOUND_ERROR } from './top-page.constants'
import { TopPageModel } from './top-page.model'
import { TopPageService } from './top-page.service'

@Controller('top-page')
export class TopPageController {
  constructor(private readonly topPageService: TopPageService) {}

  @UseGuards(JwtAuthGuard)
  @Post('create')
  async create(@Body() dto: CreateTopPageDto) {
    return this.topPageService.create(dto)
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async get(@Param('id', IdValidationPipe) id: string) {
    const topPage = this.topPageService.getById(id)

    if (!topPage) {
      throw new NotFoundException(PAGE_NOT_FOUND_ERROR)
    }

    return topPage
  }

  @Get('byAlias/:alias')
  async getByAlias(@Param('alias') alias: string) {
    const topPage = this.topPageService.getByAlias(alias)

    if (!topPage) {
      throw new NotFoundException(PAGE_NOT_FOUND_ERROR)
    }

    return topPage
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async delete(@Param('id', IdValidationPipe) id: string) {
    const topPage = this.topPageService.deleteById(id)

    if (!topPage) {
      throw new NotFoundException(PAGE_NOT_FOUND_ERROR)
    }
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async patch(@Param('id', IdValidationPipe) id: string, @Body() dto: TopPageModel) {
    const newTopPage = this.topPageService.updateById(id, dto)

    if (!newTopPage) {
      throw new NotFoundException(PAGE_NOT_FOUND_ERROR)
    }

    return newTopPage
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Post('find')
  async find(@Body() dto: FindTopPageDto) {
    return this.topPageService.findByCategory(dto.firstCategory)
  }

  @Get('textSearch/:text')
  async textSearch(@Param('text') text: string) {
    return this.topPageService.findByText(text)
  }
}
