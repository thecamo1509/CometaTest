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
        className={`antialiased flex flex-col justify-start md:justify-between`}
      >
        <TopBar/>
        <div className="max-w-screen md:max-w-screen-2xl py-12 px-4 mx-auto">
          {children}
        </div>
        <div className='hidden md:flex justify-center my-4 bottom-0'>
          <small >Desarrollado con ❤️ por <a href="https://github.com/thecamo1509" target="_blank" rel="noreferrer">Camilo Morales</a> Posdata: <strong className="text-slate-300/30">Contratenme 😃</strong></small>
        </div>
      </body>
    </html>
  );
}
