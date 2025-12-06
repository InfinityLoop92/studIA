"use client";

import { useState } from "react";

export default function Page() {
  const [images, setImages] = useState([]);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleFiles = (e) => {
    setImages(Array.from(e.target.files));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    images.forEach((img) => formData.append("files", img));

    try {
      const res = await fetch("/api/process-images", { method: "POST", body: formData });
      const data = await res.json();
      setResults(data.results || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Carica immagini</h1>
      <form onSubmit={handleSubmit}>
        <input type="file" multiple onChange={handleFiles} />
        <button type="submit" disabled={loading}>
          {loading ? "Elaborazione..." : "Invia"}
        </button>
      </form>

      <div style={{ marginTop: "20px" }}>
        {results.map((url, i) => (
          <div key={i}>
            <img src={url} alt={`result-${i}`} width="256" />
          </div>
        ))}
      </div>
    </div>
  );
}
