import { GeminiService } from "@repo/db/client";
import { VectorService } from "@repo/db/client";
import { load } from 'cheerio';
import axios from 'axios';
import { YoutubeTranscript } from 'youtube-transcript';
import PDFParser from 'pdf2json';


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
            return ContentProcessorService.extractFromVideo(url);
        }
        else{
            return ContentProcessorService.extractFromWebsite(url);
        }
    }

    private static async extractFromPDF(url: string) {
        try {
            // Fetch PDF from URL
            const response = await axios.get(url, {
                responseType: 'arraybuffer',
                headers: {
                    'Accept': 'application/pdf'
                }
            });

            // Create a new parser instance
            const pdfParser = new PDFParser();

            // Convert the PDF to text
            const pdfText = await new Promise<string>((resolve, reject) => {
                pdfParser.on('pdfParser_dataReady', (pdfData) => {
                    const text = pdfData.Pages
                        .map(page => page.Texts
                            .map(text => text.R
                                .map(r => r.T)
                                .join(' '))
                            .join(' '))
                        .join('\n');
                    resolve(decodeURIComponent(text));
                });
                
                pdfParser.on('pdfParser_dataError', reject);
                
                // Load PDF from buffer
                pdfParser.parseBuffer(response.data);
            });

            return pdfText.trim();
            
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