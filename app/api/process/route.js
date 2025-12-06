// app/api/process/route.js
import { NextResponse } from "next/server";
import OpenAI from "openai";

export async function POST(req) {
  try {
    // Riceve dal client: text (OCR) + prompt (istruzioni)
    const { text = "", prompt = "" } = await req.json();

    // Inizializzazione OpenAI con variabile d'ambiente
    const client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY, // ← FUNZIONA sia in locale sia su Vercel
    });

    // Chiamata al modello
    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "Sei un assistente educativo molto chiaro e conciso.",
        },
        {
          role: "user",
          content: `${prompt}\n\nTesto OCR:\n${text}`,
        },
      ],
      temperature: 0.2,
      max_tokens: 800,
    });

    const out = completion.choices?.[0]?.message?.content ?? "";
    return NextResponse.json({ result: out }, { status: 200 });

  } catch (err) {
    console.error("API /process error:", err);
    return NextResponse.json(
      { error: "Errore nella richiesta al server" },
      { status: 500 }
    );
  }
}
