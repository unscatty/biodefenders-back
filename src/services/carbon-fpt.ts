import { VertexAI, HarmCategory, HarmBlockThreshold } from '@google-cloud/vertexai'

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
  generation_config: { max_output_tokens: 250 }
})

const jsonExample = {
  products: [
    {
      name: 'iPhone 13 Pro Max',
      price: 1099.99
    },
    {
      name: 'MacBook Pro 16"',
      price: 2399.99
    }
  ],
}

async function generateContent() {
  const request = {
    contents: [{ role: 'user', parts: [{ text: `Create a JSON schema for the following JSON object: ${JSON.stringify(jsonExample)}` }] }],
  };

  const resp = await generativeModel.generateContent(request);

  console.log('Generated content:', JSON.stringify(resp.response));
};

generateContent();

