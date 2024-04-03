import Elysia, { t } from 'elysia'
import * as ticketScanService from '@services/ticket-scanner'


export const scanRoutes = new Elysia()
  .group(
    '/scan',
    (app) => app
      // Scan ticket from base64 image
      .post('/base64', async ({ body }) => {
        const { image, type } = body

        return ticketScanService.scanTicketFromBase64(image, type)
      },
        {
          body: t.Object({
            image: t.String(),
            type: t.String(),
          }),
        }
      )

      // Scan from file
      .post('/file', async ({ body }) => {
        const { file } = body

        return ticketScanService.scanTicketFromFile(file)
      },
        {
          body: t.Object({
            file: t.File(),
          }),
        }
      )
  )