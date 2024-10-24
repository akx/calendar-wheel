import { ConfigPanelProps } from "./types";
import React from "react";
import { parseVCal } from "../utils/vcal";
import { sortEvents } from "../utils/events";
import { EventsTable } from "./EventsTable";

export function DataPanel({
  events,
  setEvents,
  minDate,
  maxDate,
}: ConfigPanelProps) {
  const minDateT = new Date(minDate);
  const maxDateT = new Date(maxDate);

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      return;
    }
    const reader = new FileReader();
    reader.onload = async () => {
      let eventsFromVCal;
      try {
        eventsFromVCal = await parseVCal(
          reader.result as string,
          minDateT,
          maxDateT,
        );
      } catch (err) {
        alert(`Failed to parse vCalendar file: ${err}`);
        return;
      }
      setEvents((events) => {
        const currentEventUids = new Set(events.map((event) => event.uid));
        const newEventsFromVCal = eventsFromVCal.filter(
          (event) => !currentEventUids.has(event.uid),
        );
        return [...events, ...newEventsFromVCal].sort(sortEvents);
      });
      e.target.files = null;
      e.target.value = "";
    };
    reader.readAsText(file);
  };
  return (
    <>
      <div className="border-y p-1 flex flex-row items-center">
        <div className="grow">
          Import vCalendar file:
          <input
            type="file"
            accept=".ics"
            className="mx-1 max-w-64"
            onChange={handleImport}
          />
        </div>
        <span className="opacity-50 text-sm">
          Only events within the currently configured range are imported.
        </span>
      </div>
      <div className="overflow-y-scroll max-h-[80vh]">
        <EventsTable events={events} setEvents={setEvents} />
      </div>
    </>
  );
}
