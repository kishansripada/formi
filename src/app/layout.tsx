import { Metadata } from "next";
import "./globals.css";
// import { PHProvider, PostHogPageview } from "./providers";
if (typeof Node === "function" && Node.prototype) {
   const originalRemoveChild = Node.prototype.removeChild;
   Node.prototype.removeChild = function (child) {
      console.log("removeChild...");
      console.log("this", this);
      console.log("this.outerHTML", this.outerHTML);
      console.log("child", child);
      console.log(
         "this.childNodes",
         this.childNodes.length,
         Array.prototype.slice.call(this.childNodes).map((child) => console.warn("child.nodeValue", child.nodeValue, child.outerHTML))
      );
      console.log("child.parentNode", child.parentNode.outerHTML);
      // debugger;
      if (child.parentNode !== this) {
         if (console) {
            console.error("Cannot remove a child from a different parent", child, this);
         }
         return child;
      }
      return originalRemoveChild.apply(this, arguments);
   };
}
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
