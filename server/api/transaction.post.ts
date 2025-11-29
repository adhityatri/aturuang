import { GoogleGenAI, Type } from "@google/genai";

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const apiKey = config.public.geminiKey;

  if (!apiKey) {
    throw createError({
      statusCode: 500,
      statusMessage: "API key not found",
    });
  }

  const body = await readBody(event);
  const image = body.image;
  const categoryList = body.categoryList;

  if (!image) {
    throw createError({
      statusCode: 400,
      statusMessage: "Image is required",
    });
  }

  try {
    const client = new GoogleGenAI({ apiKey });

    const response = await client.models.generateContent({
      model: "gemini-2.5-flash",
      contents: {
        role: "user",
        parts: [
          {
            inlineData: {
              mimeType: "image/jpeg",
              data: image,
            },
          },
          {
            // text: `Analyze this receipt image. Extract the date (YYYY-MM-DD) and the merchant name. Then, extract purchased items (line items). For each item, provide:
            //         1. Description (item name)
            //         2. Amount (total price for that line)
            //         3. Category (guess one in bahasa indonesia : ${categoryList
            //           .map((category) => category.name)
            //           .join(", ")})

            //         CRITICAL RULES:
            //         - Do NOT include discounts, promos, vouchers, or negative adjustments. IGNORE THEM COMPLETELY.
            //         - Do NOT include subtotal, tax, or change.
            //         - Only list the actual products or services bought.`,
            text: `Analyze this receipt image. First, extract all purchased items and categorize them. Then determine if the majority of items are food/drink related.
                  Extraction Rules:
                      1. Extract the date (format: YYYY-MM-DD)
                      2. Extract the merchant name
                      3. Extract all purchased items (line items) - for each item provide:
                        - Description (item name)
                        - Amount (total price for that line)
                        - Category (choose from this list in bahasa indonesia: ${categoryList
                          .filter((cat: any) => cat.type === "expenses")
                          .map((category: any) => category.name)
                          .join(", ")})

                    GLOBAL CATEGORY DETECTION:
                    After extracting all items, analyze if the majority are food/drink related. If 50% or more of items are categorized as 'makanan' or 'minuman', set the global category to 'makanan'. Otherwise, use the most frequently occurring category among the items, or 'belanja' as default.

                    CRITICAL FILTERING RULES:
                    - Do NOT include discounts, promos, vouchers, or negative adjustments. IGNORE THEM COMPLETELY.
                    - Do NOT include subtotal, tax, or change.
                    - Only list the actual products or services bought,
                    - Focus on tangible items bought, not monetary adjustments
                    
                    Output Format:
                      {
                        "date": "YYYY-MM-DD",
                        "merchant": "merchant name",
                        "global_category": "determined category based on majority rule",
                        "items": [
                          {
                            "description": "item name",
                            "amount": number,
                            "category": "category in bahasa indonesia"
                          }
                        ]
                      }
                    `,
          },
        ],
      },
      config: {
        thinkingConfig: {
          thinkingBudget: 0,
        },
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            merchantName: { type: Type.STRING },
            date: { type: Type.STRING },
            type: { type: Type.STRING, enum: ["INCOME", "EXPENSE"] },
            global_category: { type: Type.STRING },
            items: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  description: { type: Type.STRING },
                  amount: { type: Type.NUMBER },
                  category: { type: Type.STRING },
                },
                required: ["description", "amount", "category"],
              },
            },
          },
          required: [
            "items",
            "merchantName",
            "date",
            "type",
            "global_category",
          ],
        },
      },
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");

    return JSON.parse(text);
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to generate response : " + error,
    });
  }
});
