import React from "react";
import { ConfigPanelProps } from "./types";
import { StylePanel } from "./StylePanel";
import { DataPanel } from "./DataPanel";

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
        <div className="grow" />
        <button onClick={() => props.onExportSVG()} className={buttonClassName}>
          Export SVG
        </button>
      </div>
      {tab === "data" ? <DataPanel {...props} /> : <StylePanel {...props} />}
    </div>
  );
}
