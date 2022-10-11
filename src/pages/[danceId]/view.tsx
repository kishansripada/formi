import { useState, useEffect, useRef, useCallback } from "react";

import { supabase } from "../../utils/supabase";
import { useRouter } from "next/router";
import { DancerAlias } from "../../components/AppComponents/DancerAlias";
import { DancerAliasShadow } from "../../components/AppComponents/DancerAliasShadow";

import { Canvas } from "../../components/AppComponents/Canvas";
import { EditDancer } from "../../components/AppComponents/EditDancer";
import { Layers } from "../../components/AppComponents/Layers";
import Link from "next/link";
import dynamic from "next/dynamic";
import Head from "next/head";
import { isMobile } from "react-device-detect";
const Header = dynamic<{
   saved: boolean;
   setSoundCloudTrackId: Function;
   session: any;
   danceName: string;
   setDanceName: Function;
   setSession: Function;
   soundCloudTrackId: string | null;
   setShowPreviousFormation: Function;
   showPreviousFormation: boolean;
}>(() => import("../../components/AppComponents/Header").then((mod) => mod.Header), {
   ssr: false,
});

const SoundCloudComponent = dynamic<{
   setPosition: Function;
   setIsPlaying: Function;
   setSongDuration: Function;
   songDuration: number | null;
   soundCloudTrackId: string | null;
   setSoundCloudTrackId: Function;
   setSelectedFormation: Function;
   setFormations: Function;
}>(() => import("../../components/AppComponents/SoundCloudComponent").then((mod) => mod.SoundCloudComponent), {
   ssr: false,
});

import { dancer, dancerPosition, formation } from "../../types/types";
import { Session } from "@supabase/supabase-js";

