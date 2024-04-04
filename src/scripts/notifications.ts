import { firebaseApp } from '@services/firestore'
import { Message, getMessaging } from 'firebase-admin/messaging'
import { recommendationsCollection } from '@services/firestore'

const getRandomRecommendation = async (recommendationDocId: string) => {
  const recommendations = recommendationsCollection.doc(recommendationDocId)
  // Get a random recommendation
  const { data } = await recommendations.get()

  const recommendationsData = data?.()

  if (!recommendationsData) {
    throw new Error('No recommendations found')
  }

  const { recomendaciones } = recommendationsData

  const randomIndex = Math.floor(Math.random() * recomendaciones.length)

  return recomendaciones[randomIndex]
}

const messagingService = getMessaging(firebaseApp)

export const sendNotification = async (message: Message) => {
  try {
    const response = await messagingService.send(message)

    console.log('Successfully sent message:', response)
  } catch (error) {
    console.error('Error sending message:', error)
    return error
  }
}
