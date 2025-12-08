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

    async generateInsights(data: any): Promise<string> {
        const prompt = `
Analyze this 30-day expense dataset and generate helpful insights for the user.

Dataset:
${JSON.stringify(data, null, 2)}

Rules:
- Be friendly and concise.
- Highlight largest categories.
- Mention spending trends.
- Suggest improvements.
- Do NOT repeat the raw numbers unnecessarily.

Return only the insight text.
`;

        const resp = await this.client.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [{ role: "user", content: prompt }],
            max_tokens: 300
        });

        return resp.choices[0].message.content.trim();
    }

    async convertQuery(query: string): Promise<any> {
        const prompt = `
Convert the following user question into a structured JSON query.

User question: "${query}"

Rules:
- Only return JSON.
- JSON format example:
{
  "type": "merchant_total",
  "merchant": "Zomato",
  "timeRange": "last_month"
}

Supported types:
- "merchant_total" (total spent on merchant)
- "category_total"
- "date_range_total"
- "largest_category"
- "recent_expenses"

Return only JSON.
`;

        const resp = await this.client.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [{ role: "user", content: prompt }],
            max_tokens: 150
        });

        let raw = resp.choices[0].message.content.trim();
        raw = raw.replace(/```json/g, '').replace(/```/g, '');

        return JSON.parse(raw);
    }

    async formatQueryAnswer(originalQuery: string, data: any): Promise<string> {
        const prompt = `
The user asked: "${originalQuery}"

Here is the raw database result:
${JSON.stringify(data, null, 2)}

Write a friendly natural language answer summarizing the result.
`;

        const resp = await this.client.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [{ role: "user", content: prompt }],
            max_tokens: 200
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
