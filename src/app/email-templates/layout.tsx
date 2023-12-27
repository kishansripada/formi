import { Metadata } from "next";

// import { PHProvider, PostHogPageview } from "./providers";

export default function RootLayout({
   // Layouts must accept a children prop.
   // This will be populated with nested layouts or pages
   children,
}: {
   children: React.ReactNode;
}) {
   return (
      <html>
         <div className="text-black bg-white h-screen flex flex-row  justify-center ">
            <div className="w-[800px]">{children}</div>
         </div>
      </html>
   );
}
