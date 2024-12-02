import { TopBar } from "@/components/TopBar/TopBar";
import "./globals.css";


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
        <TopBar/>
        <div className="max-w-screen-2xl mx-auto py-12">
        {children}
        </div>
        <div className='mx-auto fixed bottom-0 right-[38%]'>
        <small >Desarrollado con ❤️ por <a href="https://github.com/thecamo1509" target="_blank" rel="noreferrer">Camilo Morales</a> Posdata: <strong className="text-transparent">Contratenme 😃</strong></small>
      </div>
      </body>
    </html>
  );
}
