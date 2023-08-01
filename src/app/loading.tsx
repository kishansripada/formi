export default function Loading() {
   return (
      <>
         <div className="flex items-center justify-center h-screen bg-black ">
            <style>
               {`
          /* Define the keyframes for the animation */
          @keyframes width-animation {
            0% {
              width: 0;
            }
            100% {
              width: 150px;
            }
          }
          
          /* Create a CSS class that applies the animation */
          .animate-width {
            animation: width-animation 0.5s linear forwards;
          }
          `}
            </style>
            <div className="w-[150px] cursor-pointer">
               {/* <h1 className="text-6xl font-bold z-10 relative">naach.app</h1>
          <div className="bg-pink-600 relative h-3 opacity-40 top-[-15px] mr-auto w-[58%]"></div> */}
               <h1 className="text-4xl font-bold z-10 text-neutral-200 relative">FORMI</h1>

               <div className="bg-pink-600 relative h-2  top-[-10px] mr-auto animate-width"></div>
            </div>
         </div>
      </>
   );
}
