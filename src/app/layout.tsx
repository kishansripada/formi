import { Metadata } from "next";
import "./globals.css";
// import { PHProvider, PostHogPageview } from "./providers";
import { ThemeProvider } from "@/components/theme-provider.tsx";

export default function RootLayout({
   // Layouts must accept a children prop.
   // This will be populated with nested layouts or pages
   children,
}: {
   children: React.ReactNode;
}) {
   return (
      <html lang="en" suppressHydrationWarning>
         {/* <PHProvider> */}
         <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
            <body>{children}</body>
         </ThemeProvider>
         {/* </PHProvider> */}
      </html>
   );
}
