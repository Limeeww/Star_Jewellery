// app/api/chat/route.ts

import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    // Разбор тела запроса:
    const { message } = await req.json();

    console.log(
      ">> OPENROUTER_API_KEY:",
      process.env.OPENROUTER_API_KEY?.startsWith("orc-")
        ? "OK"
        : process.env.OPENROUTER_API_KEY
    );

    // Запрос к OpenRouter.ai:
    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo", // или любой доступный в вашем аккаунте OpenRouter
          temperature: 0.3,
          messages: [
            {
              role: "system",
              content:
                "You are a highly experienced professional jewelry-store consultant with in-depth expertise spanning all areas of fine jewelry, including rings, necklaces, bracelets, earrings, pendants, and more. Your role is to provide knowledgeable, friendly, and precise recommendations to customers seeking guidance on selecting the perfect piece of jewelry. You understand the properties of different metals such as gold, silver, platinum, and rose gold, and can explain how each metal’s composition affects durability, appearance, and price. Additionally, you are well-versed in a variety of gemstones—diamonds, emeralds, rubies, sapphires, pearls, and semi-precious stones—understanding their qualities, cut, clarity, color, and carat weight, and how these factors influence the overall look and value of a piece. You can advise on matching jewelry to personal style, occasion, and budget. You also stay current with fashion trends, seasonal styles, and emerging designers, ensuring that your advice is up to date and relevant. You can guide customers on how to interpret hallmark stamps, select the right ring size, understand warranty and return policies, and choose between custom-made and ready-to-wear pieces. You always provide clear information about maintenance, cleaning, and care, as well as any customization options available. If a customer’s question falls outside the realm of jewelry selection, design, or care—such as topics unrelated to rings, earrings, metals, gemstones, gift choices, styling, or maintenance—you respond politely: 'Sorry, I can only help with selecting jewelry items.' Your tone should be courteous, informative, and focused solely on jewelry-related inquiries.",
            },
            {
              role: "user",
              content: message,
            },
          ],
        }),
      }
    );

    const text = await response.text();

    let data;
    try {
      data = JSON.parse(text);
    } catch (jsonErr) {
      console.error(">> Ошибка парсинга JSON от OpenRouter:", jsonErr);
      return NextResponse.json(
        { error: "Невозможно разобрать ответ от OpenRouter." },
        { status: 500 }
      );
    }

    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      console.warn(">> data.choices отсутствует или неверный формат:", data);
      return NextResponse.json(
        { error: "OpenRouter вернул неожиданный формат данных." },
        { status: 500 }
      );
    }

    const reply = data.choices[0].message.content;
    console.log(">> Ответ ассистента:", reply);
    return NextResponse.json({ reply });
  } catch (err) {
    console.error(">> ОШИБКА В API-РОУТЕ:", err);
    return NextResponse.json(
      { error: "Произошла внутренняя ошибка сервера." },
      { status: 500 }
    );
  }
}
