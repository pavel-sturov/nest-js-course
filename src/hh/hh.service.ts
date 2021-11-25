import { HttpService } from '@nestjs/axios'
import {
  Injectable,
  Logger,
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { lastValueFrom } from 'rxjs'
import { HhData } from '../top-page/top-page.model'
import {
  API_URL,
  CLUSTER_NOT_FOUND_ERROR,
  SALARY_CLUSTER_ID,
} from './hh.constants'
import { HhResponse } from './hh.models'

@Injectable()
export class HhService {
  token: string

  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {
    this.token = this.configService.get('HH_TOKEN') ?? ''
  }

  async getData(text) {
    try {
      const $response = await this.httpService.get<HhResponse>(API_URL.vacancies, {
        params: {
          text,
          clusters: true,
        },
      })
      
      const { data } = await lastValueFrom($response)

      return this.parseData(data)
    } catch (e) {
      Logger.error(e)
    }
  }

  private parseData(data: HhResponse): HhData {
    const salaryCluster = data.clusters.find(({ id }) => id === SALARY_CLUSTER_ID)
    if (!salaryCluster) {
      throw new Error(CLUSTER_NOT_FOUND_ERROR)
    }

    const juniorSalary = HhService.getSalaryFromString(salaryCluster.items[1].name)
    const middleSalary = HhService.getSalaryFromString(salaryCluster.items[Math.ceil(salaryCluster.items.length / 2)].name)
    const seniorSalary = HhService.getSalaryFromString(salaryCluster.items[salaryCluster.items.length - 1].name)

    return {
      count:     data.found,
      juniorSalary,
      middleSalary,
      seniorSalary,
      updatedAt: new Date(),
    }
  }

  private static getSalaryFromString(string: string): number {
    const numberRegExp = /(\d+)/g

    const numberMatch = string.match(numberRegExp)

    if (!numberMatch) {
      return 0
    }

    return Number(numberMatch[0])
  }
}
