import { OpenAI } from "openai";

export async function POST(req) {
  try {
    const { text, prompt } = await req.json();

    // Usa la chiave tramite variabile d'ambiente
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "Sei un assistente educativo molto chiaro." },
        { role: "user", content: `${prompt}\nTesto: ${text}` }
      ]
    });

    return new Response(
      JSON.stringify({ result: response.choices[0].message.content }),
      { status: 200 }
    );
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Errore nella risposta dal server" }), {
      status: 500
    });
  }
}
