import "./globals.css";


export const metadata = {
  title: "My Blog",
  description: "A modern blog platform built with Next.js and MongoDB",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}


