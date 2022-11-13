import type { NextPage } from "next";
import { Auth, ThemeSupa } from "@supabase/auth-ui-react";
import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";
import { useState } from "react";

const Test: NextPage = () => {
   const session = useSession();
   const supabase = useSupabaseClient();
   const [flipFront, setFlipFront] = useState<boolean>(true);
   const [flipBack, setFlipBack] = useState<boolean>(false);

   return (
      <div className="flex flex-col h-screen">
         <div className="flex flex-row w-full justify-around">
            <h1 className="text-3xl">Front</h1>
            <h1 className="text-3xl">Back</h1>
         </div>
         <div className="flex flex-row w-full justify-around h-full">
            <iframe
               // width="100%"
               // height="100%"
               style={{
                  transform: flipFront ? "scaleX(-1)" : "",
               }}
               src="https://www.youtube.com/embed/YqxJ-A9x2H0"
               title="Best Girl Bhangra to Hon Wala Sardar"
               // frameborder="0"
               allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
               allowFullScreen={false}
            ></iframe>
            <iframe
               style={{
                  transform: flipBack ? "scaleX(-1)" : "",
               }}
               // width="100%"
               // height="100%"
               src="https://www.youtube.com/embed/YqxJ-A9x2H0"
               title="Best Girl Bhangra to Hon Wala Sardar"
               // frameborder="0"
               allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
               allowFullScreen={false}
            ></iframe>
         </div>
         <div className="flex flex-row w-full justify-around">
            <button className="text-3xl bg-blue-400 text-white px-10 py-1 rounded-xl" onClick={() => setFlipFront((flipFront) => !flipFront)}>
               flip
            </button>
            <button className="text-3xl bg-blue-400 text-white px-10 py-1 rounded-xl" onClick={() => setFlipBack((flipBack) => !flipBack)}>
               flip
            </button>
         </div>
         <iframe
            scrolling="no"
            frameBorder="no"
            id="iframe"
            width="100%"
            height="120"
            allow="autoplay"
            src={`https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/967047832&color=%23b42ae7`}
         ></iframe>
      </div>
   );
};

export default Test;
