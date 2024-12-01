import type { Metadata } from "next";
import "./globals.css";


export const metadata: Metadata = {
  title: "Prueba tecnica Cometa",
  description: "Probando mis skills tecnicas",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`antialiased`}
      >
        {children}
      </body>
    </html>
  );
}