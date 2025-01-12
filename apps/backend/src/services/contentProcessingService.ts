import { GeminiService } from "@repo/db/client";
import { VectorService } from "@repo/db/client";
import { load } from 'cheerio';
import axios from 'axios';
import { YoutubeTranscript } from 'youtube-transcript';
import PDFParser from 'pdf2json';
import { string } from "zod";

interface PDFExtractResult {
    text: string;
    pageCount: number;
}

export class ContentProcessorService {
    static async processContent(content: {
        pdfUrls?: string[],
        urls?: string[],
        userId: string, 
        testId?: string,
        conversationid?:string,
        metadata?: any,
        
    }) {
        const extractedContent = await Promise.all([
            ...content.pdfUrls ? content.pdfUrls.map(this.extractFromPDF) : [],
            ...content.urls ? content.urls.map(this.extractType) : []
        ]);

        const combinedContent = extractedContent.join('\n\n');
        const chunks = this.chunkContent(combinedContent);

        console.log(chunks)


        // Generate embeddings and store in vector store
        for (const chunk of chunks) {
            const res = await VectorService.createResource({
               userId: content.userId,
               content: chunk,
               metadata: content.metadata,
               testId: content.testId,
               conversationId: content.conversationid
            });
        }
        

        return {
            success: true,
            testId: content.testId,
            conversationId: content.conversationid,
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

    private static async extractFromPDF(url: string): Promise<string> {
        try {
            // Fetch PDF from URL
            const response = await axios.get(url, {
                responseType: 'arraybuffer'
            });

            // Create a new parser instance
            const pdfParser = new PDFParser();

            // Convert the PDF to text
            const result = await new Promise<PDFExtractResult>((resolve, reject) => {
                pdfParser.on('pdfParser_dataReady', (pdfData) => {
                    try {
                        // Extract text from all pages
                        const text = pdfData.Pages.map(page => {
                            return page.Texts.map(text => 
                                decodeURIComponent(text.R[0].T)
                            ).join(' ');
                        }).join('\n\n');

                        resolve({
                            text,
                            pageCount: pdfData.Pages.length
                        });
                    } catch (err) {
                        reject(err);
                    }
                });

                pdfParser.on('pdfParser_dataError', (error: any) => {
                    reject(error);
                });

                // Load the PDF data
                pdfParser.parseBuffer(response.data);
            });
            return result.text;

        } catch (error) {
            console.error(`Error processing PDF from ${url}:`, error);
            throw error;
        }
    }

    private static async extractFromVideo(url: string): Promise<string> {
        try{
            const transcript = await YoutubeTranscript.fetchTranscript(url);
            const result =transcript.map(t => t.text).join(' ');
            return result 
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