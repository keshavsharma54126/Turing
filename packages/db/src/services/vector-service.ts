import { prisma } from '../index';
import type { Prisma,ResourceType } from '@prisma/client';
import { GeminiService } from './gemini-service';


export class VectorService {
    static async generateEmbedding(text: string) {
        return GeminiService.generateEmbedding(text);
    }

    static async createResource(userId:string,content:string,type:ResourceType,metadata:any,textId:string,conversationId:string){
        const embedding = await this.generateEmbedding(content);
        
        return prisma.$executeRaw `
            INSERT INTO resources(
                user_id,
                content,
                type,
                metadata,
                text_id,
                conversation_id,
                embedding
            )
            VALUES (${userId},${content},${type},${metadata ? JSON.stringify(metadata) : null},${textId},${conversationId},${embedding})
            RETURNING *
        `;
    }

    static async searchSimilarResources(querry:string, limit:number){
        const queryEmbedding = await this.generateEmbedding(querry);
        return prisma.$queryRaw`
        SELECT 
            id, 
            content, 
            type,
            metadata,
            1 - (embedding <=> ${queryEmbedding}::vector) as similarity
        FROM resources
        ORDER BY embedding <=> ${queryEmbedding}::vector
        LIMIT ${limit};
    `;
    }

}