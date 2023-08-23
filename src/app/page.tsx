import Client from "./client";
import type { Metadata } from "next";

const home = () => {
   return (
      <>
         <Client></Client>
      </>
   );
};

export const metadata: Metadata = {
   title: "FORMI: design and plan stunning choreography",
   description:
      "Revolutionize your performance planning with our choreography and stage management app. Perfect for choreographers, cheerleaders, and stage managers seeking an easy way to create and visualize formations.",
   keywords: [
      "choreography app",
      "choreography app free",
      "dance app free",
      "choreography formation app",
      "dance app formations",
      "dance formation maker",
   ],

   twitter: {
      card: "summary",
      site: "@formiapp",
      images: "https://i.imgur.com/83VsfSG.png",
   },
   openGraph: {
      title: "FORMI",
      description:
         "Revolutionize your performance planning with our choreography and stage management app. Perfect for choreographers, cheerleaders, and stage managers seeking an easy way to create and visualize formations.",
      images: "https://i.imgur.com/83VsfSG.png",
   },
};

export default home;
