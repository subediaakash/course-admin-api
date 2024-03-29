import { z } from "zod";

export const adminSchema = z.object({
   username :  z.string().email(),
   password : z.string(),
})

