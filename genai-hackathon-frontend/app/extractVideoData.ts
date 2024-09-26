import { SchemaType, VertexAI, HarmCategory, HarmBlockThreshold } from '@google-cloud/vertexai';

// Initialize Vertex with your Cloud project and location
const vertex_ai = new VertexAI({ project: 'ganai-hackathon', location: 'us-central1' });
const model = 'gemini-1.5-flash-002';

// Instantiate the models
const generativeModel = vertex_ai.preview.getGenerativeModel({
    model: model,
    generationConfig: {
        'maxOutputTokens': 8192,
        'temperature': 0,
        'topP': 0.95,
        "responseMimeType": 'application/json',
        "responseSchema": {
            "type": SchemaType.ARRAY,
            "items": {
                "type": SchemaType.OBJECT,
                "properties": {
                    "playerName": { type: SchemaType.STRING },
                    "manufacturer": { type: SchemaType.STRING },
                    "year": { type: SchemaType.STRING },
                    "sport": { type: SchemaType.STRING },
                }
            }
        },
    },
    safetySettings: [
      {
        'category': HarmCategory.HARM_CATEGORY_HATE_SPEECH,
        'threshold': HarmBlockThreshold.BLOCK_NONE,
      },
      {
        'category': HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
        'threshold': HarmBlockThreshold.BLOCK_NONE,
      },
      {
        'category': HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
        'threshold': HarmBlockThreshold.BLOCK_NONE,
      },
      {
        'category': HarmCategory.HARM_CATEGORY_HARASSMENT,
        'threshold': HarmBlockThreshold.BLOCK_NONE,
      }
    ],
});

const text1 = { text: `You are a trading card expert. Find the title and estimated value in cents for all of these trading cards. Assume perfect condition. This does not need to be a perfect appraisal.` };


export async function extractVideoData({ fileUri }: { fileUri: string }) {
    const video1 = {
        fileData: {
            mimeType: 'video/mp4',
            fileUri,
        }
    };
    const req = {
        contents: [
            { role: 'user', parts: [text1, video1] }
        ],
    };

    const result = await generativeModel.generateContent(req);

    if (!result.response.candidates) {
        throw new Error('No response candidates in extractVideoData');
    }

    if (!result.response.candidates[0].content.parts[0].text) {
        throw new Error('No text from candidate in extractVideoData');
    }

    return result.response.candidates[0].content.parts[0].text;
}
