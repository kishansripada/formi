import React, { useEffect, useRef, useState } from "react";
import { useGLTF } from "@react-three/drei";
import { dancerPosition, dancer, formation, localSettings, comment, initials } from "../../../../../types/types";
import { Text, Cylinder } from "@react-three/drei";
import { useSpring, animated } from "@react-spring/three";
import { useDrag } from "@use-gesture/react";
import { useThree, useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";

import * as THREE from "three";
import { useStore } from "../../store";

export function ThreeComment({
   comment,

   selectedFormation,
   isPlaying,

   setIsThreeDancerDragging,
}: {
   comment: comment;

   selectedFormation: number | null;
   isPlaying: boolean;

   setIsThreeDancerDragging: Function;
}) {
   const { formations, setFormations, get, viewOnly } = useStore();
   //    let { gridSnap } = localSettings;

   //    let dancer = dancers?.find((dancer) => dancer.id === dancerPosition.id);
   // const isDancerDragging = useDancerDragging((state) => state.isDancerDragging);

   let commentPos = useSpring({ position: [comment.position.x, 0, -comment.position.y] });
   let planeIntersectPoint = new THREE.Vector3();
   const floorPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);

   const bind = useDrag(
      ({ active, movement: [x, y], timeStamp, event }) => {
         if (viewOnly || isPlaying) return;
         event.stopPropagation();

         if (active) {
            document.body.style.cursor = "grabbing";
            event.ray.intersectPlane(floorPlane, planeIntersectPoint);
            // setPos([-dancerPosition.position.x / 2 + planeIntersectPoint.x, 0, dancerPosition.position.y / 2 + planeIntersectPoint.z]);
            // console.log(planeIntersectPoint.x);
            console.log(planeIntersectPoint);
            setFormations(
               get().formations.map((formation, index: number) => {
                  if (index === selectedFormation) {
                     return {
                        ...formation,
                        comments: (formation.comments || []).map((commentx: comment) => {
                           if (commentx.id === comment.id) {
                              return {
                                 ...commentx,
                                 position: {
                                    x: planeIntersectPoint.x,
                                    y: -planeIntersectPoint.z,
                                 },
                              };
                           }
                           return commentx;
                        }),
                     };
                  }

                  return formation;
               })
            );
         } else {
            document.body.style.cursor = "default";
         }
         setIsThreeDancerDragging(active);

         // api.start({
         //    position: [dancerPosition.position.x, dancerPosition.position.y],
         // });
         return timeStamp;
      },
      { delay: true }
   );

   const [isOpen, setIsOpen] = useState(false);
   const [isEditing, setIsEditing] = useState(false);

   // const outerMaterial = new MeshStandardMaterial({ color: 0x00ff00 });

   return (
      <>
         <animated.mesh dispose={null} {...bind()} position={commentPos.position}>
            {/* <boxBufferGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color="orange" /> */}
            <Html>
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
                     // left,
                     // top,
                     transform: `scale(${1 * 0.8}) translate(0%, -${100 * (1 / 0.8)}%)`,
                     transformOrigin: "bottom left",
                     borderBottomRightRadius: isOpen ? "1rem" : "",
                     borderTopLeftRadius: isOpen ? "1rem" : "",
                     borderTopRightRadius: isOpen ? "1rem" : "",
                     // width: isOpen ? 288 : "",
                     // height: isOpen ? "auto" : "",

                     // transition: "width 0.15s ease-in-out,  height 0.15s ease-in-out, backgroundColor ease-in-out",
                  }}
                  //   id={comment.id}
                  //   data-type={"comment"}
                  className={`${
                     isOpen ? "w-72 rounded-t-xl h-auto py-3 justify-start px-3" : "w-[50px] h-[50px] rounded-br-full rounded-t-full justify-center"
                  }    bg-neutral-800 dark:bg-neutral-200 group select-none shadow-xl  dark:text-black text-white lg:pointer-events-auto pointer-events-none flex    flex-row   items-center absolute z-[300]  cursor-default `}
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

                     <textarea
                        onFocus={(e) => {
                           e.target.style.height = "auto";
                           e.target.style.height = `${e.target.scrollHeight}px`;
                           setIsEditing(true);
                           // addToStack();
                        }}
                        onBlur={() => {
                           setIsEditing(false);
                           setIsOpen(false);
                           //    pushChange();
                        }}
                        // onChange={(e) => {
                        //    e.target.style.height = "auto";
                        //    e.target.style.height = `${e.target.scrollHeight}px`;

                        //    setFormations(
                        //        formations.map((formation, i) => {
                        //          if (i === selectedFormation) {
                        //             return {
                        //                ...formation,
                        //                comments: formation.comments?.map((commentx) => {
                        //                   if (commentx.id === comment.id) {
                        //                      return { ...comment, content: e.target.value };
                        //                   }
                        //                   return commentx;
                        //                }),
                        //             };
                        //          }
                        //          return formation;
                        //       });
                        //    })
                        // }
                        className="bg-neutral-800 dark:bg-neutral-200 focus:outline-none resize-none pointer-events-auto w-full text-sm font-normal  mt-1 selection:bg-pink-900"
                        value={comment.content}
                        // ref={textAreaRef}
                        style={
                           {
                              // height: height ? height : "height",
                           }
                        }
                     ></textarea>
                  </div>
               </div>
            </Html>
         </animated.mesh>
      </>
   );
}
