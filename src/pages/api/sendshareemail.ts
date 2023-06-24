import { NextApiHandler } from "next";

const ProtectedRoute: NextApiHandler = async (req, res) => {
   // Create authenticated Supabase Client

   //    req.body = {
   //       record: {
   //          email: "kishansripada@gmail.com",
   //          performance_id: 1442,
   //       },
   //    };
   console.error(req.body);
   const options = {
      method: "POST",
      body: JSON.stringify({
         key: "md-pfCXPghMdPuLWa4eczrrEw",
         message: {
            html: `Performance shared with you. Check it out at <a href="https://formistudio.app/${req.body.record.performance_id}/edit"> here </a>`,
            text: "hi",
            subject: "Performance shared with you.",
            from_email: "kishansripada@formistudio.app",
            from_name: "FORMI",
            to: [
               {
                  email: req.body.record.email,
                  type: "to",
               },
            ],
         },
         async: false,
         ip_pool: "",
         send_at: "",
      }),
   };

   fetch("https://mandrillapp.com/api/1.0/messages/send", options)
      .then((response) => response.json())
      .then((response) => {
         res.json(response);
      })
      .catch((err) => console.error(err));
};

export default ProtectedRoute;
