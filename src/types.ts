import { z } from "zod";

export const CalendarEventSchema = z.object({
  end: z.coerce.date(),
  start: z.coerce.date(),
  subject: z.string(),
  uid: z.string(),
  lane: z.number(),
});

export type CalendarEvent = z.infer<typeof CalendarEventSchema>;
