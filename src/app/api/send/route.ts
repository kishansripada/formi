import { EmailTemplate } from "../../email-templates/page";
import { Resend } from "resend";
import * as React from "react";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
   const data = await request.json();
   const firstName = data.firstName;
   const to = data.to;
   if (!to) return Response.json({ error: "no email provided" });
   try {
      const { data, error } = await resend.emails.send({
         from: "Kishan from FORMI <kishansripada@formistudio.app>",
         to: [to],
         subject: firstName ? `welcome to FORMI ${firstName.toLocaleLowerCase()}` : `welcome to FORMI`,
         react: EmailTemplate({ firstName }) as React.ReactElement,
      });

      if (error) {
         return Response.json({ error });
      }

      return Response.json({ data });
   } catch (error) {
      return Response.json({ error });
   }
}
