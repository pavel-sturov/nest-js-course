import { Injectable } from '@nestjs/common'
import { path } from 'app-root-path'
import { format } from 'date-fns'
import {
  ensureDir,
  writeFile,
} from 'fs-extra'
import { FileElementResponse } from './dto/file-element.response'

@Injectable()
export class FilesService {
  async saveFiles(files: Express.Multer.File[]): Promise<FileElementResponse[]> {

    const dateFolder   = format(new Date(), 'yyy-MM-dd')
    const uploadFolder = `${path}/uploads/${dateFolder}`

    await ensureDir(uploadFolder)

    const res: FileElementResponse[] = []

    for (const file of files) {
      const timeNow = Date.now()

      await writeFile(`${uploadFolder}/${timeNow}`, file.buffer)

      res.push({ url: `${dateFolder}/${timeNow}`, name: file.originalname })
    }

    return res
  }
}
