import * as datefns from "date-fns";
import React from "react";
import { CalendarEvent } from "../types";
import { loadExampleData } from "../exampleData";

import { sortEvents } from "../utils/events";

interface EventsTableProps {
  events: readonly CalendarEvent[];
  setEvents: React.Dispatch<React.SetStateAction<CalendarEvent[]>>;
}

function getUidFromEvent(
  event: React.MouseEvent<HTMLElement> | React.ChangeEvent<HTMLElement>,
) {
  return event.currentTarget.closest("tr")?.dataset.eventUid;
}

export function EventsTable({ events, setEvents }: EventsTableProps) {
  const handleDelete = (e: React.MouseEvent<HTMLButtonElement>) => {
    const uid = getUidFromEvent(e);
    if (!uid) {
      return;
    }
    setEvents((events) => events.filter((event) => event.uid !== uid));
  };
  const handleChangeStart = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uid = getUidFromEvent(e);
    if (!uid) {
      return;
    }
    const newStart = new Date(e.target.value);
    if (+newStart < 0) return;
    setEvents((events) =>
      events.map((event) =>
        event.uid === uid ? { ...event, start: newStart } : event,
      ),
    );
  };
  const handleChangeEnd = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uid = getUidFromEvent(e);
    if (!uid) {
      return;
    }
    const newEnd = new Date(e.target.value);
    if (+newEnd < 0) return;
    setEvents((events) =>
      events.map((event) =>
        event.uid === uid ? { ...event, end: newEnd } : event,
      ),
    );
  };
  const handleChangeText = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uid = getUidFromEvent(e);
    if (!uid) {
      return;
    }
    const newText = e.target.value;
    setEvents((events) =>
      events.map((event) =>
        event.uid === uid ? { ...event, subject: newText } : event,
      ),
    );
  };
  const handleNew = () => {
    setEvents((events) => [
      ...events,
      {
        uid: Math.random().toString(36).slice(2),
        start: new Date(),
        end: new Date(),
        subject: "",
        lane: 1,
      },
    ]);
  };
  const handleChangeLane = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uid = getUidFromEvent(e);
    if (!uid) {
      return;
    }
    const newLane = parseInt(e.target.value, 10);
    setEvents((events) =>
      events.map((event) =>
        event.uid === uid ? { ...event, lane: newLane } : event,
      ),
    );
  };
  const handleCopy = (e: React.MouseEvent<HTMLButtonElement>) => {
    const uid = getUidFromEvent(e);
    if (!uid) {
      return;
    }
    const event = events.find((event) => event.uid === uid);
    if (!event) {
      return;
    }
    setEvents((events) =>
      [
        ...events,
        {
          ...event,
          uid: Math.random().toString(36).slice(2),
        },
      ].sort(sortEvents),
    );
  };
  const handleConfirmClear = () => {
    if (confirm("Are you sure?")) setEvents([]);
  };
  const handleConfirmLoad = () => {
    if (confirm("Are you sure?")) {
      setEvents(loadExampleData().sort(sortEvents));
    }
  };
  return (
    <table className="relative table-auto w-full border-collapse text-sm leading-tight [&_td]:border border-gray-400">
      <thead className="sticky top-0 bg-white">
        <tr>
          <th className="sticky w-32">Start</th>
          <th className="sticky w-32">End</th>
          <th className="sticky">Subject</th>
          <th className="sticky w-16">Lane</th>
          <th className="sticky gap-2 flex flex-row justify-end">
            <button
              onClick={handleNew}
              className="border border-gray-400 px-1 py-0.5"
            >
              New event
            </button>
            <button
              onClick={handleConfirmClear}
              className="border px-1 py-0.5 text-red-500 border-red-500"
            >
              Clear {events.length} events
            </button>
            <button
              onClick={handleConfirmLoad}
              className="border px-1 py-0.5 text-amber-500 border-amber-500"
            >
              Load example data
            </button>
          </th>
        </tr>
      </thead>

      <tbody>
        {events.map((event) => (
          <tr key={event.uid} data-event-uid={event.uid}>
            <td className="w-32">
              <input
                type="date"
                value={datefns.formatISO(event.start, {
                  representation: "date",
                })}
                onChange={handleChangeStart}
              />
            </td>
            <td className="w-32">
              <input
                type="date"
                value={datefns.formatISO(event.end, {
                  representation: "date",
                })}
                onChange={handleChangeEnd}
              />
            </td>
            <td>
              <input
                value={event.subject}
                className="w-full"
                onChange={handleChangeText}
              />
            </td>

            <td className="w-16">
              <input
                value={event.lane ?? 1}
                type="number"
                min={1}
                onChange={handleChangeLane}
              />
            </td>
            <td className="text-end">
              <button
                className="border border-gray-400 px-1 py-0.5"
                onClick={handleCopy}
              >
                Copy
              </button>
              <button
                className="border border-gray-400 px-1 py-0.5"
                onClick={handleDelete}
              >
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
