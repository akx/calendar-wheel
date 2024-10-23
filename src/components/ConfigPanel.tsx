import { EventsTable } from "./EventsTable";
import React from "react";
import { CalendarEvent } from "../types";
import { getDefaultWheelStyle, WheelStyleConfig } from "../wheelStyle";
import { parseVCal } from "../utils/vcal";
import { sortEvents } from "../utils/events";

interface ConfigPanelProps {
  events: readonly CalendarEvent[];
  setEvents: React.Dispatch<React.SetStateAction<CalendarEvent[]>>;
  minDate: string;
  setMinDate: React.Dispatch<React.SetStateAction<string>>;
  maxDate: string;
  setMaxDate: React.Dispatch<React.SetStateAction<string>>;
  localeName: string;
  setLocaleName: React.Dispatch<React.SetStateAction<string>>;
  style: WheelStyleConfig;
  setStyle: React.Dispatch<React.SetStateAction<WheelStyleConfig>>;
  onExportSVG: () => void;
}

function StyleNumberInput({
  style,
  field,
  setStyle,
  unit,
}: {
  style: WheelStyleConfig;
  field: keyof WheelStyleConfig;
  setStyle: React.Dispatch<React.SetStateAction<WheelStyleConfig>>;
  unit?: string;
}) {
  return (
    <>
      <input
        type="number"
        className="border border-gray-400 p-1 mx-1 rounded"
        value={style[field]}
        min={0}
        onChange={(e) =>
          setStyle((style) => ({
            ...style,
            [field]: +e.target.valueAsNumber,
          }))
        }
      />
      {unit}
    </>
  );
}

function DataPanel({ events, setEvents, minDate, maxDate }: ConfigPanelProps) {
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

function StylePanel({
  minDate,
  setMinDate,
  maxDate,
  setMaxDate,
  localeName,
  setLocaleName,
  style,
  setStyle,
}: ConfigPanelProps) {
  return (
    <div className="flex flex-col gap-2 text-sm p-2">
      <div className="flex gap-2">
        <label>
          Date range:
          <input
            type="date"
            className="border border-gray-400 p-1 mx-1 rounded"
            value={minDate}
            onChange={(e) => setMinDate(e.target.value)}
          />
          &ndash;
          <input
            type="date"
            className="border border-gray-400 p-1 mx-1 rounded"
            value={maxDate}
            onChange={(e) => setMaxDate(e.target.value)}
          />
        </label>
        <label>
          Locale:
          <select
            className="border border-gray-400 p-1 mx-1 rounded"
            value={localeName}
            onChange={(e) => setLocaleName(e.target.value)}
          >
            <option value="en-US">English</option>
            <option value="fi">Finnish</option>
          </select>
        </label>
      </div>
      <label>
        <button
          onClick={() => setStyle(getDefaultWheelStyle(1000))}
          className="border px-2"
        >
          Reset wheel style
        </button>
      </label>
      <table className="border-collapse [&_td]:border  [&_th]:border [&_td]:p-1 [&_td]:text-right [&_th]:text-right [&_th]:p-1 border-gray-400">
        <tbody>
          <tr>
            <th>Image size</th>
            <td colSpan={2}>
              <StyleNumberInput
                style={style}
                field="size"
                setStyle={setStyle}
              />
            </td>
          </tr>
          <tr>
            <th>Month Ring</th>
            <td>
              Inner:
              <StyleNumberInput
                style={style}
                field="monthInnerRadius"
                setStyle={setStyle}
              />
            </td>
            <td>
              Outer:
              <StyleNumberInput
                style={style}
                field="monthOuterRadius"
                setStyle={setStyle}
              />
            </td>
          </tr>
          <tr>
            <th>Event Ring</th>
            <td colSpan={2}>
              Radius:
              <StyleNumberInput
                style={style}
                field="eventInnerRadius"
                setStyle={setStyle}
              />
            </td>
          </tr>
          <tr>
            <th>Date Ring</th>
            <td>
              Inner:
              <StyleNumberInput
                style={style}
                field="dateInnerRadius"
                setStyle={setStyle}
              />
            </td>
            <td>
              Outer:
              <StyleNumberInput
                style={style}
                field="dateOuterRadius"
                setStyle={setStyle}
              />
            </td>
          </tr>
          <tr>
            <th>Event Lanes</th>
            <td>
              Width:
              <StyleNumberInput
                style={style}
                field="laneWidth"
                setStyle={setStyle}
              />
            </td>
            <td>
              Gap:
              <StyleNumberInput
                style={style}
                field="laneGap"
                setStyle={setStyle}
              />
            </td>
          </tr>
          <tr>
            <th>Rotation</th>
            <td colSpan={2}>
              <StyleNumberInput
                style={style}
                field="angleOffsetDeg"
                setStyle={setStyle}
                unit="deg"
              />
            </td>
          </tr>
          <tr>
            <th>Minimum visible event size</th>
            <td colSpan={2}>
              <StyleNumberInput
                style={style}
                field="minimumVisibleAngleDeg"
                setStyle={setStyle}
                unit="deg"
              />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export function ConfigPanel(props: ConfigPanelProps) {
  const [tab, setTab] = React.useState<"data" | "style">("data");
  const buttonClassName =
    "hover:bg-slate-200 aria-selected:font-bold px-2 py-1";
  return (
    <div>
      <div className="border-b p-1 flex flex-row items-center gap-2">
        <button
          onClick={() => setTab("data")}
          aria-selected={tab === "data" ? "true" : undefined}
          className={buttonClassName}
        >
          Data
        </button>
        <button
          onClick={() => setTab("style")}
          aria-selected={tab === "style" ? "true" : undefined}
          className={buttonClassName}
        >
          Style
        </button>
        <button onClick={() => props.onExportSVG()} className={buttonClassName}>
          Export SVG
        </button>
      </div>
      {tab === "data" ? <DataPanel {...props} /> : <StylePanel {...props} />}
    </div>
  );
}
