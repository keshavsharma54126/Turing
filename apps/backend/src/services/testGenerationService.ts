import { GeminiService } from "@repo/db/client";
import { VectorService } from "@repo/db/client";
import { PromptTemplate } from "@langchain/core/prompts";
import { StructuredOutputParser } from "langchain/output_parsers";
import { z } from "zod"; 

export class TestGenerationService {
    static async generateInteractiveTest(topic: string, numQuestions: number, difficulty: 'easy' | 'medium' | 'hard' = 'medium', testId?: string) {
        let limit;
        limit = numQuestions*20;
        const formattedTopic = await TestGenerationService.formatTopicForSearch(topic);
        const relevantDocs:any[]=[]
        const formattedKeys = formattedTopic.split(',');
        for(const formattedKey of formattedKeys){
            const relevantSearch = await VectorService.searchSimilarResources(
                formattedKey,
                Math.min(limit, 10),
                0.8,
                testId
            ) as any[];
            relevantDocs.push(...relevantSearch);
        }
        console.log(formattedKeys);
        // 2. Generate a concept map to identify key topics
        const conceptMap = await TestGenerationService.generateConceptMap(relevantDocs);

        console.log(conceptMap);

        // Validate that conceptMap matches our schema
        if (!conceptMap || !Array.isArray(conceptMap.mainConcepts)) {
            throw new Error('Invalid concept map structure returned');
        }

        // 3. Generate questions for each key concept
        const questions = [];
        let count = 0;
        for (const keys of formattedKeys    ) {
            // Get specific context for this concept
            const conceptContext = await VectorService.searchSimilarResources(keys,limit,0.7,testId) as any[];
            const conceptContextString = conceptContext.map(c => c.content).join('\n\n');
            const prompt = `
            Based on the following learning content:
            ${conceptContextString}

            Generate a ${difficulty} level interactive question that:
            1. Tests understanding of: ${keys}
            2. Requires critical thinking, not just memorization
            3. Includes practical applications or real-world scenarios
            4. Has multiple choice options that are plausible but with only one correct answer
            5. Provides a detailed explanation of why the answer is correct
            5. Also ask them questions in the same language as the learning content please example: if the content is in english, ask the questions in english,if it was in spanish, ask the questions in spanish , if it was in frech then ask them in french and if it was in hindi then ask them in hindi.

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

            Please make sure that the correct answer is fully stored in the correctAnswer field and not just the first part of the option.or like "A","B","C","D" etc.
            `;

            const questionResponse = await TestGenerationService.generateQuestion(keys,conceptContextString,difficulty,prompt);
            questions.push(JSON.parse(questionResponse));
            count++;
            if(count >= numQuestions) break;

        }
        // for(const concepts of conceptMap.relatedPairs){
        //     const conceptsString = concepts.concepts.join(',');
        //     const prompt = `
        //     Based on the following learning content:
        //     ${conceptsString}

        //     Generate a ${difficulty} level interactive question that:
        //     1. Tests understanding of: ${conceptsString}
        //     2. Requires critical thinking, not just memorization
        //     3. Includes practical applications or real-world scenarios
        //     4. Has multiple choice options that are plausible but with only one correct answer
        //     5. Provides a detailed explanation of why the answer is correct

        //     Format as JSON:
        //     {
        //         "question": "string",
        //         "options": ["string"],
        //         "correctAnswer": "string",
        //         "explanation": "string",
        //         "concept": "string",
        //         "difficulty": "string",
        //         "type": "string" // e.g., "application", "analysis", "comprehension"
        //     }
        //     `;
        //     const questionResponse = await TestGenerationService.generateQuestion(conceptsString,concepts.relationship,difficulty,prompt);
        //     questions.push(JSON.parse(questionResponse));
        //     count++;
        //     if(count >= numQuestions) break;
        // }
        // 4. Order questions for optimal learning
        return TestGenerationService.optimizeQuestionOrder(questions);
    }

