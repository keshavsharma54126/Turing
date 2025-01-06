import { GeminiService } from "@repo/db/client";
import { VectorService } from "@repo/db/client";
import * as pdfjsLib from 'pdfjs-dist';
import { load } from 'cheerio';
import axios from 'axios';
import { YoutubeTranscript } from 'youtube-transcript';

export class ContentProcessorService {
    static async processContent(content: {
        pdfs?: File[],
        slides?: File[],
        videoUrls?: string[],
        websiteUrls?: string[]
    }) {
        const extractedContent = await Promise.all([
            ...content.pdfs ? content.pdfs.map(this.extractFromPDF) : [],
            ...content.slides ? content.slides.map(this.extractFromSlides) : [],
            ...content.videoUrls ? content.videoUrls.map(this.extractFromVideo) : [],
            ...content.websiteUrls ? content.websiteUrls.map(this.extractFromWebsite) : []
        ]);

        // Combine and chunk content
        const combinedContent = extractedContent.join('\n\n');
        const chunks = this.chunkContent(combinedContent);

        // Generate embeddings and store in vector store
        for (const chunk of chunks) {
            const embedding = await GeminiService.generateEmbedding(chunk);
            await VectorService.storeEmbedding(chunk, embedding);
        }

        return combinedContent;
    }

    private static async extractFromPDF(file: File): Promise<string> {
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument(arrayBuffer).promise;
        let text = '';
        
        for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const content = await page.getTextContent();
            text += content.items.map((item: any) => item.str).join(' ');
        }
        
        return text;
    }

    private static async extractFromVideo(url: string): Promise<string> {
        const transcript = await YoutubeTranscript.fetchTranscript(url);
        return transcript.map(t => t.text).join(' ');
    }

    private static async extractFromWebsite(url: string): Promise<string> {
        const { data } = await axios.get(url);
        const $ = load(data);
        // Remove scripts, styles, etc.
        $('script, style, meta, link').remove();
        return $('body').text().trim();
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