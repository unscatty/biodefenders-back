import Elysia, { t } from 'elysia'
import { addInitialQuestions } from '@services/firestore'

export const initialQuestionsRoutes = new Elysia()
  .post('/initial-questions', async ({ body }) => {
    await addInitialQuestions(body)

    return { message: 'Se han guardado correctamente las respuestas' }
  },
    {
      body: t.Array(
        t.Object({
          question: t.String(),
          answer: t.String(),
        })
      )
    }
  )