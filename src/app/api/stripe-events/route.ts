import { EmailTemplate } from "../../email-templates/page";
import { Resend } from "resend";
import * as React from "react";
import Stripe from "stripe";
import { headers } from "next/headers";

const resend = new Resend(process.env.RESEND_API_KEY);
const stripe = new Stripe(process.env.STRIPE_API_KEY);

const endpointSecret = "whsec_I7JzjkL6VKRT9j6L64aoMrvtgswrFrp3";

export async function POST(request: Request) {
   const body = await request.json();
   const headersList = headers();
   const sig = headersList.get("stripe-signature");

   let event;

   try {
      event = stripe.webhooks.constructEvent(body, sig, endpointSecret);
   } catch (err) {
      //  response.status(400).send(`Webhook Error: ${err.message}`);
      return;
   }

   switch (event.type) {
      case "customer.subscription.created":
         const customerSubscriptionCreated = event.data.object;
         try {
            const { data, error } = await resend.emails.send({
               from: "Kishan from FORMI <kishansripada@formistudio.app>",
               to: ["kishansripada@gmail.com"],
               subject: `welcome to FORMI`,
               text: JSON.stringify(customerSubscriptionCreated),
               //  react: EmailTemplate({ firstName }) as React.ReactElement,
            });

            if (error) {
               return Response.json({ error });
            }

            return Response.json({ data });
         } catch (error) {
            return Response.json({ error });
         }
         break;
      case "subscription_schedule.canceled":
         const subscriptionScheduleCanceled = event.data.object;
         try {
            const { data, error } = await resend.emails.send({
               from: "Kishan from FORMI <kishansripada@formistudio.app>",
               to: ["kishansripada@gmail.com"],
               subject: `welcome to FORMI`,
               text: JSON.stringify(subscriptionScheduleCanceled),
               //  react: EmailTemplate({ firstName }) as React.ReactElement,
            });

            if (error) {
               return Response.json({ error });
            }

            return Response.json({ data });
         } catch (error) {
            return Response.json({ error });
         }
         break;
      // ... handle other event types
      default:
         console.log(`Unhandled event type ${event.type}`);
   }
}
