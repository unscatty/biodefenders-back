import Elysia, { t } from 'elysia'
import { addInitialQuestions, addRecommendations } from '@services/firestore'
import { generateQuestionsRecommendations } from '@services/gemini'

export const initialQuestionsRoutes = new Elysia()
  .post('/initial-questions', async ({ body }) => {
    const intialQuestions = await addInitialQuestions(body)

    const initialQuestionsId = intialQuestions.id

    // Genera recomendaciones
    const response = await generateQuestionsRecommendations(body)

    if (!response) {
      return { message: 'Se han guardado correctamente las respuestas', initialQuestionsId }
    }

    // Save recommendations to Firestore
    const recommendations = response.recomendaciones

    const recommendationsSaved = await addRecommendations(recommendations)
    const recomendationsId = recommendationsSaved.id

    return { message: 'Se han guardado correctamente las respuestas', initialQuestionsId, recomendationsId, ...response }
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