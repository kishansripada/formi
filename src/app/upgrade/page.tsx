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
      "dance formation software",
      "cheerleading formation maker",
      "stage management tools",
      "choreography formation tool",
      "app for choreographers",
      "cheerleader practice app",
      "stage manager planning software",
      "dance position planner",
      "cheerleading formation app",
      "stage blocking software",
      "performance choreography software",
      "dance team formation planner",
      "cheer routine creator",
      "stage management formation app",
      "dance formation app",
      "app for dance formations",
      "formation app for dance",
   ],

   twitter: {
      card: "summary",
      site: "@formiapp",
      images: "https://i.imgur.com/83VsfSG.png",
   },
};

export default home;
