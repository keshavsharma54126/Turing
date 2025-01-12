import { GoogleGenerativeAI } from '@google/generative-ai';

const geminiClient = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);

export class GeminiService {
    static async generateEmbedding(text: string) {
        try{
            const embeddingModel = geminiClient.getGenerativeModel({
                model: "models/embedding-001"
            });
            
            const response = await embeddingModel.embedContent(text);
            const embedding = response.embedding;
    
            return embedding.values;
        }catch(e){
            console.error("error while generating embeddings",e)
        }
    }

    static async generateResponse(text: string, systemInstruction: string) {
        try {
            const model = geminiClient.getGenerativeModel({
                model: "gemini-1.5-pro",
                generationConfig: {
                    temperature: 0.3,
                    topP: 0.95,
                    topK: 40,
                },
                systemInstruction: systemInstruction
            });
            const result = await model.generateContent(text);
            
            // Check if we have candidates and get the text from the first one
            if(result){
                return result.response.text()
            }
        } catch(e) {
            console.error("error while generating responses from gemini", e);
            throw e;
        }
    }

    static async genertaeStreamedResponse(text:string,systemInstruction:string){
        try{
            const model = geminiClient.getGenerativeModel({
                model: "gemini-1.5-pro",
                generationConfig: {
                    temperature: 0.3,
                    topP: 0.95,
                    topK: 40,
                },
                systemInstruction: systemInstruction
            });
            const result = await model.generateContentStream(text)
            return result
        }catch(e){
            console.error("error while generatting and streaming that response from gemini")
            throw e
        }
    }
}