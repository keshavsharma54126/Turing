import { VectorService } from "./services/vector-service";
import { GeminiService } from "./services/gemini-service";
import dotenv from "dotenv";

dotenv.config()

async function testVectorSearch(){
    try{
        const embedding = await GeminiService.generateEmbedding("Javascript is a programming language")
        console.log("Generated embedding:", embedding)

        const resource = await VectorService.createResource({
            userId:"test-user",
            content:"JavaScript is a programming language commonly used for web development",
            testId:null,
            conversationId:null,
            metadata:{
                source:"test",
                tags:["javascript","programming","web"]
            }
        })
        const resource1 = await VectorService.createResource({
            userId:"test-user",
            content:"C language is a programming language commonly used for system programming",
            testId:null,
            conversationId:null,
            metadata:{
                source:"test",
                tags:["c","programming","system"]
            }
        })

        console.log("Created resource:", resource)
        console.log("Created resource1:", resource1)

        const results = await VectorService.searchSimilarResources("What programming language is used for web Development", 5)
        console.log("Similar resources:", results)
    }catch(error){
        console.error("Error:", error)
    }
}

testVectorSearch()