export const Header = ({ saved }: { saved: boolean }) => {
   return (
      <>
         <div className="bg-blue-200 h-[75px] flex flex-row items-center shrink-0 mb-2">
            <p className="text-3xl"> LOGO</p>
            <p>{saved ? "saved!" : "..."}</p>
         </div>
      </>
   );
};
