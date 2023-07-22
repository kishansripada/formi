import { dancer, dancerPosition, formation, stageDimensions, comment, initials, localSettings } from "../../types/types";
import { useRef, useEffect, useState } from "react";

export const Comment: React.FC<{
   comment: comment;
   selectedFormation: number | null;
   setFormations: Function;
   zoom: number;
   coordsToPosition: Function;
   pushChange: Function;
   addToStack: Function;
   localSettings: localSettings;
}> = ({ comment, selectedFormation, setFormations, coordsToPosition, zoom, addToStack, pushChange, localSettings }) => {
   const { stageFlipped } = localSettings;
   // if there is no formation selected and the track is not playing, then just return nothing
   if (selectedFormation === null) return <></>;

   // if the dancer does not have any coordinates right now, return nothing since it shouln't be displayed
   let { left, top } = coordsToPosition({ x: (stageFlipped ? -1 : 1) * comment.position.x, y: (stageFlipped ? -1 : 1) * comment.position.y });
   if (!left || !top) return <></>;

   let textAreaRef = useRef<HTMLTextAreaElement>(null);

   // useEffect(() => {
   //    console.log(textAreaRef.current?.scrollHeight);
   //    setHeight(textAreaRef.current?.scrollHeight);
   // }, [textAreaRef.current?.scrollHeight]);

   const [isOpen, setIsOpen] = useState(false);
   const [height, setHeight] = useState(false);
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
            onMouseEnter={(e) => {
               setIsOpen(true);
               // let target = e.target.querySelector("textarea");

               // // function calculateTextareaHeight(text, width, fontSize) {
               // //    let lines = (text.length * fontSize) / width;
               // //    return Math.ceil(lines * fontSize * 1.1);
               // // }
               // // let height = calculateTextareaHeight(comment.content, 172.8, 14);
               // console.log(target);
               // target.style.height = "auto";
               // target.style.height = `${target.scrollHeight}px`;
            }}
            onMouseLeave={() => {
               if (isEditing) return;
               setIsOpen(false);
            }}
            style={{
               left,
               top,
               transform: `scale(${(1 / zoom) * 0.8}) translate(0%, -${100 * zoom * (1 / 0.8)}%)`,
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
               isOpen ? "w-72 rounded-t-xl h-auto py-3 justify-start px-3" : "w-[50px] h-[50px] rounded-br-full rounded-t-full justify-center"
            }  border border-neutral-700   bg-neutral-800  group select-none shadow-xl  text-white lg:pointer-events-auto pointer-events-none flex    flex-row   items-center absolute z-[300]  cursor-default `}
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
               <div className="bg-purple-500   rounded-full  min-w-[32px] font-semibold min-h-[32px] grid place-items-center select-none cursor-default pointer-events-none  ">
                  {initials(comment?.user?.name)}
               </div>
            )}

            <div className={` flex-col h-full justify-center ml-4  font-medium  w-full	 pointer-events-none ${isOpen ? "flex" : "hidden"}  `}>
               <div className="flex flex-row items-center text-sm  ">
                  <p>{comment.user.name}</p>
               </div>

               {isEditing ? (
                  <textarea
                     onBlur={() => {
                        setIsEditing(false);
                        setIsOpen(false);
                        pushChange();
                     }}
                     autoFocus
                     onChange={(e) => {
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
                     className="bg-neutral-700 p-2 h-24 border border-pink-600 mt-2 rounded-md focus:outline-none resize-none pointer-events-auto w-full text-sm font-normal  selection:bg-pink-900"
                     value={comment.content}
                     ref={textAreaRef}
                  ></textarea>
               ) : (
                  <p
                     onClick={() => {
                        setIsEditing(true);
                        textAreaRef.current?.focus();
                     }}
                     className="bg-neutral-700 p-2 rounded-md focus:outline-none resize-none pointer-events-auto w-full text-sm font-normal  mt-1 selection:bg-pink-900"
                  >
                     {comment.content}
                  </p>
               )}
            </div>
         </div>
      </>
   );
};
