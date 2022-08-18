import { Formation } from "./Formation";

export const Formations: React.FC<{}> = ({}) => {
   return (
      <>
         <div className="bg-red-200 w-full min-h-[100px] flex flex-row py-3 px-6 overflow-x-scroll">
            <Formation />
            <Formation />
            <Formation />
            <Formation />
            <Formation />
            <Formation />
         </div>
      </>
   );
};
