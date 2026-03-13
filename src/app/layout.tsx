import type { Metadata } from "next";
import "./globals.css";



export const metadata: Metadata = {
  title: "Flowboard - Your Team's Task Management Solution",
  description: "Modern SaaS task management platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className="bg-neutral-950 text-white font-sans"
      suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
