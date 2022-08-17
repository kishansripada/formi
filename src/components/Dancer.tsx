type dancer = {
   name: string;
   id: number;
   isOnStage: boolean;
   position: { x: number | null; y: number | null };
};

export const Dancer = ({
   name,
   id,
   setDancers,
   dancers,
   isOnStage,
}: {
   name: string;
   id: number;
   setDancers: Function;
   dancers: dancer[];
   isOnStage: boolean;
}) => {
   let initials = name
      .split(" ")
      .map((word) => word[0])
      .join("");
   return (
      <>
         <div
            className="flex flex-row items-center bg-slate-300 border-black border-2"
            style={{
               opacity: isOnStage ? 1 : 0.7,
            }}
         >
            {id}
            <div className="w-12 h-12 bg-red-500 rounded-full flex flex-row justify-center items-center">
               <p className="pointer-events-none select-none">{initials}</p>
            </div>
            <input
               defaultValue={name}
               onChange={(e) => setDancers(dancers.map((dancer, index) => (index === id ? { ...dancer, name: e.target.value } : dancer)))}
            />
         </div>
      </>
   );
};
