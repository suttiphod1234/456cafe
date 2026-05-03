interface ProductSummary {
    name: string;
    description?: string | null;
    price: number;
}
export declare class AiService {
    private genAI;
    private model;
    constructor();
    recommendCoffee(userInput: string, products: ProductSummary[]): Promise<string>;
    translate(text: string, targetLanguage: 'Thai' | 'English'): Promise<string>;
}
export {};
