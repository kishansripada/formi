// src/pages/api/examples.ts
import type { NextApiRequest, NextApiResponse } from "next";

const examples = async (req: NextApiRequest, res: NextApiResponse) => {
   console.log(req.query);
   if (!req.query.url) {
      res.send("invalid link");
      res.status(400);
      return;
   }

   if (typeof req.query.url !== "string") {
      res.send("invalid link");
      res.status(400);
      return;
   }
   let rawHtml = await fetch(`${req.query.url}`)
      .then((response) => response.text())
      .catch((err) => console.error(err));

   const regex = /(?<=formationData'>)(.*)(?=<\/div)/gim;
   const json = rawHtml.match(regex);
   if (!json[0]) return;

   function parseHtmlEnteties(str) {
      return str.replace(/&#([0-9]{1,3});/gi, function (match, numStr) {
         var num = parseInt(numStr, 10); // read num as normal number
         return String.fromCharCode(num);
      });
   }
   let danceAppData = JSON.parse(parseHtmlEnteties(json[0]));

   let formations = danceAppData.frames.map((frame, i) => {
      return {
         id: frame.id,
         durationSeconds: 5,
         positions: Object.keys(frame.datapoints).map((id) => {
            return {
               id: id,
               position: {
                  x: Math.round((frame.datapoints[id].x * 0.8) / 2),
                  y: -Math.round(frame.datapoints[id].z / 2),
               },
               exitStrategy: "closest",
               enterStrategy: "closest",
               transitionType: "linear",
            };
         }),
         transition: {
            durationSeconds: 2,
         },
         name: `Untitled ${i}`,
      };
   });
   let dancers = danceAppData.dancers.map((dancer) => {
      return {
         id: dancer.id,
         color: dancer.color,
         name: dancer.name,
      };
   });

   if (!dancers || !formations) {
      res.send("invalid link");
      res.status(400);
      return;
   }

   res.status(200).json({ dancers, formations });
};

export default examples;
