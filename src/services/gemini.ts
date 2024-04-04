import { GenerateContentRequest, HarmBlockThreshold, HarmCategory, VertexAI } from '@google-cloud/vertexai'
import { InitialQuestion, Recommendation } from '@models'
import { extractJsonFromText } from '@/utils/text'

const { GCP_VERTEX_AI_PROJECT_ID, GCP_VERTEX_AI_LOCATION, GCP_VERTEX_AI_TEXT_MODEL } = process.env

const vertxAI = new VertexAI({ project: GCP_VERTEX_AI_PROJECT_ID, location: GCP_VERTEX_AI_LOCATION })

const generativeModel = vertxAI.getGenerativeModel({
  model: GCP_VERTEX_AI_TEXT_MODEL,
  safety_settings: [
    {
      category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE
    }
  ],
  // generation_config: { max_output_tokens: 250 }
})

export async function generateContent(request: Parameters<typeof generativeModel.generateContent>[0]) {
  const resp = await generativeModel.generateContent(request);

  return resp.response
}

export type RecommendationAndCarbonFootprint = {
  recomendaciones: Recommendation[],
  huellaDeCarbono: {
    total: string | number,
    detalles: {
      energia: number,
      agua: number,
      residuos: number,
      movilidad: number,
      alimentacion: number,
      otros: number
    }
  }
}

export const generateQuestionsRecommendations = async (questions: InitialQuestion[]) => {
  const prompt = `
    Genera al menos 10 recomendaciones sobre cómo reducir el impacto de la huella de carbono en el planeta y
    de educación ambiental tomando como base las siguientes preguntas y respuestas:
    ${questions.map(({ question, answer }) => `P: ${question}\nR: ${answer}`).join('\n')}

    La respuesta debe ser en el idioma español y en formato JSON. En el contexto mexicano actual.
    Siguiendo la siguiente estructura:
    {
      "recomendaciones": [
        {
          "recomendacion": "...",
          "fuente": "...", // Aquí va la pregunta de la que surgió la recomendación
          "categoria": "..." // (cuidado del agua, energía, residuos, movilidad, etc.)
          "alcance": "..." // (individual, familiar, comunitario, etc.)
        }
      ]
    }
    Además de eso, calcula un aproximado de la huella de carbono de la persona que respondió las preguntas.
    La respuesta final debe incluir también el cálculo de la huella de carbono en formato JSON.
    La respuesta final deberá tener el siguiente formato:
    {
      "recomendaciones": [
        ... // Lista de recomendaciones
      ],
      "huellaDeCarbono": {
        "total": "total en kgCO2e",
        "detalles": {
          "energia": ...,
          "agua": ...,
          "residuos": ...,
          "movilidad": ...,
          "alimentacion": ..,
          "otros": ...
        }
      }
    }
    Si la información no es suficiente para hacer un cálculo exacto, puedes hacer una aproximación.
    Solamente devuelve la respuesta en formato JSON, sin ningún otro contenido o mensaje adicional.
    Para poder hacer parsing de la respuesta, asegúrate de que el JSON sea válido
    (no incluir comentarios o algún otro caracter que no sea permitido en JSON, la respuesta será validada con JSON.parse())
    y que la respuesta comience con {}.
  `

  const request: GenerateContentRequest = {
    contents: [
      {
        parts: [{ text: prompt }],
        role: 'user'
      }
    ]
  }

  const response = await generateContent(request)

  // return response

  const firstCandidate = response.candidates[0]

  if (!firstCandidate) {
    console.error(JSON.stringify(response, null, 2))
    throw new Error('No se obtuvieron recomendaciones. Intenta de nuevo.')
  }

  const recomendacionsText = firstCandidate.content.parts[0].text

  if (!recomendacionsText) {
    console.error(JSON.stringify(response, null, 2))
    throw new Error('No se obtuvieron recomendaciones. Intenta de nuevo.')
  }

  // Try to parse the response
  return extractJsonFromText(recomendacionsText) as RecommendationAndCarbonFootprint
}
