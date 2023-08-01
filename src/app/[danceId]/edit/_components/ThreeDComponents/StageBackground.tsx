import { useLoader } from "@react-three/fiber";
import { useEffect, useState } from "react";
import { TextureLoader, DoubleSide } from "three";
import { cloudSettings } from "../../../../../types/types";
export function StageBackground({ url, cloudSettings }: { url: string; cloudSettings: cloudSettings }) {
   const texture = useLoader(TextureLoader, url);
   const [dimensions, setDimensions] = useState<{ width: number; height: number }>({ width: 0, height: 0 });

   useEffect(() => {
      calculateImageDimensions(cloudSettings, url, (width, height) => {
         setDimensions({ width, height });
      });
   }, [cloudSettings, url]);

   return (
      <mesh position={[0, 0, 0]} rotation={[Math.PI * 1.5, 0, 0]}>
         <planeBufferGeometry attach="geometry" args={[dimensions.width, dimensions.height]} />
         <meshBasicMaterial opacity={0.7} transparent={true} attach="material" map={texture} side={DoubleSide} />
      </mesh>
   );
}

function calculateImageDimensions(
   cloudSettings: { stageDimensions: { width: number; height: number } },
   url: string,
   callback: (newWidth: number, newHeight: number) => void
): void {
   // Create a new image object
   let img = new Image();

   // Define the onload function
   img.onload = function () {
      // Get the actual width and height of the image
      const imgWidth: number = this.width;
      const imgHeight: number = this.height;

      // Get the stage width and height
      const stageWidth: number = cloudSettings.stageDimensions.width;
      const stageHeight: number = cloudSettings.stageDimensions.height;

      // Calculate the image aspect ratio
      const imgAspectRatio: number = imgWidth / imgHeight;

      // Calculate the stage aspect ratio
      const stageAspectRatio: number = stageWidth / stageHeight;

      let newImgWidth: number, newImgHeight: number;

      if (stageAspectRatio > imgAspectRatio) {
         // If stage aspect ratio is larger, image height should be equal to stage height
         newImgHeight = stageHeight;
         newImgWidth = newImgHeight * imgAspectRatio;
      } else {
         // If image aspect ratio is larger, image width should be equal to stage width
         newImgWidth = stageWidth;
         newImgHeight = newImgWidth / imgAspectRatio;
      }

      // Return the new width and height
      callback(newImgWidth, newImgHeight);
   };

   // Set the src attribute to start loading the image
   img.src = url;
}
