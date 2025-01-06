import { GeminiService } from "@repo/db/client";
import { VectorService } from "@repo/db/client";
import { PromptTemplate } from "@langchain/core/prompts";
import { StructuredOutputParser } from "langchain/output_parsers";
import { z } from "zod"; 

export class TestGenerationService {
    static async generateInteractiveTest(topic: string, numQuestions: number, difficulty: 'easy' | 'medium' | 'hard' = 'medium') {
        let limit;
        limit = numQuestions*20;
        const formattedTopic = await this.formatTopicForSearch(topic);
        const relevantDocs:any[]=[]
        const formattedKeys = formattedTopic.split(',');
        for(const formattedKey of formattedKeys){
            const relevantSearch = await VectorService.searchSimilarResources(formattedKey,limit,0.8) as any[];
            relevantDocs.push(...relevantSearch);
        }
        
        // 2. Generate a concept map to identify key topics
        const conceptMap = await this.generateConceptMap(relevantDocs);

        // Validate that conceptMap matches our schema
        if (!conceptMap || !Array.isArray(conceptMap.mainConcepts)) {
            throw new Error('Invalid concept map structure returned');
        }

        // 3. Generate questions for each key concept
        const questions = [];
        for (const concept of conceptMap.mainConcepts) {
            // Get specific context for this concept
            const conceptContext = await VectorService.searchSimilarResources(concept,100,0.8) as any[];
            const conceptContextString = conceptContext.map(c => c.content).join('\n\n');
            const prompt = `
            Based on the following learning content:
            ${conceptContextString}

            Generate a ${difficulty} level interactive question that:
            1. Tests understanding of: ${concept}
            2. Requires critical thinking, not just memorization
            3. Includes practical applications or real-world scenarios
            4. Has multiple choice options that are plausible but with only one correct answer
            5. Provides a detailed explanation of why the answer is correct

            Format as JSON:
            {
                "question": "string",
                "options": ["string"],
                "correctAnswer": "string",
                "explanation": "string",
                "concept": "string",
                "difficulty": "string",
                "type": "string" // e.g., "application", "analysis", "comprehension"
            }
            `;

            const questionResponse = await this.generateQuestion(concept,conceptContextString,difficulty,prompt);
            questions.push(JSON.parse(questionResponse));
        }

        // 4. Order questions for optimal learning
        return this.optimizeQuestionOrder(questions);
    }

    private static async generateConceptMap(contentChunks: any[]) {
        const conceptMapParser = StructuredOutputParser.fromZodSchema(
            z.object({
                mainConcepts: z.array(z.string()),
                relationships: z.array(z.object({
                    from: z.string(),
                    to: z.string(),
                    type: z.string()
                })),
                learningOrder: z.array(z.string())
            })
        );

        const conceptMapPrompt = new PromptTemplate({
            template: `Analyze this content and identify:
                1. Main concepts that should be tested
                2. Relationships between concepts
                3. Progressive learning order
                4. Make sure you check your knowledge base also for the concepts that are important to the topicand relationships between them.
                
                {format_instructions}
                
                Content: {content}`,
            inputVariables: ["content"],
            partialVariables: {
                format_instructions: conceptMapParser.getFormatInstructions(),
                systemInstruction: `You are a helpful assistant that generates a concept map for a given topic.`
            }
        });

        const combinedContent = contentChunks.map(chunk => chunk.content).join('\n\n');
        const formattedPrompt = await conceptMapPrompt.format({
            content: combinedContent
        });
        
        const response = await GeminiService.generateResponse(formattedPrompt,`You are a helpful assistant that generates a concept map for a given topic and make sure to generate according to the given format.`);
        return conceptMapParser.parse(response);
    }

    private static optimizeQuestionOrder(questions: any[]) {
        // Sort questions by concept dependencies and difficulty
        return questions.sort((a, b) => {
            // Consider concept relationships and difficulty levels
            const difficultyOrder = { easy: 1, medium: 2, hard: 3 };
            return difficultyOrder[a.difficulty as keyof typeof difficultyOrder] - difficultyOrder[b.difficulty as keyof typeof difficultyOrder];
        });
    }

    static async generateFollowUpQuestion(previousQuestion: any, userAnswer: string, isCorrect: boolean) {
        const prompt = `
        Based on the user's ${isCorrect ? 'correct' : 'incorrect'} answer to:
        Question: ${previousQuestion.question}
        Their answer: ${userAnswer}
        Correct answer: ${previousQuestion.correctAnswer}

        Generate a follow-up question that:
        ${isCorrect ? 
            '1. Tests a more advanced aspect of the same concept\n2. Increases difficulty slightly' :
            '1. Reinforces the same concept from a different angle\n2. Provides more context in the question'
        }
        `;
        const context = await VectorService.searchSimilarResources(previousQuestion.concept,100,0.8) as any[];
        const contextString = context.map((c:any) => c.content).join('\n');
        return GeminiService.generateResponse(prompt,contextString);
    }

    private static async generateQuestion(concept: string, context: string, difficulty: string,prompt:string) {
        const questionParser = StructuredOutputParser.fromZodSchema(
            z.object({
                question: z.string(),
                options: z.array(z.string()),
                correctAnswer: z.string(),
                explanation: z.string(),
                concept: z.string(),
                difficulty: z.string(),
                type: z.string()
            })
        );

        const questionPrompt = new PromptTemplate({
            template: `Based on the following learning content:
                {context}

                Generate a {difficulty} level interactive question that:
                1. Tests understanding of: {concept}
                2. Requires critical thinking, not just memorization
                3. Includes practical applications or real-world scenarios
                4. Has multiple choice options that are plausible but with only one correct answer
                5. Provides a detailed explanation of why the answer is correct

                {format_instructions}`,
            inputVariables: ["context", "difficulty", "concept"],
            partialVariables: {
                format_instructions: questionParser.getFormatInstructions()
            }
        });

        const response = await GeminiService.generateResponse(await questionPrompt.format({ context, difficulty, concept }),prompt);
        return JSON.parse(response);
    }

    private static async formatTopicForSearch(topic: string): Promise<string> {
        const prompt = `
        Extract and format the key concepts and terms from this topic description for a semantic search.
        Focus on technical terms, main concepts, and core ideas.
        Return them as a comma-separated javascript array of relevantterms.
        
        Topic: ${topic}
        `;
        
        const formattedResponse = await GeminiService.generateResponse(prompt, topic);
        return formattedResponse.trim();
    }
}