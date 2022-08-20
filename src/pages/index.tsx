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
import { SoundCloud } from "../components/SoundCloud";

type dancer = {
   name?: string;
   id: string;
   isOnStage?: boolean;
   position: { x: number | null; y: number | null };
};

type formation = {
   durationSeconds: number;
   positions: dancer[];
};

const Home: NextPage = () => {
   const [dancers, setDancers] = useState([
      { name: "Dancer 1", id: "anotherid", isOnStage: true, position: { x: 1, y: 1 } },
      { name: "Dancer 2", id: "id", isOnStage: true, position: { x: 1, y: 2 } },
      { name: "Dancer 3", id: "test", isOnStage: true, position: { x: -2, y: 3 } },
   ]);

   const [positionSeconds, setPositionSeconds] = useState<number | null>(null);

   const [selectedFormation, setSelectedFormation] = useState<number | null>(0);

   const [formations, setFormations] = useState([
      {
         durationSeconds: 2,
         positions: [
            {
               id: "anotherid",
               position: { x: 1, y: 1 },
            },
            {
               id: "id",
               position: { x: 1, y: 2 },
            },
            {
               id: "test",
               position: { x: -2, y: 3 },
            },
         ],
         transition: {
            durationSeconds: 1,
         },
      },
   ]);

   return (
      <>
         <DndProvider backend={HTML5Backend}>
            <div className="flex flex-col h-screen overflow-hidden">
               <Header />
               <div className="flex flex-row grow overflow-hidden">
                  <div className="flex flex-col w-1/4 relative overflow-y-scroll min-w-[300px]">
                     {dancers.map((dancer, index) => (
                        <Dancer selectedFormation={selectedFormation} setDancers={setDancers} {...dancer} key={index} dancers={dancers} />
                     ))}
                     <NewDancer setDancers={setDancers} />
                     <SidebarDrop setDancers={setDancers} />
                  </div>

                  <div className="flex flex-col h-full items-center">
                     <p>backstage</p>
                     <Canvas setDancers={setDancers} dancers={dancers}>
                        {dancers
                           .filter((dancer) => dancer.isOnStage)
                           .map((dancer, index) => (
                              <DancerAlias
                                 selectedFormation={selectedFormation}
                                 setDancers={setDancers}
                                 key={index}
                                 name={dancer.name}
                                 id={dancer.id}
                                 {...coordsToPosition(dancer.position.x, dancer.position.y)}
                              />
                           ))}
                     </Canvas>
                     <p>audience</p>
                  </div>
                  {/* STATS */}
                  <div className="text-xl">
                     <p>selected formation: {JSON.stringify(selectedFormation)}</p>
                     <p>positionSeconds: {JSON.stringify(positionSeconds)}</p>
                  </div>
               </div>
               <SoundCloud trackUrl="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/1310078686" />
               <Formations
                  setFormations={setFormations}
                  formations={formations}
                  selectedFormation={selectedFormation}
                  setSelectedFormation={setSelectedFormation}
               />
            </div>
         </DndProvider>
      </>
   );
};

const coordsToPosition = (x: number, y: number) => {
   return { left: 400 + 40 * x, top: 400 + 40 * -y };
};

export default Home;
