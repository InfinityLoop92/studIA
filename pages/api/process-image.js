import formidable from "formidable";
import fs from "fs";
import OpenAI from "openai";

export const config = {
  api: {
    bodyParser: false, // importante per ricevere file
  },
};

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const form = new formidable.IncomingForm();
  form.multiples = true; // permette più file
  form.uploadDir = "./uploads"; // cartella temporanea per salvare i file
  form.keepExtensions = true;

  // assicurati che la cartella uploads esista
  if (!fs.existsSync("./uploads")) {
    fs.mkdirSync("./uploads");
  }

  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    try {
      const images = Array.isArray(files.images)
        ? files.images
        : [files.images];

      const results = [];

      for (const image of images) {
        const fileData = fs.readFileSync(image.filepath);

        const response = await openai.images.analyze({
          model: "gpt-image-1",
          image: fileData,
        });

        results.push({
          filename: image.originalFilename,
          result: response.data[0],
        });

        // opzionale: cancella file temporaneo
        fs.unlinkSync(image.filepath);
      }

      res.status(200).json({ results });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  });
}
