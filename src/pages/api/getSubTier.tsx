// src/pages/api/examples.ts
import type { NextApiRequest, NextApiResponse } from "next";

const examples = async (req: NextApiRequest, res: NextApiResponse) => {
   let customerExists = false;
   fetch(`https://api.stripe.com/v1/customers/search?query=metadata['supabase_id']:'${req.query.supabase_id}'&expand[]=data.subscriptions.data`, {
      headers: {
         Authorization:
            "Basic cmtfbGl2ZV81MUxhajV0SHZDM3c2ZThmY21zVklCRjlKMjRLUWFFYlgwVUs0SHE0b245QTVXMUNIaWlHaHAwVzlrbHg5dDU3OW9WcWVibFJGOHh3cE8xc3FlUmFMOHBzYjAwMmhLNFl0NEU6",
      },
   })
      .then((r) => r.json())
      .then((r) => {
         customerExists = Boolean(r.data.length);
         let planId = r?.data?.[0]?.subscriptions?.data?.[0]?.plan?.product;
         if (planId === "prod_MngV5QMEYtDnjr") {
            planId = "choreographer";
         }
         res.status(200).json({ type: planId || null, customerExists });
      });
};

export default examples;
