import type { NextPage } from "next";
import Head from "next/head";
import { trpc } from "../utils/trpc";
import { useState, useEffect, useRef } from "react";
import { type } from "os";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { DancerAlias } from "../components/DancerAlias";
import { Dancer } from "../components/Dancer";
import { Canvas } from "../components/Canvas";
import { SidebarDrop } from "../components/SidebarDrop";
import { NewDancer } from "../components/NewDancer";
import { Header } from "../components/Header";
import { Formations } from "../components/Formations";
// import { SoundCloudComponent } from "../components/SoundCloudComponent";
import dynamic from "next/dynamic";

const SoundCloudComponent = dynamic<{ setPosition: Function; setIsPlaying: Function; setSongDuration: Function; songDuration: number | null }>(
   () => import("../components/SoundCloudComponent").then((mod) => mod.SoundCloudComponent),
   {
      ssr: false,
   }
);

type dancer = {
   name: string;
   id: string;
   position: { x: number | null; y: number | null };
};

type formation = {
   durationSeconds: number;
   positions: dancer[];
   transition: {
      durationSeconds: number;
   };
};

const Home: NextPage = () => {
   const [songDuration, setSongDuration] = useState<number | null>(null);
   const [dancers, setDancers] = useState<dancer[]>([]);
   const [position, setPosition] = useState<number | null>(null);
   const [isPlaying, setIsPlaying] = useState<boolean>(false);
   const [selectedFormation, setSelectedFormation] = useState<number | null>(null);
   const [formations, setFormations] = useState<formation[]>([]);

   return (
      <>
         <DndProvider backend={HTML5Backend}>
            <div className="flex flex-col h-screen overflow-hidden">
               <Header />
               <div className="flex flex-row grow overflow-hidden">
                  <div className="flex flex-col w-1/4 relative overflow-y-scroll min-w-[300px]">
                     {dancers.map((dancer, index) => (
                        <Dancer
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

                  <div className="flex flex-col h-full items-center">
                     <p>backstage</p>
                     <Canvas
                        formations={formations}
                        selectedFormation={selectedFormation}
                        setDancers={setDancers}
                        dancers={dancers}
                        setFormations={setFormations}
                     >
                        {dancers.map((dancer, index) => (
                           <DancerAlias
                              isPlaying={isPlaying}
                              position={position}
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
                  {/* STATS */}
                  <div className="text-xl">
                     <p>selected formation: {JSON.stringify(selectedFormation)}</p>
                     <p>positoin: {JSON.stringify(position)}</p>
                     <p>{isPlaying ? "Playing " : "paused"}</p>
                     <hr />
                     <p>Current Formation:</p>
                     <p>Duration: {selectedFormation !== null ? formations[selectedFormation]?.durationSeconds : ""}</p>
                     <p>Transition Duration: {selectedFormation !== null ? formations[selectedFormation]?.transition.durationSeconds : ""}</p>
                     <p>
                        total Duration:{" "}
                        {selectedFormation !== null
                           ? formations[selectedFormation]?.transition.durationSeconds + formations[selectedFormation]?.durationSeconds
                           : ""}
                     </p>
                     <hr />
                     <p>
                        total all formations :{" "}
                        {formations
                           .map((formation) => formation.durationSeconds + formation.transition.durationSeconds)
                           .reduce((partialSum, a) => partialSum + a, 0)}
                     </p>
                  </div>
               </div>
               <div className="overflow-x-scroll">
                  <SoundCloudComponent
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

const coordsToPosition = (x: number, y: number) => {
   return { left: 400 + 40 * x, top: 400 + 40 * -y };
};

export default Home;
