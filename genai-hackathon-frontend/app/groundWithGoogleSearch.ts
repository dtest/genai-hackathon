import { VertexAI } from '@google-cloud/vertexai';

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
            "type": "ARRAY",
            "items": {
                "type": "OBJECT",
                "properties": {
                    "fullTitle": { type: 'STRING' },
                    "playerName": { type: 'STRING' },
                    "manufacturer": { type: 'STRING' },
                    "year": { type: 'STRING' },
                    "sport": { type: 'STRING' },
                    "estimatedValueInCents": { type: 'INTEGER' },
                }
            }
        },
    },
    safetySettings: [],
    tools: [
        {
            googleSearchRetrieval: {},
        },
    ],
});


export async function groundWithGoogleSearch({ extractedVideoData }: { extractedVideoData: string }) {
    const text1 = { text: `You are a trading card expert. Find the title and estimated value in cents for all of these trading cards. Assume perfect condition. This does not need to be a perfect appraisal. ${extractedVideoData}` };
    const req = {
        contents: [
            { role: 'user', parts: [text1] }
        ],
    };

    const result = await generativeModel.generateContent(req);

    return result.response.candidates[0].content.parts[0].text;
}
