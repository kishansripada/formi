import { createRouter } from "./context";
import { z } from "zod";

export const exampleRouter = createRouter()
  .query("hello", {
    input: z
      .object({
        text: z.string().nullish(),
      })
      .nullish(),
    resolve({ input }) {
      return {
        greeting: `Hello ${input?.text ?? "world"}`,
      };
    },
  })
  .query("getAll", {
    async resolve({ ctx }) {
      return await ctx.prisma.example.findMany();
    },
  }).query("getSoundCloudTrackId", {
    input: z
      .object({
        url: z.string(),
      }),
    resolve({ input }) {
      let data = fetch(input.url).then(r => r.text()).then(html => {
        return {
          greeting: `${html.match(/(?<=api.soundcloud.com%2Ftracks%2F).*?(?=&)/)}`,
        };
      })
      return data
    },
  })
