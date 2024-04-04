import { InitialQuestionsCollection, InitialQuestion } from '@models/initial-question'
import { AppOptions, cert, initializeApp } from 'firebase-admin/app'
import { CollectionReference, getFirestore } from 'firebase-admin/firestore'
import { Recommendation, RecommendationsCollection } from '../models'

const {
  FIREBASE_CLIENT_EMAIL,
  FIREBASE_PRIVATE_KEY,
  FIREBASE_PROJECT_ID,
} = process.env

const appCert = cert({
  projectId: FIREBASE_PROJECT_ID,
  clientEmail: FIREBASE_CLIENT_EMAIL,
  privateKey: FIREBASE_PRIVATE_KEY,
})

const appOptions: AppOptions = {
  credential: appCert,
  // Use de default database
  databaseURL: `https://${FIREBASE_PROJECT_ID}.firebaseio.com`,
}

export const firebaseApp = initializeApp(appOptions)

export const firestore = getFirestore(firebaseApp)

export const initialQuestionsCollection = firestore.collection('initial-questions') as CollectionReference<InitialQuestionsCollection>

export const addInitialQuestions = async (intialQuestions: InitialQuestion[]) => {
  return initialQuestionsCollection.add({ initialQuestions: intialQuestions })
}

export const recommendationsCollection = firestore.collection('recommendations') as CollectionReference<RecommendationsCollection>

export const addRecommendations = async (recommendations: Recommendation[]) => {
  return recommendationsCollection.add({ recomendaciones: recommendations })
}