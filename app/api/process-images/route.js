import formidable from "formidable";
import fs from "fs";
import OpenAI from "openai";

export const config = {
  api: {
    bodyParser: false,
  },
};

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req) {
  const form = new formidable.IncomingForm({ multiples: true });

  return new Promise((resolve) => {
    form.parse(req, async (err, fields, files) => {
      if (err) {
        resolve(new Response(JSON.stringify({ error: err.message }), { status: 500 }));
        return;
      }

      const fileArray = Array.isArray(files.files) ? files.files : [files.files];
      const results = [];

      try {
        for (let file of fileArray) {
          const filePath = file.filepath || file.path;
          const fileData = fs.readFileSync(filePath);

          const response = await openai.images.generate({
            model: "gpt-image-1",
            prompt: "Analizza questa immagine",
            size: "256x256",
            image: fileData.toString("base64"),
          });

          results.push(response.data[0].url || "Risultato ricevuto");
        }

        resolve(new Response(JSON.stringify({ results }), { status: 200 }));
      } catch (e) {
        console.error(e);
        resolve(new Response(JSON.stringify({ error: e.message }), { status: 500 }));
      }
    });
  });
}
