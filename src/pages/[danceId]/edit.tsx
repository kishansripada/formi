import type { NextPage } from "next";
import Head from "next/head";
import { useState, useEffect, useRef, useCallback } from "react";
import debounce from "lodash.debounce";
import { supabase } from "../../utils/supabase";
import { useRouter } from "next/router";
import { type } from "os";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { DancerAlias } from "../../components/AppComponents/DancerAlias";
import { Dancer } from "../../components/AppComponents/Dancer";
import { Canvas } from "../../components/AppComponents/Canvas";
import { SidebarDrop } from "../../components/AppComponents/SidebarDrop";
import { NewDancer } from "../../components/AppComponents/NewDancer";
import { Formations } from "../../components/AppComponents/Formations";
import { CurrentFormation } from "../../components/AppComponents/CurrentFormation";
// import { SoundCloudComponent } from "../components/SoundCloudComponent";
import dynamic from "next/dynamic";

const Header = dynamic<{
   saved: boolean;
   setSoundCloudTrackId: Function;
   session: any;
}>(() => import("../../components/AppComponents/Header").then((mod) => mod.Header), {
   ssr: false,
});

// import { Header } from "../../components/AppComponents/Header";

const SoundCloudComponent = dynamic<{
   setPosition: Function;
   setIsPlaying: Function;
   setSongDuration: Function;
   songDuration: number | null;
   soundCloudTrackId: string | null;
   setSoundCloudTrackId: Function;
}>(() => import("../../components/AppComponents/SoundCloudComponent").then((mod) => mod.SoundCloudComponent), {
   ssr: false,
});

import { dancer, dancerPosition, formation } from "../../types/types";

