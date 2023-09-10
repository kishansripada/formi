import React, { useEffect, useState } from "react";
import { animated } from "@react-spring/three";
import { TextureLoader, DoubleSide, Vector3, Plane } from "three";
import { useLoader } from "@react-three/fiber";
export function ThreeItem({ itemPos, thisItem }: { itemPos: any; thisItem: any }) {
   const [itemDimensions, setItemDimensions] = useState({ width: 0, height: 0 });
   // const outerMaterial = new MeshStandardMaterial({ color: 0x00ff00 });
   const url = `https://dxtxbxkkvoslcrsxbfai.supabase.co/storage/v1/object/public/props/${thisItem?.url}`;
   const texture = useLoader(TextureLoader, url);

   // const [dimensions, setDimensions] = useState<{ width: number; height: number }>({ width: 0, height: 0 });

   useEffect(() => {
      if (!thisItem || !url) return;
      calculateImageDimensions(2, url, (width, height) => {
         setItemDimensions({ width, height });
      });
   }, [url]);
   return (
      <>
         {thisItem && (
            <animated.mesh position={itemPos.position}>
               <mesh rotation={[0, 0, 0]}>
                  <planeBufferGeometry attach="geometry" args={[itemDimensions.width, itemDimensions.height]} />
                  <meshStandardMaterial opacity={0.8} transparent={true} attach="material" map={texture} />
               </mesh>
            </animated.mesh>
         )}
      </>
   );
}

function calculateImageDimensions(height: number, url: string, callback: (newWidth: number, newHeight: number) => void): void {
   // Create a new image object
   let img = new Image();

   // Define the onload function
   img.onload = function () {
      // Get the actual width and height of the image
      const imgWidth: number = this.width;
      const imgHeight: number = this.height;

      let newImgWidth = (imgWidth / imgHeight) * height;

      // Return the new width and height
      callback(newImgWidth, height);
   };

   // Set the src attribute to start loading the image
   img.src = url;
}
