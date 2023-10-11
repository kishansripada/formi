import { Metadata } from "next";
import "./globals.css";
// import { PHProvider, PostHogPageview } from "./providers";

export default function RootLayout({
   // Layouts must accept a children prop.
   // This will be populated with nested layouts or pages
   children,
}: {
   children: React.ReactNode;
}) {
   return (
      <html lang="en" suppressHydrationWarning>
         <body>{children}</body>
      </html>
   );
}
