import { prisma } from '../index';
import { Prisma} from '@prisma/client';
import { GeminiService } from './gemini-service';
import { randomUUID } from 'crypto';

export class VectorService {
    static async generateEmbedding(text: string) {
        return GeminiService.generateEmbedding(text);
    }

    static async createResource({userId, content, metadata, testId, conversationId}: {
        userId: string,
        content: string,
        metadata?: any,
        testId?: string | null,
        conversationId?: string | null
    }) {
        const embedding = await this.generateEmbedding(content);
        
        return prisma.$executeRaw`
            INSERT INTO resources(
                id,
                user_id,
                content,
                metadata,
                test_id,
                conversation_id,
                embedding,
                created_at,
                updated_at
            )
            VALUES (
                ${randomUUID()},
                ${userId},
                ${content},
                ${metadata ? JSON.stringify(metadata) : null}::jsonb,
                ${testId},
                ${conversationId},
                ${embedding}::vector,
                NOW(),
                NOW()
            )
            RETURNING 
                id,
                user_id as "userId",
                content,
                metadata,
                test_id as "testId",
                conversation_id as "conversationId",
                created_at as "createdAt",
                updated_at as "updatedAt"
        `;
    }

    static async searchSimilarResources(query: string, limit: number = 5, similarityThreshold: number = 0.8, testId?: string) {
        const queryEmbedding = await this.generateEmbedding(query);
        
        return prisma.$queryRaw`
            SELECT 
                id, 
                user_id as "userId",
                content, 
                metadata,
                test_id as "testId",
                conversation_id as "conversationId",
                1 - (embedding <=> ${queryEmbedding}::vector) as similarity
            FROM resources
            WHERE 1 - (embedding <=> ${queryEmbedding}::vector) >= ${similarityThreshold}
            //@ts-ignore
                ${testId ? Prisma.sql`AND test_id = ${testId}` : Prisma.sql``}
            ORDER BY embedding <=> ${queryEmbedding}::vector
            LIMIT ${limit};
        `;
    }


    static async searchSimilarResourcesByConversation(query: string, limit: number, similarityThreshold: number, conversationId?: string) {
        try {
            const queryEmbedding = await this.generateEmbedding(query);
            console.log('Generated embedding:', queryEmbedding);
            
            const results = await prisma.$queryRaw`
                SELECT 
                    id, 
                    user_id as "userId",
                    content, 
                    metadata,
                    test_id as "testId",
                    conversation_id as "conversationId",
                    1 - (embedding <=> ${queryEmbedding}::vector) as similarity
                FROM resources
                WHERE 1 - (embedding <=> ${queryEmbedding}::vector) >= ${similarityThreshold}
                //@ts-ignore
                ${conversationId ? Prisma.sql`AND conversation_id = ${conversationId}` : Prisma.sql``}
                ORDER BY embedding <=> ${queryEmbedding}::vector
                LIMIT ${limit};
            `;
            console.log('Search results:', results);
            return results;
        } catch (error) {
            console.error('Error in vector search:', error);
            throw error;
        }
    }

}