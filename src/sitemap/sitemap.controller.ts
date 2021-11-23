import {
  Controller,
  Get,
  Header,
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import {
  addDays,
  format,
} from 'date-fns'
import { Builder } from 'xml2js'
import { TopPageService } from '../top-page/top-page.service'
import { CATEGORY_URL } from './sitemat.constants'

@Controller('sitemap')
export class SitemapController {
  domain: string

  constructor(
    private readonly topPageService: TopPageService,
    private readonly configService: ConfigService,
  ) {
    this.domain = this.configService.get('DOMAIN') ?? ''
  }

  @Get('xml')
  @Header('content-type', 'text/xml')
  async sitemap() {
    const formatString = `yyy-MM-ddTHH:mm:00.000xxx`
    const builder      = new Builder({
      xmldec: { version: '1.0', encoding: 'UTF-8' },
    })

    let url = [
      {
        loc:        `${this.domain}`,
        lastmod:    format(addDays(new Date(), -1), formatString),
        changefreq: 'daily',
        priority:   '1.0',
      },
      {
        loc:        `${this.domain}/courses`,
        lastmod:    format(addDays(new Date(), -1), formatString),
        changefreq: 'daily',
        priority:   '1.0',
      },
    ]

    const pages = await this.topPageService.findAll()

    url = url.concat(pages.map(page => ({
      loc:        `${this.domain}/${CATEGORY_URL[page.firstCategory]}/${page.alias}`,
      lastmod:    format(new Date(page.updatedAt), formatString),
      changefreq: 'weekly',
      priority:   '0.7',
    })))

    return builder.buildObject({
      urlset: {
        $: {
          xmlns: 'http://sitemaps.org/schemas/sitemap/0.9',
        },
        url,
      },
    })
  }
}
