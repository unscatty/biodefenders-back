declare module "bun" {
  interface Env {
    readonly PORT: string | number | undefined

    // Firebase server-side config
    readonly FIREBASE_PRIVATE_KEY_ID: string
    readonly FIREBASE_PRIVATE_KEY: string
    readonly FIREBASE_PROJECT_ID: string
    readonly FIREBASE_CLIENT_EMAIL: string
    readonly FIREBASE_CLIENT_ID: string
    readonly FIREBASE_AUTH_URI: string
    readonly FIREBASE_TOKEN_URI: string
    readonly FIREBASE_AUTH_CERT_URL: string
    readonly FIREBASE_CLIENT_CERT_URL: string

    // Google Cloud Document AI
    readonly GCP_DOC_AI_PROJECT_ID: string
    readonly GCP_DOC_AI_LOCATION: string
    readonly GCP_DOC_AI_PROCESSOR_ID: string
    readonly GCP_DOC_AI_PROCESSOR_ENDPOINT_NAME: string

    // Google Cloud Vertex AI
    readonly GCP_VERTEX_AI_PROJECT_ID: string
    readonly GCP_VERTEX_AI_LOCATION: string
    readonly GCP_VERTEX_AI_TEXT_MODEL: string
  }
}