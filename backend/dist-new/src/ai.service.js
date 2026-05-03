"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AiService = void 0;
const common_1 = require("@nestjs/common");
const generative_ai_1 = require("@google/generative-ai");
let AiService = class AiService {
    genAI = null;
    model = null;
    constructor() {
        const apiKey = process.env.GEMINI_API_KEY ?? '';
        if (apiKey) {
            this.genAI = new generative_ai_1.GoogleGenerativeAI(apiKey);
            this.model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
        }
    }
    async recommendCoffee(userInput, products) {
        if (!this.model)
            return "I can't recommend coffee right now, but our Dirty Coffee is great!";
        const productList = products
            .map((p) => `${p.name}: ${p.description ?? ''} (฿${p.price})`)
            .join('\n');
        const prompt = `
      You are an expert barista at "456 Coffee". 
      A customer says: "${userInput}"
      
      Here is our menu:
      ${productList}
      
      Suggest the best coffee for them. Keep it short (max 2 sentences) and friendly.
      IMPORTANT: Please respond entirely in Thai (ภาษาไทย).
    `;
        try {
            const result = await this.model.generateContent(prompt);
            const response = result.response;
            return response.text();
        }
        catch (error) {
            console.error('Gemini error:', error);
            return "Based on your mood, I'd suggest our signature Dirty Coffee!";
        }
    }
    async translate(text, targetLanguage) {
        if (!this.model)
            return 'Translation service unavailable.';
        const prompt = `
      Translate the following text into ${targetLanguage}. 
      Return ONLY the translated text without any explanations or quotes.
      
      Text: "${text}"
    `;
        try {
            const result = await this.model.generateContent(prompt);
            const response = result.response;
            return response.text().trim();
        }
        catch (error) {
            console.error('Translation error:', error);
            return 'Translation failed. Please try again.';
        }
    }
};
exports.AiService = AiService;
exports.AiService = AiService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], AiService);
//# sourceMappingURL=ai.service.js.map