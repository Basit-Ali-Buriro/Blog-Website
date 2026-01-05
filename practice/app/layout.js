import "./globals.css";
import Providers from "./components/Providers";


export const metadata = {
  title: "My Blog",
  description: "A modern blog platform built with Next.js and MongoDB",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}


