import { Formation } from "./Formation";
type dancer = {
   name?: string;
   id: number;
   isOnStage?: boolean;
   position: { x: number | null; y: number | null };
};

export const Formations: React.FC<{ formations: dancer[][]; selectedFormation: number; setSelectedFormation: Function }> = ({
   formations,
   selectedFormation,
   setSelectedFormation,
}) => {
   return (
      <>
         <div className="bg-red-200 w-full min-h-[100px] flex flex-row pt-3 pb-6 px-6 overflow-x-scroll">
            {formations.map((formation, index) => (
               <div key={index} onClick={() => setSelectedFormation(index)}>
                  <Formation
                     formation={formation}
                     index={index}
                     amSelected={index === selectedFormation}
                     setSelectedFormation={setSelectedFormation}
                  />
               </div>
            ))}
         </div>
      </>
   );
};
