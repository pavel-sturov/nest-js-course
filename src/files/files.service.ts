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
      const { originalname } = file

      const name = `${Date.now()}${originalname.slice(originalname.lastIndexOf('.'))}`

      await writeFile(`${uploadFolder}/${name}`, file.buffer)

      res.push({ url: `${dateFolder}/${name}`, name })
    }

    return res
  }
}
