"use client";

import { useState } from "react";

export default function Page() {
  const [message, setMessage] = useState("");
  const [images, setImages] = useState([]);
  const [chat, setChat] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleFiles = (e) => {
    const filesArray = Array.from(e.target.files);
    setImages(filesArray);
  };

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message && images.length === 0) return;

    setLoading(true);

    const formData = new FormData();
    formData.append("message", message);
    images.forEach((img) => formData.append("files", img));

    try {
      const res = await fetch("/api/process-images", { method: "POST", body: formData });
      const data = await res.json();

      setChat((prev) => [...prev, { user: message, bot: data.answer }]);
      setMessage("");
      setImages([]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <img src="/icon-512.png" alt="Logo" style={{ width: "200px", height: "auto", marginBottom: "20px" }} />

      <form onSubmit={handleSubmit}>
        <textarea
          placeholder="Scrivi il tuo prompt qui..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={3}
          style={{ width: "100%" }}
        />

        <input type="file" multiple onChange={handleFiles} />

        {/* Preview immagini selezionate */}
        <div style={{ display: "flex", gap: "10px", marginTop: "10px", flexWrap: "wrap" }}>
          {images.map((img, i) => (
            <div key={i} style={{ position: "relative" }}>
              <img
                src={URL.createObjectURL(img)}
                alt="preview"
                style={{ width: "100px", height: "100px", objectFit: "cover" }}
              />
              <button
                type="button"
                onClick={() => removeImage(i)}
                style={{
                  position: "absolute",
                  top: 0,
                  right: 0,
                  background: "red",
                  color: "white",
                  border: "none",
                  borderRadius: "50%",
                  width: "20px",
                  height: "20px",
                  cursor: "pointer",
                }}
              >
                ×
              </button>
            </div>
          ))}
        </div>

        <button type="submit" disabled={loading} style={{ marginTop: "10px" }}>
          {loading ? "Elaborazione..." : "Invia"}
        </button>
      </form>

      <div style={{ marginTop: "20px" }}>
        {chat.map((item, i) => (
          <div key={i} style={{ marginBottom: "20px" }}>
            <strong>Tu:</strong> {item.user} <br />
            <strong>Bot:</strong> {item.bot}
          </div>
        ))}
      </div>
    </div>
  );
}
