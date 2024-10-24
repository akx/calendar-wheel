import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { Wheel } from "./components/Wheel";
import { CalendarEvent, CalendarEventSchema } from "./types";
import { usePersistedZodSchemaState } from "./hooks";
import { z } from "zod";
import { ConfigPanel } from "./components/ConfigPanel";
import { getDefaultWheelStyle } from "./wheelStyle";
import { loadExampleData } from "./exampleData";
import { locales, palettes } from "./data";

export default function App() {
  const [minDate, setMinDate] = React.useState("2024-01-01");
  const [maxDate, setMaxDate] = React.useState("2024-12-31");
  const [localeName, setLocaleName] = React.useState("en-US");
  const [paletteName, setPaletteName] = React.useState("claude");
  const [style, setStyle] = React.useState(() => getDefaultWheelStyle(1000));
  const [events, setEvents] = usePersistedZodSchemaState<CalendarEvent[]>(
    "calendar-wheel-events-2",
    z.array(CalendarEventSchema),
    loadExampleData,
  );

  const minDateT = new Date(minDate);
  const maxDateT = new Date(maxDate);

  const wheelEl = (
    <Wheel
      events={events}
      minDate={minDateT}
      maxDate={maxDateT}
      dateLocale={locales[localeName]!}
      styleConfig={style}
      palette={palettes[paletteName]!}
    />
  );

  const handleExportSVG = () => {
    const blob = new Blob(
      [
        `<?xml version="1.0" encoding="UTF-8" standalone="no"?>`,
        renderToStaticMarkup(wheelEl).replace(
          "<svg ",
          `<svg xmlns="http://www.w3.org/2000/svg" `,
        ),
      ],
      { type: "image/svg+xml" },
    );
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "calendar-wheel.svg";
    a.click();
  };
  return (
    <div className="grid grid-cols-2 gap-2">
      {wheelEl}
      <div className="p-2 flex flex-col gap-2">
        <ConfigPanel
          events={events}
          setEvents={setEvents}
          minDate={minDate}
          setMinDate={setMinDate}
          maxDate={maxDate}
          setMaxDate={setMaxDate}
          localeName={localeName}
          setLocaleName={setLocaleName}
          paletteName={paletteName}
          setPaletteName={setPaletteName}
          style={style}
          setStyle={setStyle}
          onExportSVG={handleExportSVG}
        />
      </div>
    </div>
  );
}
