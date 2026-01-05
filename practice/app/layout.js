import "./globals.css";
import Providers from "./components/Providers";


export const metadata = {
  title: "BlogSpace - Share Your Stories",
  description: "A modern full-stack blog platform with rich features including tags, SEO optimization, reading time estimates, and more. Built with Next.js, MongoDB, and Tailwind CSS.",
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


