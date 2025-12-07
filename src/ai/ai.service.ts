import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';

@Injectable()
export class AiService {
    private client: OpenAI;

    constructor() {
        this.client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    }

    async suggestCategory(title: string): Promise<string> {
        const prompt = `
      Suggest the best category for this expense title:
      Categories: ["Food", "Travel", "Shopping", "Subscription", "Groceries", "Bills", "Health", "Entertainment", "Other"]

      Title: "${title}"

      Return ONLY the category.
    `;

        const resp = await this.client.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [{ role: "user", content: prompt }],
            max_tokens: 10,
        });

        return resp.choices[0].message.content.trim();
    }

    async parseExpense(text: string) {
        const prompt = `
You MUST return ONLY valid JSON. 
No backticks, no markdown, no explanations.

Extract:
- title
- amount
- category (Food, Travel, Shopping, Subscription, Groceries, Bills, Health, Entertainment, Other)

Input: "${text}"

Return ONLY:
{
 "title": "",
 "amount": 0,
 "category": ""
}
`;

        const resp = await this.client.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [{ role: "user", content: prompt }],
            max_tokens: 150
        });

        let raw = resp.choices[0].message.content || "";

        // Clean model output from unwanted characters
        raw = raw
            .trim()
            .replace(/```json/gi, "")
            .replace(/```/g, "")
            .replace(/`/g, "");

        try {
            return JSON.parse(raw);
        } catch (e) {
            console.error("AI JSON PARSE ERROR:", raw);
            throw new Error("AI failed to return valid JSON");
        }
    }



}