    private static async generateConceptMap(contentChunks: any[]) {
        const conceptMapParser = StructuredOutputParser.fromZodSchema(
            z.object({
                mainConcepts: z.array(z.string()),
                relatedPairs: z.array(z.object({
                    concepts: z.array(z.string()),
                    relationship: z.string()
                })),
                learningOrder: z.array(z.string())
            })
        );

        const conceptMapPrompt = new PromptTemplate({
            template: `Analyze the following content and create a detailed concept map structure. 

                Content: {content}
                
                1. First, identify individual main concepts that appear verbatim in the text above.
                2. Then, identify pairs or groups of concepts that are closely related or dependent on each other.
                3. For each related pair/group, explain the relationship between the concepts.
                
                Format your response as a JSON object with:
                - mainConcepts: An array of individual key concepts
                - relatedPairs: An array of objects containing:
                  * concepts: Array of 2-3 related concepts
                  * relationship: Brief description of how these concepts are connected
                - learningOrder: Suggested sequence for learning these concepts
                
                Only include concepts that explicitly appear in the text.
                
                {format_instructions}`,
            inputVariables: ["content"],
            partialVariables: {
                format_instructions: conceptMapParser.getFormatInstructions()
            }
        });

        const combinedContent = contentChunks.map(chunk => chunk.content).join('\n\n');
        const formattedPrompt = await conceptMapPrompt.format({
            content: combinedContent
        });
        
        const response = await GeminiService.generateResponse(
            formattedPrompt,
            `You are a helpful assistant that extracts main concepts from given content. Only return concepts that are explicitly present in the text.and return the concepts in the same language as the content.
            The content is in language suppose the content was in english then return the concepts in english, if it was in spanish then return the concepts in spanish, if it was in french then return the concepts in french, if it was in hindi then return the concepts in hindi.`
        );
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

    static async generateFollowUpQuestion(previousQuestion: any, userAnswer: string, isCorrect: boolean, testId?: string    ) {
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
        const context = await VectorService.searchSimilarResources(previousQuestion.concept,20,0.7,testId) as any[];
        const contextString = context.map((c:any) => c.content).join('\n');
        return GeminiService.generateResponse(prompt,contextString);
    }

    private static async generateQuestion(concept: string, context: string, difficulty: string, prompt: string) {
        const systemInstruction = `You are an expert AI test creator specializing in ${concept}. 
        Create questions that:
        1. Are specific to the given context
        2. Test deep understanding rather than surface knowledge
        3. Include real-world applications
        4. Have clearly differentiated multiple choice options
        5. Match the specified ${difficulty} difficulty level
        6. Also ask them questions in the same language as the learning content please example: if the content is in english, ask the questions in english,if it was in spanish then ask the questions in spanish , if it was in frech then ask them in french and if it was in hindi then ask them in hindi.`;

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
            template: `
            Context about ${concept}:
            {context}

            Create a ${difficulty} level question that:
            1. Tests understanding of: {concept}
            2. Uses specific details from the provided context
            3. Requires analysis and application
            4. Has clearly distinct multiple choice options
            5. Includes a detailed explanation referencing the context
            6. Also ask them questions in the same language as the learning content please example: if the content is in english, ask the questions in english,if it was in spanish then ask the questions in spanish , if it was in frech then ask them in french and if it was in hindi then ask them in hindi.
            7. Please make sure that the correct answer is fully stored in the correctAnswer field and not just the first part of the option.or like "A","B","C","D" etc.
            8. Please make sure that the options are fully stored in the options field and not just the first part of the option.or like "A","B","C","D" etc.
            {format_instructions}`,
            inputVariables: ["context", "difficulty", "concept"],
            partialVariables: {
                format_instructions: questionParser.getFormatInstructions()
            }
        });

        const response = await GeminiService.generateResponse(
            await questionPrompt.format({ context, difficulty, concept }), 
            systemInstruction
        );
        return response.replace(/```json\n?|\n?```/g, '').trim();
    }

    private static async formatTopicForSearch(topic: string): Promise<string> {
        const prompt = `
        You are an expert in creating educational content. Given this topic about ${topic},
        identify the most important technical concepts and subtopics that should be tested.
        Return them as a comma-separated list.
        
        Example for "Machine Learning":
        supervised learning, neural networks, training data, model evaluation, overfitting
        
        Topic: ${topic}
        `;
        
        const formattedResponse = await GeminiService.generateResponse(prompt, 
            "You are an AI expert in educational content structuring");
        return formattedResponse.trim();
    }
}