const View = ({ session, setSession }: { session: Session; setSession: Function }) => {
   const [songDuration, setSongDuration] = useState<number | null>(null);
   const [dancers, setDancers] = useState<dancer[]>([]);
   const [position, setPosition] = useState<number | null>(null);
   const [isPlaying, setIsPlaying] = useState<boolean>(false);
   const [selectedFormation, setSelectedFormation] = useState<number | null>(0);

   const [formations, setFormations] = useState<formation[]>([
      {
         durationSeconds: 10,
         positions: [],
         transition: {
            durationSeconds: 5,
         },
         name: "Untitled",
      },
   ]);
   const [soundCloudTrackId, setSoundCloudTrackId] = useState<string | null>(null);
   const [selectedDancers, setSelectedDancers] = useState<string[]>([]);
   const [danceName, setDanceName] = useState<string>("Untitled Dance");
   const [saved, setSaved] = useState<boolean>(true);
   const [editingDancer, setEditingDancer] = useState<string | null>(null);
   const [showPreviousFormation, setShowPreviousFormation] = useState<boolean>(false);
   const [mobile, setMobile] = useState<string | null>(null);
   const [noAccess, setNoAccess] = useState<boolean>(false);

   useEffect(() => {
      setSelectedDancers([]);
   }, [selectedFormation]);

   useEffect(() => {
      if (isMobile) {
         setMobile(true);
      }
   }, [isMobile]);
   const router = useRouter();

   useEffect(() => {
      if (router.query.danceId) {
         supabase
            .from("dances")
            .select("*")
            .eq("id", router.query.danceId)
            .then((r) => {
               if (!r?.data?.length) {
                  setNoAccess(true);
                  return;
               }
               let { soundCloudId, dancers, formations, name } = r?.data?.[0];
               setSoundCloudTrackId(soundCloudId);
               setFormations(formations);
               setDancers(dancers);
               setDanceName(name);
            });
      }
   }, [router.query.danceId]);

   return (
      <>
         <Head>
            <title> Naach — Expression Through Movement.</title>

            <meta name="description" content="automate, animate and visualize your dance formations synced to music" />
            <meta name="keywords" content="dance, choreography, desi, formations" />
            <meta name="twitter:card" content="summary" />
            <meta name="twitter:title" content="Naach — Expression Through Movement." />
            <meta name="twitter:image" content="https://i.imgur.com/woDsnv8.png" />
            <meta property="og:type" content="song" />
            <meta property="og:title" content="Naach — Expression Through Movement." />
            <meta property="og:description" content="automate, animate and visualize your dance formations synced to music" />
            <meta property="og:image" content="https://i.imgur.com/woDsnv8.png" />
            <meta property="og:site_name" content="Naach — Expression Through Movement." />
         </Head>
         {mobile ? (
            <>
               <div className="fixed top-0 left-0 z-[100] flex h-screen w-screen items-center justify-center bg-black/95 backdrop-blur-[2px]">
                  <div className="flex  w-[700px] flex-col rounded-xl bg-white">
                     <div className="flex flex-col rounded-xl px-10 py-10 h-full text-center">
                        <div className="flex flex-col mt-auto">
                           editing dances with Naach is unfortunately not yet optimized for mobile devices, please visit naach.app on your desktop to
                           edit your formations
                        </div>
                     </div>
                  </div>
               </div>
            </>
         ) : (
            <></>
         )}
         {noAccess ? (
            <>
               <div className="fixed top-0 left-0 z-[100] flex h-screen w-screen items-center justify-center bg-black/70 backdrop-blur-[8px]">
                  <div className="flex  w-[700px] flex-col rounded-xl bg-white">
                     <div className="flex flex-col rounded-xl px-10 py-10 h-full text-center">
                        <div className="flex flex-col mt-auto">you don't have access to this dance 🫢</div>
                        <Link href="/mydances">
                           <a className="ml-2  px-2 py-1 rounded-md text-pink-600"> back to my dances</a>
                        </Link>
                     </div>
                  </div>
               </div>
            </>
         ) : (
            <></>
         )}
         <Head>
            <title>View | Naach</title>
         </Head>

         {editingDancer !== null ? (
            <EditDancer setDancers={setDancers} dancers={dancers} setEditingDancer={setEditingDancer} editingDancer={editingDancer}></EditDancer>
         ) : (
            <></>
         )}

         <div className="flex flex-col h-screen overflow-hidden bg-[#fafafa] overscroll-y-none">
            <Header
               soundCloudTrackId={soundCloudTrackId}
               session={session}
               saved={saved}
               setSoundCloudTrackId={setSoundCloudTrackId}
               danceName={danceName}
               setSession={setSession}
               setDanceName={setDanceName}
               showPreviousFormation={showPreviousFormation}
               setShowPreviousFormation={setShowPreviousFormation}
            />
            <div className="flex flex-row grow overflow-hidden justify-between">
               <div className="w-full mb-5 mt-1 flex flex-row items-center justify-center">
                  <iframe
                     className="h-full "
                     src="https://www.youtube.com/embed/Zw6w3skoiOo"
                     title="YouTube video player"
                     frameborder="0"
                     allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                     allowfullscreen
                  ></iframe>
               </div>
               <div className="flex flex-col h-full items-center  pointer-events-none">
                  <Canvas
                     setSelectedFormation={setSelectedFormation}
                     formations={formations}
                     selectedFormation={selectedFormation}
                     setDancers={setDancers}
                     dancers={dancers}
                     setFormations={setFormations}
                     selectedDancers={selectedDancers}
                     setSelectedDancers={setSelectedDancers}
                  >
                     {dancers.map((dancer, index) => (
                        <DancerAlias
                           selectedDancers={selectedDancers}
                           isPlaying={isPlaying}
                           position={position}
                           selectedFormation={selectedFormation}
                           setDancers={setDancers}
                           key={index}
                           dancer={dancer}
                           formations={formations}
                           setFormations={setFormations}
                        />
                     ))}
                     {showPreviousFormation
                        ? dancers.map((dancer, index) => (
                             <DancerAliasShadow
                                viewAllPaths={viewAllPaths}
                                isPlaying={isPlaying}
                                position={position}
                                selectedFormation={selectedFormation}
                                setDancers={setDancers}
                                key={index}
                                dancer={dancer}
                                formations={formations}
                                setFormations={setFormations}
                             />
                          ))
                        : null}
                  </Canvas>
                  <p>audience</p>
               </div>
               <div className="w-full mb-5 mt-1 flex flex-row items-center justify-center " style={{ transform: "scale(-1, 1)" }}>
                  <iframe
                     className="h-full "
                     src="https://www.youtube.com/embed/Zw6w3skoiOo"
                     title="YouTube video player"
                     frameborder="0"
                     allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                     allowfullscreen
                  ></iframe>
               </div>
            </div>
            <div className="overflow-x-scroll min-h-[195px] bg-white ">
               <SoundCloudComponent
                  key={soundCloudTrackId}
                  setSelectedFormation={setSelectedFormation}
                  setFormations={setFormations}
                  soundCloudTrackId={soundCloudTrackId}
                  setSoundCloudTrackId={setSoundCloudTrackId}
                  setSongDuration={setSongDuration}
                  songDuration={songDuration}
                  setIsPlaying={setIsPlaying}
                  setPosition={setPosition}
               />
               <div className="pointer-events-none">
                  <Layers
                     songDuration={songDuration}
                     setFormations={setFormations}
                     formations={formations}
                     selectedFormation={selectedFormation}
                     setSelectedFormation={setSelectedFormation}
                     isPlaying={isPlaying}
                     position={position}
                  />
               </div>
            </div>
         </div>
      </>
   );
};

export default View;
