export interface Recommendation {
  recomendacion: string
  fuente: string
  categoria: string
  alcance: string
}

export interface RecommendationsCollection {
  recomendaciones: Recommendation[]
}