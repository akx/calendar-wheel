import { CalendarEvent } from "../types";

export function sortEvents(a: CalendarEvent, b: CalendarEvent) {
  const timeDiff = a.start.getTime() - b.start.getTime();
  return timeDiff || a.uid.localeCompare(b.uid);
}
