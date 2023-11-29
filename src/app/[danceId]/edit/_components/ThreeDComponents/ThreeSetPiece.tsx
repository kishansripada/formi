import { useLoader } from "@react-three/fiber";
import { useEffect, useState } from "react";
import { TextureLoader, DoubleSide } from "three";
import { cloudSettings, formation, prop, propPosition } from "../../../../../types/types";
import { useStore } from "../../store";
export function ThreeSetPiece({
   cloudSettings,
   prop,
   // formations,
   selectedFormation,

   position,
   currentFormationIndex,
   percentThroughTransition,
}: {
   cloudSettings: cloudSettings;
   prop: prop;
   // formations: formation[];
   selectedFormation: number | null;

   position: number | null;
   currentFormationIndex: number;
   percentThroughTransition: number;
}) {
   const { formations, isPlaying } = useStore();
   const url = `https://dxtxbxkkvoslcrsxbfai.supabase.co/storage/v1/object/public/props/${prop.user_id}/${prop?.url}`;
   const texture = useLoader(TextureLoader, url);
   const [dimensions, setDimensions] = useState<{ width: number; height: number }>({ width: 0, height: 0 });

   useEffect(() => {
      calculateImageDimensions(prop?.static?.width || 5, url, (width, height) => {
         setDimensions({ width, height });
      });
   }, [cloudSettings, url]);
   if (selectedFormation === null) return <></>;

   let myPosition;
   // if the track is playing then  return with the animation function
   const propPosition =
      prop.type === "static"
         ? prop.static
         : (formations[selectedFormation]?.props || [])?.find((propPosition: propPosition) => propPosition.id === prop.id);
   if (!propPosition) return <></>;
   if (prop.type === "static") {
      myPosition = propPosition.position;
   } else if (isPlaying && position !== null) {
      myPosition = animate(formations, prop.id, currentFormationIndex, percentThroughTransition);
   } else {
      //   const propPosition = (formations[selectedFormation]?.props || [])?.find((propPosition: propPosition) => propPosition.id === prop.id);

      if (!propPosition) return <></>;
      myPosition = propPosition.position;
   }
   // if there is no formation selected and the track is not playing, then just return nothing

   // if the dancer does not have any coordinates right now, return nothing since it shouln't be displayed
   if (!myPosition) return <></>;

   // let { left, top } = coordsToPosition(myPosition);

   return (
      <mesh position={[myPosition.x, 0, -myPosition.y]} rotation={[Math.PI * 1.5, 0, 0]}>
         <planeGeometry attach="geometry" args={[dimensions.width, dimensions.height]} />
         <meshStandardMaterial opacity={0.7} transparent={true} attach="material" map={texture} />
      </mesh>
   );
}

function calculateImageDimensions(width: number, url: string, callback: (newWidth: number, newHeight: number) => void): void {
   // Create a new image object
   let img = new Image();

   // Define the onload function
   img.onload = function () {
      // Get the actual width and height of the image
      const imgWidth: number = this.width;
      const imgHeight: number = this.height;

      let newImgHeight = (imgHeight / imgWidth) * width;

      // Return the new width and height
      callback(width, newImgHeight);
   };

   // Set the src attribute to start loading the image
   img.src = url;
}

const animate = (
   formations: formation[],
   id: string,
   currentFormationIndex: number | null,
   percentThroughTransition: number | undefined
): { x: number; y: number } | null => {
   // if the position is beyond all the formation, return off stage
   if (currentFormationIndex === null) return null;
   let inPreviousFormation = formations[currentFormationIndex - 1]
      ? (formations[currentFormationIndex - 1]?.props || []).find((prop) => prop.id === id)
      : false;

   const inThisFormation = (formations?.[currentFormationIndex]?.props || []).find((prop) => prop.id === id);

   if (!inThisFormation) return null;
   let from;
   let to;

   if (percentThroughTransition != undefined) {
      if (inThisFormation) {
         if (inPreviousFormation) {
            // transition between current and next
            // requires animation don't return yet
            from = inPreviousFormation.position;
            to = inThisFormation.position;
         } else {
            // transition between current and exit strategy specified in current
            // requires animation don't return yet
            from = inThisFormation.position;
            to = inThisFormation.position;
         }
      }
   } else {
      if (inThisFormation) {
         // return position from this formation
         return inThisFormation.position;
      } else {
         // return off stage
         return null;
      }
   }

   function easeInOutSine(x: number): number {
      return -(Math.cos(Math.PI * x) - 1) / 2;
   }

   function easeInOutElastic(x: number): number {
      const c5 = (2 * Math.PI) / 4.5;

      return x === 0
         ? 0
         : x === 1
         ? 1
         : x < 0.5
         ? -(Math.pow(2, 20 * x - 10) * Math.sin((20 * x - 11.125) * c5)) / 2
         : (Math.pow(2, -20 * x + 10) * Math.sin((20 * x - 11.125) * c5)) / 2 + 1;
   }
   function easeOutBounce(x: number): number {
      const n1 = 7.5625;
      const d1 = 2.75;

      if (x < 1 / d1) {
         return n1 * x * x;
      } else if (x < 2 / d1) {
         return n1 * (x -= 1.5 / d1) * x + 0.75;
      } else if (x < 2.5 / d1) {
         return n1 * (x -= 2.25 / d1) * x + 0.9375;
      } else {
         return n1 * (x -= 2.625 / d1) * x + 0.984375;
      }
   }
   function easeInOutQuad(x: number): number {
      return x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2;
   }
   function easeInOutExpo(x: number): number {
      return x === 0 ? 0 : x === 1 ? 1 : x < 0.5 ? Math.pow(2, 20 * x - 10) / 2 : (2 - Math.pow(2, -20 * x + 10)) / 2;
   }
   function easeOutQuart(x: number): number {
      return 1 - Math.pow(1 - x, 4);
   }

   percentThroughTransition = easeInOutQuad(percentThroughTransition);

   if (inThisFormation?.transitionType === "teleport") {
      return null;
   }
   if (inThisFormation?.transitionType === "cubic" && inThisFormation?.controlPointStart?.y && inThisFormation?.controlPointStart?.x) {
      return {
         x:
            (1 - percentThroughTransition) ** 3 * from.x +
            3 * (1 - percentThroughTransition) ** 2 * percentThroughTransition * inThisFormation.controlPointStart.x +
            3 * (1 - percentThroughTransition) * percentThroughTransition ** 2 * inThisFormation.controlPointEnd.x +
            percentThroughTransition ** 3 * to.x,
         y:
            (1 - percentThroughTransition) ** 3 * from.y +
            3 * (1 - percentThroughTransition) ** 2 * percentThroughTransition * inThisFormation.controlPointStart.y +
            3 * (1 - percentThroughTransition) * percentThroughTransition ** 2 * inThisFormation.controlPointEnd.y +
            percentThroughTransition ** 3 * to.y,
      };
   }
   return { x: from.x + (to.x - from.x) * percentThroughTransition, y: from.y + (to.y - from.y) * percentThroughTransition };
};
