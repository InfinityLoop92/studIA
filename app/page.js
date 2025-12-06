"use client";

import { useState, useRef, useEffect } from "react";
import Tesseract from "tesseract.js";
import Webcam from "react-webcam";

export default function Home() {
  const [ocrText, setOcrText] = useState("");
  const [prompt, setPrompt] = useState("");
  const [result, setResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [cameraOpen, setCameraOpen] = useState(false);
  const webcamRef = useRef(null);
  const chatRef = useRef(null);

  useEffect(() => {
    if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight;
  }, [result]);

  const handleOCR = async (imageSrc) => {
    setLoading(true);
    const { data: { text } } = await Tesseract.recognize(imageSrc, "eng");
    setOcrText(text);
    setLoading(false);
  };

  const handleCameraShot = async () => {
    const imageSrc = webcamRef.current.getScreenshot();
    await handleOCR(imageSrc);
    setCameraOpen(false);
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async () => await handleOCR(reader.result);
    reader.readAsDataURL(file);
  };

  const sendToOpenAI = async () => {
    if (!ocrText && !prompt) {
      alert("Inserisci o scansiona un testo o scrivi un prompt!");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/process", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: ocrText, prompt }),
      });
      if (!res.ok) throw new Error("Errore nella risposta dal server");
      const data = await res.json();
      setResult((prev) => [...prev, { prompt, response: data.result }]);
    } catch (err) {
      console.error(err);
      setResult((prev) => [...prev, { prompt, response: "Errore: nessuna risposta dal server" }]);
    } finally {
      setLoading(false);
      setPrompt("");
    }
  };

  return (
    <>
      <style>{`
        @keyframes fadeIn { from {opacity:0; transform:translateY(10px);} to {opacity:1; transform:translateY(0);} }
        .animate-fadeIn { animation: fadeIn 0.3s ease forwards; }
      `}</style>

      <div className="min-h-screen bg-gradient-to-b from-purple-50 to-purple-100 p-4 flex flex-col items-center">
        <div className="flex items-center justify-between w-full max-w-xl mb-6">
          <h1 className="text-4xl font-extrabold text-purple-700">studIA</h1>
          <div className="flex space-x-3">
            <button onClick={() => setCameraOpen(!cameraOpen)}
              className="bg-purple-600 text-white p-2 rounded-full shadow hover:bg-purple-700 transition">📷</button>
            <label className="bg-green-600 text-white p-2 rounded-full shadow hover:bg-green-700 cursor-pointer transition">
              📁
              <input type="file" onChange={handleFileUpload} className="hidden" />
            </label>
          </div>
        </div>

        <div className="bg-white shadow-xl rounded-3xl p-6 w-full max-w-xl flex flex-col space-y-4">
          {cameraOpen && (
            <div className="space-y-2">
              <Webcam ref={webcamRef} screenshotFormat="image/jpeg" className="rounded-xl shadow-md" />
              <button onClick={handleCameraShot}
                className="bg-blue-600 text-white p-2 rounded-lg w-full hover:bg-blue-700 transition">
                Scatta foto
              </button>
            </div>
          )}

          <textarea rows="3" placeholder="Scrivi il tuo prompt..." value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-400 transition" />

          <button onClick={sendToOpenAI}
            className="bg-purple-600 text-white p-3 rounded-2xl w-full hover:bg-purple-700 transition">
            Invia a OpenAI
          </button>

          {loading && <p className="text-gray-500 text-center animate-pulse">Elaborazione...</p>}

          <div ref={chatRef} className="flex flex-col-reverse space-y-3 max-h-96 overflow-y-auto">
            {result.map((r, i) => (
              <div key={i} className="flex flex-col space-y-1 animate-fadeIn">
                <div className="bg-blue-100 p-3 rounded-2xl self-start max-w-[80%] shadow-sm">
                  <span className="font-semibold">Utente:</span> {r.prompt}
                </div>
                <div className="bg-green-100 p-3 rounded-2xl self-end max-w-[80%] shadow-sm">
                  <span className="font-semibold">Bot:</span> {r.response}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
