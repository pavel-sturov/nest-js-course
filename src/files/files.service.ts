import { Injectable } from '@nestjs/common'
import { path } from 'app-root-path'
import { format } from 'date-fns'
import {
  ensureDir,
  writeFile,
} from 'fs-extra'
import * as sharp from 'sharp'
import { FileElementResponse } from './dto/file-element.response'
import { MFile } from './mfile.class'

@Injectable()
export class FilesService {
  async saveFiles(files: MFile[]): Promise<FileElementResponse[]> {

    const dateFolder   = format(new Date(), 'yyy-MM-dd')
    const uploadFolder = `${path}/uploads/${dateFolder}`

    await ensureDir(uploadFolder)

    const res: FileElementResponse[] = []

    for (const file of files) {
      const name = this.generateName(file.originalname)

      await writeFile(`${uploadFolder}/${name}`, file.buffer)

      res.push({ url: `${dateFolder}/${name}`, name })
    }

    return res
  }

  convertToVebP(file: Buffer): Promise<Buffer> {
    return sharp(file)
      .webp()
      .toBuffer()
  }

  generateName(originalname: string): string {
    return `${Date.now()}${originalname.slice(originalname.lastIndexOf('.'))}`
  }
}
