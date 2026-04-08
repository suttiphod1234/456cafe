import { Injectable } from '@nestjs/common';
import { GoogleGenerativeAI } from '@google/generative-ai';

@Injectable()
export class AiService {
  private genAI: GoogleGenerativeAI;
  private model: any;

  constructor() {
    const apiKey = process.env.GEMINI_API_KEY || '';
    if (apiKey) {
      this.genAI = new GoogleGenerativeAI(apiKey);
      this.model = this.genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    }
  }

  async recommendCoffee(userInput: string, products: any[]) {
    if (!this.model) return "I can't recommend coffee right now, but our Dirty Coffee is great!";

    const productList = products.map(p => `${p.name}: ${p.description} (฿${p.price})`).join('\n');
    
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
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Gemini error:', error);
      return "Based on your mood, I'd suggest our signature Dirty Coffee!";
    }
  }

  async translate(text: string, targetLanguage: 'Thai' | 'English') {
    if (!this.model) return "Translation service unavailable.";

    const prompt = `
      Translate the following text into ${targetLanguage}. 
      Return ONLY the translated text without any explanations or quotes.
      
      Text: "${text}"
    `;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text().trim();
    } catch (error) {
      console.error('Translation error:', error);
      return "Translation failed. Please try again.";
    }
  }
}
