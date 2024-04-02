import { Elysia } from 'elysia'
import { scanRoutes } from '@routes'

const app = new Elysia({ prefix: '/api' })
  .use(scanRoutes)
  .listen(process.env.PORT ?? 8080);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
