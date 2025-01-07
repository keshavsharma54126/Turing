declare module 'pdf2json' {
    interface PDFPage {
        Texts: {
            R: {
                T: string;
            }[];
        }[];
    }

    interface PDFData {
        Pages: PDFPage[];
    }

    class PDFParser {
        constructor();
        on(event: 'pdfParser_dataReady', callback: (pdfData: PDFData) => void): void;
        on(event: 'pdfParser_dataError', callback: (error: Error) => void): void;
        parseBuffer(buffer: Buffer): void;
    }

    export default PDFParser;
}