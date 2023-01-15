import { dancer, dancerPosition, formation, stageDimensions, comment, initials } from "../../types/types";
import { useRef, useEffect, useState } from "react";

export const Comment: React.FC<{
   comment: comment;
   currentFormationIndex: number | null;
   percentThroughTransition: number;
   setDancers: Function;
   selectedFormation: number | null;
   formations: formation[];
   isPlaying: boolean;
   position: number | null;
   setFormations: Function;
   selectedDancers: string[];
   coordsToPosition: (coords: { x: number; y: number }) => { left: number; top: number };
   draggingDancerId: string | null;
   stageDimensions: any;
   userPositions: any;
   onlineUsers: any;
   zoom: number;
}> = ({
   comment,
   currentFormationIndex,
   percentThroughTransition,
   formations,
   setDancers,
   selectedFormation,
   isPlaying,
   position,
   setFormations,
   selectedDancers,
   coordsToPosition,
   draggingDancerId,
   stageDimensions,
   userPositions,
   onlineUsers,
   zoom,
}) => {
   // if there is no formation selected and the track is not playing, then just return nothing
   if (selectedFormation === null) return <></>;

   // if the dancer does not have any coordinates right now, return nothing since it shouln't be displayed
   let { left, top } = coordsToPosition(comment.position);
   if (!left || !top) return <></>;

   let textAreaRef = useRef<HTMLTextAreaElement>(null);

   const [isOpen, setIsOpen] = useState(false);
   const [isEditing, setIsEditing] = useState(false);
   return (
      <>
         <style jsx>{`
            .hoverRound:hover {
            }

            .delayPerm {
               display: none;
               transition: 0s display;
            }

            .group:hover .delayed {
               display: flex;
               transition-delay: 150ms;
            }
         `}</style>
         <div
            onMouseEnter={() => setIsOpen(true)}
            onMouseLeave={() => {
               if (isEditing) return;
               setIsOpen(false);
            }}
            style={{
               left,
               top,
               transform: `scale(${0.8 / zoom})`,
               transformOrigin: "bottom left",
               borderBottomRightRadius: isOpen ? "1rem" : "",
               borderTopLeftRadius: isOpen ? "1rem" : "",
               borderTopRightRadius: isOpen ? "1rem" : "",
               // width: isOpen ? 288 : "",
               // height: isOpen ? "auto" : "",

               // transition: "width 0.15s ease-in-out,  height 0.15s ease-in-out, backgroundColor ease-in-out",
            }}
            id={comment.id}
            data-type={"comment"}
            className={`${
               isOpen ? "w-72 rounded-t-xl h-auto py-2 justify-start px-3" : "w-[50px] h-[50px] rounded-br-full rounded-t-full justify-center"
            }    bg-gray-800 group select-none   transition ease-in-out duration-300  lg:pointer-events-auto pointer-events-none flex -translate-y-full   flex-row   items-center absolute z-[300]  cursor-default `}
         >
            {comment.user.avatar_url ? (
               <img
                  //   id={dancer.id}
                  //   data-type={"dancer"}
                  className="w-[32px] h-[32px] rounded-full select-none pointer-events-none"
                  src={comment.user.avatar_url}
                  referrerPolicy="no-referrer"
               />
            ) : (
               <div className="bg-purple-500 text-white  rounded-full  min-w-[32px] font-semibold min-h-[32px] grid place-items-center select-none cursor-default pointer-events-none  ">
                  {initials(comment?.user?.name)}
               </div>
            )}

            <div
               className={` flex-col h-full justify-center ml-4 text-white font-medium  w-full	 pointer-events-none ${isOpen ? "flex" : "hidden"}  `}
            >
               <div className="flex flex-row items-center text-xs text-gray-200 ">
                  <p>{comment.user.name}</p>
               </div>

               <textarea
                  onFocus={(e) => {
                     e.target.style.height = "auto";
                     e.target.style.height = `${e.target.scrollHeight}px`;
                     setIsEditing(true);
                  }}
                  onBlur={() => {
                     setIsEditing(false);
                     setIsOpen(false);
                  }}
                  onChange={(e) => {
                     e.target.style.height = "auto";
                     e.target.style.height = `${e.target.scrollHeight}px`;
                     setFormations((formations: formation[]) => {
                        return formations.map((formation, i) => {
                           if (i === selectedFormation) {
                              return {
                                 ...formation,
                                 comments: formation.comments?.map((commentx) => {
                                    if (commentx.id === comment.id) {
                                       return { ...comment, content: e.target.value };
                                    }
                                    return commentx;
                                 }),
                              };
                           }
                           return formation;
                        });
                     });
                  }}
                  className="bg-gray-800 focus:outline-none resize-none pointer-events-auto w-full text-sm font-normal  mt-1 selection:bg-pink-900"
                  value={comment.content}
               ></textarea>
            </div>
         </div>
      </>
   );
};
