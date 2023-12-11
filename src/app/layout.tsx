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
         {/* <div
            className="pointer-events-none absolute left-[-1000px] top-0   h-[1000px] w-[1700px]"
            style={{
               //    backgroundImage: "-o-radial-gradient(47.64% 52.94%, 37.66% 48.2%, #db2777 0%, rgba(239, 255, 250, 0) 100%)",
               backgroundImage: "radial-gradient(37.66% 48.2% at 47.64% 52.94%, #db2777 0%, rgba(239, 255, 250, 0) 100%)",
               // right: -400,
               top: -700,
               // top: -150,

               opacity: 0.2,
            }}
         ></div>
         <div
            className="pointer-events-none absolute right-[-1000px] top-0   h-[1000px] w-[1700px]"
            style={{
               //    backgroundImage: "-o-radial-gradient(47.64% 52.94%, 37.66% 48.2%, #db2777 0%, rgba(239, 255, 250, 0) 100%)",
               backgroundImage: "radial-gradient(37.66% 48.2% at 47.64% 52.94%, #9333ea 0%, rgba(239, 255, 250, 0) 100%)",
               // right: -400,
               top: -200,
               // top: -150,

               opacity: 0.3,
            }}
         ></div>
         <div
            className="pointer-events-none absolute right-[-200px] top-0   h-[1000px] w-[1700px]"
            style={{
               //    backgroundImage: "-o-radial-gradient(47.64% 52.94%, 37.66% 48.2%, #db2777 0%, rgba(239, 255, 250, 0) 100%)",
               backgroundImage: "radial-gradient(37.66% 48.2% at 47.64% 52.94%, #9333ea 0%, rgba(239, 255, 250, 0) 100%)",
               // right: -400,
               top: 500,
               // top: -150,

               opacity: 0.1,
            }}
         ></div> */}
         <body className="bg-[#171117]sss bg-neutral-900">{children}</body>
      </html>
   );
}
