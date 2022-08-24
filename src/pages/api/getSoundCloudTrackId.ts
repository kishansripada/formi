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
   let data = await fetch(req.query.url)
      .then((r) => r.text())
      .catch((err) => {
         res.send("invalid link");
         res.status(400);
         return;
      });

   let trackId = data?.match(/(?<=api.soundcloud.com%2Ftracks%2F).*?(?=&)/);

   if (!trackId) {
      res.send("invalid link");
      res.status(400);
      return;
   }
   res.status(200).json({ trackId: trackId[0] });
};

export default examples;
