import { GeminiService } from "./gemini-service";
import { VectorService } from "./vector-service";

export class TestGenerationService {
    static async generateInteractiveTest(topic: string, numQuestions: number = 5, difficulty: 'easy' | 'medium' | 'hard' = 'medium') {
        // 1. First, get the most relevant content chunks using vector search
        const relevantChunks = await VectorService.searchSimilarResources(topic, 5);
        
        // 2. Generate a concept map to identify key topics
        const conceptMap = await this.generateConceptMap(relevantChunks);

        // 3. Generate questions for each key concept
        const questions = [];
        for (const concept of conceptMap.mainConcepts) {
            // Get specific context for this concept
            const conceptContext = await VectorService.searchSimilarResources(concept, 2);
            
            const prompt = `
            Based on the following learning content:
            ${conceptContext.map(c => c.content).join('\n\n')}

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

            const questionResponse = await GeminiService.generateResponse(prompt);
            questions.push(JSON.parse(questionResponse));
        }

        // 4. Order questions for optimal learning
        return this.optimizeQuestionOrder(questions);
    }

    private static async generateConceptMap(contentChunks: any[]) {
        const prompt = `
        Analyze this content and identify:
        1. Main concepts that should be tested
        2. Relationships between concepts
        3. Progressive learning order

        Format as JSON:
        {
            "mainConcepts": ["string"],
            "relationships": [{"from": "string", "to": "string", "type": "string"}],
            "learningOrder": ["string"]
        }
        `;

        const combinedContent = contentChunks.map(chunk => chunk.content).join('\n\n');
        const response = await GeminiService.generateResponse(prompt + '\n\nContent:\n' + combinedContent);
        return JSON.parse(response);
    }

    private static optimizeQuestionOrder(questions: any[]) {
        // Sort questions by concept dependencies and difficulty
        return questions.sort((a, b) => {
            // Consider concept relationships and difficulty levels
            const difficultyOrder = { easy: 1, medium: 2, hard: 3 };
            return difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty];
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

        const context = await VectorService.searchSimilarResources(previousQuestion.concept, 2);
        return GeminiService.generateResponse(prompt + '\n\nAdditional context:\n' + context.map(c => c.content).join('\n'));
    }
}