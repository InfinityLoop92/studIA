import React, { useState } from "react";

export default function App() {
  const [files, setFiles] = useState([]);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    setFiles(Array.from(e.target.files));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (files.length === 0) return;

    setLoading(true);
    setResults([]);

    const formData = new FormData();
    files.forEach((file) => formData.append("files", file));

    try {
      const res = await fetch("/api/process-images", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        throw new Error(`Errore API: ${res.statusText}`);
      }

      const data = await res.json();
      setResults(data.results);
    } catch (err) {
      console.error(err);
      alert("Errore durante l'elaborazione delle immagini.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h1>Upload multiplo immagini</h1>

      <form onSubmit={handleSubmit}>
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileChange}
        />
        <button type="submit" disabled={loading} style={{ marginLeft: "1rem" }}>
          {loading ? "Caricamento..." : "Invia"}
        </button>
      </form>

      <div style={{ marginTop: "2rem" }}>
        {results.length > 0 && <h2>Risultati:</h2>}
        <ul>
          {results.map((res, i) => (
            <li key={i}>{res}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
