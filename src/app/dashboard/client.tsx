"use client";

import Link from "next/link";
import { PerformancePreview } from "./_components/PerformancePreview";
import { v4 as uuidv4 } from "uuid";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
export default function Client({ myDances, sharedWithMe, session, plan }) {
   const supabase = createClientComponentClient();
   const router = useRouter();
   const videos = [
      { url: "uiTwpkpsL1E", title: "Tutorial/Demo" },
      { url: "JRS1tPHJKAI", title: "Welcome to FORMI" },
      { url: "pY0IUM1ebHE", title: "Previous formation settings" },
      { url: "rhGn486vJJc", title: "What's a set piece?" },
   ];
   async function createNewDance(roster?: any) {
      if (session === null) {
         router.push(`/login`);
         return;
      }

      if (roster?.roster?.length) {
         roster.roster = roster.roster.map((dancer) => {
            return { ...dancer, id: uuidv4() };
         });
         const { data, error } = await supabase
            .from("dances")
            .insert([
               {
                  user: session.user.id,
                  last_edited: new Date(),
                  dancers: roster.roster,
                  formations: [
                     {
                        name: "First formation",
                        id: uuidv4(),
                        positions: roster.roster.map((dancer, index) => {
                           return { id: dancer.id, position: { x: index - 18, y: 0 } };
                        }),
                        durationSeconds: 3,
                        transition: { durationSeconds: 3 },
                     },
                  ],
               },
            ])
            .select("id")
            .single();
         if (!data?.id) return;
         router.refresh();
         router.push(`/${data.id}/edit`);
         return;
      }
      const { data, error } = await supabase
         .from("dances")
         .insert([{ user: session.user.id, last_edited: new Date() }])
         .select("id")
         .single();

      if (!data?.id) return;
      router.push(`/${data.id}/edit`);
   }
   return (
      <>
         <div className=" pb-10 h-full flex flex-col overflow-hidden">
            <button
               onClick={() => {
                  createNewDance();
               }}
               className="bg-pink-600  mb-6 lg:hidden  mt-3 w-full text-white text-xs py-2 px-4  rounded-lg mr-auto "
            >
               New performance
            </button>
            <div className="lg:h-[310px] lg:min-h-[310px] h-full  overflow-scroll bg-neutral-900 rounded-xl border-2 border-neutral-800 ">
               <div className="flex flex-row items-center justify-between p-5">
                  <p className=" text-sm">Recents</p>
                  <Link
                     href={"/dashboard/myperformances"}
                     className="flex flex-row items-center text-xs border border-neutral-700 px-3 py-1 rounded-full"
                  >
                     <p>All my files</p>
                     <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-4 h-4 ml-2"
                     >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
                     </svg>
                  </Link>
               </div>

               <div className="flex lg:flex-row flex-col  px-5">
                  {myDances.length ? (
                     [...myDances.filter((dance) => !dance.isInTrash), ...sharedWithMe.filter((dance) => !dance.isInTrash)]
                        .sort((a, b) => new Date(b.last_edited) - new Date(a.last_edited))
                        .slice(0, 4)
                        ?.map((dance) => {
                           return (
                              <>
                                 <div className="w-full mr-5 max-w-[300px]">
                                    <PerformancePreview dance={dance}></PerformancePreview>
                                 </div>
                              </>
                           );
                        })
                  ) : (
                     <p className="text-sm">Click new performance to create your first performance</p>
                  )}
               </div>
            </div>
            <div className=" h-full bg-neutral-900 mt-10 py-5 hidden lg:block  rounded-xl border-2 border-neutral-800">
               {/* <p className=" text-sm">Tutorials</p> */}
               <div className="flex flex-row  h-full px-6">
                  {videos.map((video) => {
                     return (
                        <iframe
                           src={`https://www.youtube.com/embed/${video.url}?rel=0&modestbranding=1&showinfo=0&controls=0`}
                           title="YouTube video player"
                           width="200"
                           allow="accelerometer; autoplay; clipboard-write; encrypted-media;
gyroscope; picture-in-picture;
web-share"
                           height="100%"
                           className=" rounded-xl  mr-6"
                        ></iframe>
                     );
                  })}
               </div>
            </div>
         </div>
      </>
   );
}
