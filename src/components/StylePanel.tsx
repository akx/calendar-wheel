import { getDefaultWheelStyle, WheelStyleConfig } from "../wheelStyle";
import React from "react";
import { ConfigPanelProps } from "./types";

function StyleNumberInput({
  style,
  field,
  setStyle,
  unit,
  min = 0,
  max,
  step,
}: {
  style: WheelStyleConfig;
  field: keyof WheelStyleConfig;
  setStyle: React.Dispatch<React.SetStateAction<WheelStyleConfig>>;
  unit?: string;
  min?: number;
  max?: number;
  step?: number;
}) {
  return (
    <>
      <input
        type="number"
        className="border border-gray-400 p-1 mx-1 rounded"
        // @ts-expect-error we'll only be using this with number fields, pinky swear
        value={style[field]}
        min={min}
        max={max}
        step={step}
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

export function StylePanel({
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
          <tr>
            <th>Direction</th>
            <td colSpan={2}>
              <label>
                <input
                  type="checkbox"
                  onChange={() =>
                    setStyle((style) => ({ ...style, reverse: !style.reverse }))
                  }
                  checked={style.reverse}
                />
                &nbsp;Counter-clockwise
              </label>
            </td>
          </tr>
          <tr>
            <th>Font sizes</th>
            <td>
              Month:
              <StyleNumberInput
                style={style}
                field="monthFontSize"
                setStyle={setStyle}
              />
            </td>
            <td>
              Event:
              <StyleNumberInput
                style={style}
                field="eventFontSize"
                setStyle={setStyle}
              />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