const Home = ({ session }: { session: any }) => {
   const [songDuration, setSongDuration] = useState<number | null>(null);
   const [dancers, setDancers] = useState<dancer[]>([]);
   const [position, setPosition] = useState<number | null>(null);
   const [isPlaying, setIsPlaying] = useState<boolean>(false);
   const [selectedFormation, setSelectedFormation] = useState<number | null>(null);
   const [formations, setFormations] = useState<formation[]>([]);
   const [soundCloudTrackId, setSoundCloudTrackId] = useState<string | null>(null);
   const [danceName, setDanceName] = useState<string>("Untitled Dance");
   const [saved, setSaved] = useState<boolean>(true);
   const router = useRouter();

   const removeDancer = (id: string) => {
      // remove dancer and all their positions
      setFormations((formations) => {
         return formations.map((formation) => {
            return { ...formation, positions: formation.positions.filter((dancerPosition) => dancerPosition.id !== id) };
         });
      });
      setDancers((dancers: dancer[]) => {
         return dancers.filter((dancer) => dancer.id !== id);
      });
   };

   useEffect(() => {
      if (router.query.danceId) {
         supabase
            .from("dances")
            .select("*")
            .eq("id", router.query.danceId)
            .then((r) => {
               let { soundCloudId, dancers, formations, name } = r.data[0];
               setSoundCloudTrackId(soundCloudId);
               setFormations(formations);
               setDancers(dancers);
               setDanceName(name);
            });
      }
   }, [router.query.danceId]);

   let uploadDancers = useCallback(
      debounce(async (dancers) => {
         console.log("uploading dancers");
         const { data, error } = await supabase.from("dances").update({ dancers: dancers }).eq("id", router.query.danceId);
         console.log({ data });
         console.log({ error });
         setSaved(true);
      }, 20000),
      [router.query.danceId]
   );

   useEffect(() => {
      if (router.isReady) {
         setSaved(false);
         uploadDancers(dancers);
      }
   }, [dancers, router.isReady]);
   // ///////////
   let uploadFormations = useCallback(
      debounce(async (formations) => {
         console.log("uploading formations");
         const { data, error } = await supabase.from("dances").update({ formations: formations }).eq("id", router.query.danceId);
         console.log({ data });
         console.log({ error });
         setSaved(true);
      }, 20000),
      [router.query.danceId]
   );

   useEffect(() => {
      if (router.isReady) {
         setSaved(false);
         uploadFormations(formations);
      }
   }, [formations, router.isReady]);
   //////////////////////////
   // ///////////
   let uploadSoundCloudId = useCallback(
      debounce(async (soundCloudTrackId) => {
         console.log("uploading formations");
         const { data, error } = await supabase.from("dances").update({ soundCloudId: soundCloudTrackId }).eq("id", router.query.danceId);
         console.log({ data });
         console.log({ error });
         setSaved(true);
      }, 5000),
      [router.query.danceId]
   );

   useEffect(() => {
      if (router.isReady) {
         setSaved(false);
         uploadSoundCloudId(soundCloudTrackId);
      }
   }, [soundCloudTrackId, router.isReady]);
   //////////////////////////
   // ///////////
   let uploadName = useCallback(
      debounce(async (danceName) => {
         console.log("uploading name");
         const { data, error } = await supabase.from("dances").update({ name: danceName }).eq("id", router.query.danceId);
         console.log({ data });
         console.log({ error });
         setSaved(true);
      }, 5000),
      [router.query.danceId]
   );

   useEffect(() => {
      if (router.isReady) {
         setSaved(false);
         uploadName(danceName);
      }
   }, [danceName, router.isReady]);
   //////////////////////////

   return (
      <>
         <DndProvider backend={HTML5Backend}>
            <div className="flex flex-col h-screen overflow-hidden bg-[#fafafa]">
               <Header
                  session={session}
                  saved={saved}
                  setSoundCloudTrackId={setSoundCloudTrackId}
                  danceName={danceName}
                  setDanceName={setDanceName}
               />
               <div className="flex flex-row grow overflow-hidden">
                  <div className="flex flex-col w-1/6 relative overflow-y-scroll min-w-[300px] ml-3 overflow-hidden">
                     {dancers.map((dancer, index) => (
                        <Dancer
                           removeDancer={removeDancer}
                           setFormations={setFormations}
                           isPlaying={isPlaying}
                           formations={formations}
                           selectedFormation={selectedFormation}
                           setDancers={setDancers}
                           {...dancer}
                           key={index}
                           dancers={dancers}
                        />
                     ))}
                     <NewDancer setDancers={setDancers} />
                     <SidebarDrop setFormations={setFormations} />
                  </div>

                  <div className="flex flex-col h-full items-center w-2/3">
                     <Canvas
                        formations={formations}
                        selectedFormation={selectedFormation}
                        setDancers={setDancers}
                        dancers={dancers}
                        setFormations={setFormations}
                     >
                        {dancers.map((dancer, index) => (
                           <DancerAlias
                              index={index}
                              isPlaying={isPlaying}
                              position={position ? parseFloat(position.toFixed(2)) : null}
                              selectedFormation={selectedFormation}
                              setDancers={setDancers}
                              key={index}
                              name={dancer.name}
                              id={dancer.id}
                              formations={formations}
                           />
                        ))}
                     </Canvas>
                     <p>audience</p>
                  </div>

                  <CurrentFormation
                     setSelectedFormation={setSelectedFormation}
                     dancers={dancers}
                     setFormations={setFormations}
                     formations={formations}
                     selectedFormation={selectedFormation}
                  />
               </div>
               <div className="overflow-x-scroll min-h-[195px]">
                  <SoundCloudComponent
                     soundCloudTrackId={soundCloudTrackId}
                     setSoundCloudTrackId={setSoundCloudTrackId}
                     setSongDuration={setSongDuration}
                     songDuration={songDuration}
                     setIsPlaying={setIsPlaying}
                     setPosition={setPosition}
                  />
                  <Formations
                     songDuration={songDuration}
                     setFormations={setFormations}
                     formations={formations}
                     selectedFormation={selectedFormation}
                     setSelectedFormation={setSelectedFormation}
                  />
               </div>
            </div>
         </DndProvider>
      </>
   );
};

export default Home;
