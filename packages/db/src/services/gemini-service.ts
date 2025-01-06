import { GoogleGenerativeAI } from '@google/generative-ai';

const geminiClient = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);

export class GeminiService {
    static async generateEmbedding(text: string) {
        const embeddingModel = geminiClient.getGenerativeModel({
            model: "models/embedding-001"
        });
        
        const response = await embeddingModel.embedContent(text);
        const embedding = response.embedding;

        return embedding.values;
    }

    static async generateResponse(text: string, systemInstruction: string) {
        const model = geminiClient.getGenerativeModel({
            model: "gemini-1.5-flash",
            generationConfig: {
                temperature: 0.7,
                topP: 0.95,
                topK: 40
            },
            systemInstruction: systemInstruction
        });
        const result = await model.generateContent(text);
        const content = await result.response.text();
        return content;
    }
}