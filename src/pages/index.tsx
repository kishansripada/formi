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

type dancer = {
   name?: string;
   id: number;
   isOnStage?: boolean;
   position: { x: number | null; y: number | null };
};

const Home: NextPage = () => {
   const [dancers, setDancers] = useState([
      { name: "Dancer 1", id: 222, isOnStage: true, position: { x: 1, y: 1 } },
      { name: "Dancer 2", id: 203, isOnStage: true, position: { x: 1, y: 2 } },
      { name: "Dancer 3", id: 555, isOnStage: true, position: { x: -2, y: 3 } },
   ]);

   const [formations, setFormations] = useState([
      [
         {
            id: 222,
            position: { x: 1, y: 1 },
         },
         {
            id: 203,
            position: { x: 1, y: 2 },
         },
         {
            id: 555,
            position: { x: -2, y: 3 },
         },
      ],
      [
         {
            id: 222,
            position: { x: 2, y: 2 },
         },
         {
            id: 203,
            position: { x: 2, y: 3 },
         },
         {
            id: 555,
            position: { x: -2, y: 3 },
         },
      ],
   ]);

   const [selectedFormation, setSelectedFormation] = useState(0);

   return (
      <>
         <DndProvider backend={HTML5Backend}>
            <div className="flex flex-col h-screen overflow-hidden">
               <Header />
               <div className="flex flex-row grow overflow-hidden">
                  <div className="flex flex-col w-1/4 relative overflow-y-scroll min-w-[300px]">
                     {dancers.map((dancer, index) => (
                        <Dancer setDancers={setDancers} {...dancer} key={index} dancers={dancers} />
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
               </div>
               <Formations formations={formations} selectedFormation={selectedFormation} setSelectedFormation={setSelectedFormation} />
            </div>
         </DndProvider>
      </>
   );
};

const coordsToPosition = (x: number, y: number) => {
   return { left: 400 + 40 * x, top: 400 + 40 * -y };
};

export default Home;
