import { Elysia } from 'elysia'
import { scanRoutes } from '@routes'
import { initialQuestionsRoutes } from '@routes'
import { generateQuiz } from '@services/gemini'

const app = new Elysia({ prefix: '/api' })
  .use(scanRoutes)
  .use(initialQuestionsRoutes)
  .get('/quiz', async () => {
    const generatedQuiz = await generateQuiz()

    if (!generatedQuiz) {
      return { success: false, message: 'No se pudo generar el quiz' }
    }

    return { success: true, message: 'Quiz generado correctamente', quiz: generatedQuiz }
  })
  .listen(process.env.PORT ?? 8080);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
