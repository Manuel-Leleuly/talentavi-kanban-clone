import { z } from "zod";

export const TicketSchema = z.object({
  title: z.string(),
  developer: z.string(),
  priority: z.string(),
  status: z.string(),
  type: z.string(),
  "Estimated SP": z.number(),
  "Actual SP": z.number(),
});

export type Ticket = z.TypeOf<typeof TicketSchema>;

export const TicketResponseSchema = z.object({
  response: z.boolean(),
  data: z.array(TicketSchema),
});

export type TicketResponse = z.TypeOf<typeof TicketResponseSchema>;
