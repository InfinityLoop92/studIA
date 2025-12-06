import formidable from "formidable";
import fs from "fs";
import path from "path";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  const form = new formidable.IncomingForm({ multiples: true });

  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    const fileArray = Array.isArray(files.files) ? files.files : [files.files];
    const results = [];

    try {
      for (let file of fileArray) {
        const filePath = file.filepath || file.path;
        const fileData = fs.readFileSync(filePath);

        // Invio a OpenAI (ad esempio come analisi immagine)
        const response = await openai.images.generate({
          model: "gpt-image-1",
          prompt: "Analizza questa immagine",
          size: "256x256",
          image: fileData.toString("base64"), // alcune API richiedono base64
        });

        results.push(response.data[0].url || "Risultato ricevuto");
      }

      res.status(200).json({ results });
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: e.message });
    }
  });
}
