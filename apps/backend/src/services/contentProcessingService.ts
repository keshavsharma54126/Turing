import { GeminiService } from "@repo/db/client";
import { VectorService } from "@repo/db/client";
import * as pdfjsLib from 'pdfjs-dist';
import { load } from 'cheerio';
import axios from 'axios';
import { YoutubeTranscript } from 'youtube-transcript';
import { userRouter } from "../routes/userRouter";


export class ContentProcessorService {
    static async processContent(content: {
        pdfUrls?: string[],
        urls?: string[],
        userId: string, 
        testId?: string,
        metadata?: any,
        
    }) {
        const extractedContent = await Promise.all([
            ...content.pdfUrls ? content.pdfUrls.map(this.extractFromPDF) : [],
            ...content.urls ? content.urls.map(this.extractType) : []
        ]);

        // Combine and chunk content
        const combinedContent = extractedContent.join('\n\n');
        const chunks = this.chunkContent(combinedContent);

        // Generate embeddings and store in vector store
        for (const chunk of chunks) {
            await VectorService.createResource({
               userId: content.userId,
               content: chunk,
               metadata: content.metadata,
               testId: content.testId,
               conversationId: null
            });
        }

        return {
            success: true,
            message: "Content processed successfully"
        };
    }

    private static async extractType(url: string) {
        if(url.includes("youtube.com")){
            return this.extractFromVideo(url);
        }
        else{
            return this.extractFromWebsite(url);
        }
    }

    private static async extractFromPDF(url: string) {
        try {
            // Fetch PDF from URL with proper error handling
            const response = await axios.get(url, {
                responseType: 'arraybuffer',
                headers: {
                    'Accept': 'application/pdf'
                }
            });
            
            // Load PDF document
            const pdf = await pdfjsLib.getDocument({data: response.data}).promise;
            let text = '';
            
            // Extract text from each page
            for (let i = 1; i <= pdf.numPages; i++) {
                const page = await pdf.getPage(i);
                const content = await page.getTextContent();
                text += content.items
                    .map((item: any) => item.str)
                    .join(' ');
            }
            
            return text.trim();
        } catch (error) {
            console.error(`Error processing PDF from ${url}:`, error);
            return "";
        }
    }

    private static async extractFromVideo(url: string): Promise<string> {
        try{
            const transcript = await YoutubeTranscript.fetchTranscript(url);
            return transcript.map(t => t.text).join(' ');
        }
        catch(error){
            console.error(`Error processing video from ${url}:`, error);
            return "";
        }
    }

    private static async extractFromWebsite(url: string): Promise<string> {
        try {
            // Fetch with timeout and user-agent
            const { data } = await axios.get(url, {
                timeout: 10000,
                headers: {
                    'User-Agent': 'Mozilla/5.0 (compatible; MyBot/1.0)'
                }
            });

            const $ = load(data);

            // Remove unwanted elements
            $('script, style, meta, link, header, footer, nav, iframe, img').remove();
            
            // Get text and clean it up
            const text = $('body')
                .text()
                .replace(/\s+/g, ' ')  // Replace multiple spaces with single space
                .replace(/\n+/g, '\n') // Replace multiple newlines with single newline
                .trim();

            return text;
        } catch (error) {
            console.error(`Error extracting content from ${url}:`, error);
            return "";
        }
    }

    private static chunkContent(text: string, maxChunkSize = 1000): string[] {
        const sentences = text.match(/[^.!?]+[.!?]+/g) || [];
        const chunks: string[] = [];
        let currentChunk = '';

        for (const sentence of sentences) {
            if (currentChunk.length + sentence.length > maxChunkSize) {
                chunks.push(currentChunk);
                currentChunk = sentence;
            } else {
                currentChunk += sentence;
            }
        }
        if (currentChunk) chunks.push(currentChunk);

        return chunks;
    }
}