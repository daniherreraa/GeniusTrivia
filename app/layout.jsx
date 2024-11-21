import localFont from "next/font/local";
import "./globals.css";

const gabaritoFont = localFont({
  src: "./fonts/GabaritoVF.ttf",
  display: "swap"
});

export const metadata = {
  title: "Genius: The Trivia Game",
  description: "Are you a genius? You sure are! Prove it by playing now."
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${gabaritoFont.className} antialiased`}>
        {children}
      </body>
    </html>
  );
}
