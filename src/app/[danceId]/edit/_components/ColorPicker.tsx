import React, { useCallback, useRef, useState } from "react";
import { HexColorPicker } from "react-colorful";

import { useClickOutside } from "../../../../utls";
import { dancer } from "../../../../types/types";

export const PopoverPicker = ({
   color,
   setColor,
   dancers,
   position,
   text,
}: {
   color: string | null;
   setColor: Function;
   dancers: dancer[];
   position: "top" | "bottom";
   text?: string;
}) => {
   const popover = useRef();
   const [isOpen, toggle] = useState(false);
   const presetColors = [
      "#0074D9", // bright blue
      "#FF4136", // bright red
      "#2ECC40", // bright green
      "#FF851B", // bright orange
      "#7FDBFF", // sky blue
      "#B10DC9", // bright purple
      "#FFDC00", // bright yellow
      "#001f3f", // navy blue
      "#DB2777", // pink
      "#3D9970", // muted green
   ].map((color) => color.toLowerCase());

   const uniqueColors = [...new Set(dancers.map((dancer) => dancer.color).filter((e) => e))].map((color) => color.toLowerCase());
   const colors = [...new Set([...uniqueColors, ...presetColors])].slice(0, 10);

   const close = useCallback(() => toggle(false), []);
   useClickOutside(popover, close);

   return (
      <>
         <style jsx>
            {`
               body {
                  margin: 0;
                  padding: 50px;
                  font: normal 18px/1.4 Arial, sans-serif;
               }

               .picker {
                  position: relative;
               }

               .swatch {
                  width: 22px;
                  height: 22px;
                  border-radius: 2px;
                  // border: 3px solid #fff;
                  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.1), inset 0 0 0 1px rgba(0, 0, 0, 0.1);
                  cursor: pointer;
               }

               .popover {
                  position: absolute;
                  ${position === "bottom" ? "top" : "bottom"}: calc(100% + 2px);
                  right: 0;
                  border-radius: 9px;
                  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
                  z-index: 20;
               }
               .picker__swatches {
                  display: flex;
                  padding: 12px;
                  flex-wrap: wrap;
               }

               .picker__swatch {
                  width: 24px;
                  height: 24px;
                  margin: 4px;
                  border: none;
                  padding: 0;
                  border-radius: 4px;
                  cursor: pointer;
                  outline: none;
               }
            `}
         </style>
         <div className="picker">
            <div className="swatch" style={{ backgroundColor: color || "#db2777" }} onClick={() => toggle(true)} />

            {isOpen && (
               <div className="popover" ref={popover}>
                  <HexColorPicker color={color || "#db2777"} onChange={setColor} />

                  <div className="picker__swatches bg-neutral-800 overflow-hidden rounded-md">
                     {text ? <p className="text-xs text-neutral-300 py-2">{text}</p> : null}
                     {colors.map((presetColor) => (
                        <button
                           key={presetColor}
                           className="picker__swatch"
                           style={{ background: presetColor }}
                           onClick={() => setColor(presetColor)}
                        />
                     ))}
                  </div>
               </div>
            )}
         </div>
      </>
   );
};
