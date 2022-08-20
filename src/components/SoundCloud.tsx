export const SoundCloud: React.FC<{ trackUrl: string }> = ({ trackUrl }) => {
   return (
      <>
         <div className="overflow-x-scroll overflow-hidden ">
            <iframe width="3000" height="110" scrolling="yes" allow="autoplay" src={trackUrl}></iframe>
         </div>
      </>
   );
};
