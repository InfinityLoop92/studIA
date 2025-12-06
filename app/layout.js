import "./globals.css";
import Head from "next/head";

export const metadata = {
  title: "studIA",
  description: "OCR Chatbot per studiare con AI",
};

export default function RootLayout({ children }) {
  return (
    <html lang="it">
      <Head>
        {/* PWA manifest */}
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#7c3aed" />

        {/* Icone */}
        <link rel="icon" href="/icon-192.png" sizes="192x192" />
        <link rel="apple-touch-icon" href="/icon-512.png" />

        {/* Meta base */}
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="studIA - OCR Chatbot per studiare" />
      </Head>
      <body className="bg-gradient-to-b from-purple-50 to-purple-100 font-sans">
        {children}
      </body>
    </html>
  );
}
