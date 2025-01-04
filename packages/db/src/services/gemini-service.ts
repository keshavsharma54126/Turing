import { GoogleGenerativeAI } from '@google/generative-ai';

const geminiClient  =  new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string)

export class GeminiService{
    static async generateEmbedding(text: string){
        const embeddingModel = geminiClient.getGenerativeModel({
            model:"gemini-1.5-flash-latest",
            systemInstruction:"You are a helpful assistant that generates embeddings for text."
        })
        const response = await embeddingModel.embedContent(text)
        const embedding =  response.embedding;

        return embedding;
    }

    static async generateResponse(text:string,systemInstruction:string){
        const model = geminiClient.getGenerativeModel({
            model:"gemini-1.5-flash-latest",
            systemInstruction:systemInstruction
        })
        const result = await model.generateContent(text)
        const content = result.response.text();
        return content;
    }
}