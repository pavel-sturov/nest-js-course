import {
  Controller,
  HttpCode,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { JwtAuthGuard } from '../auth/guards/jwt.guard'
import { FileElementResponse } from './dto/file-element.response'
import { FilesService } from './files.service'
import { MFile } from './mfile.class'

@Controller('files')
export class FilesController {
  constructor(private readonly fileService: FilesService) {}

  @Post('upload')
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('files'))
  async uploadFile(@UploadedFile() file: Express.Multer.File): Promise<FileElementResponse[]> {
    const files: MFile[] = [new MFile(file)]

    if (file.mimetype.includes('image')) {
      const buffer = await this.fileService.convertToVebP(file.buffer)

      files.push(new MFile({
        originalname: `${file.originalname}.webp`,
        buffer,
      }))
    }

    return this.fileService.saveFiles(files)
  }
}
