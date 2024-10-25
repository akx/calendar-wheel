import { getDefaultWheelStyle } from "../wheelStyle";
import { ConfigPanelProps } from "./types";
import { localeLabels, locales, palettes } from "../data";
import { RadioGroup } from "./RadioGroup";
import { StyleColorAndOpacityInput } from "./StyleColorAndOpacityInput";
import { StyleNumberInput } from "./StyleNumberInput";

export function StylePanel({
  localeName,
  maxDate,
  minDate,
  paletteName,
  setLocaleName,
  setMaxDate,
  setMinDate,
  setPaletteName,
  setStyle,
  style,
}: ConfigPanelProps) {
  return (
    <div className="flex flex-col gap-2 text-sm p-2">
      <label>
        <button
          onClick={() => setStyle(getDefaultWheelStyle(1000))}
          className="border px-2"
        >
          Reset wheel style
        </button>
      </label>
      <table className="border-collapse [&_td]:border [&_th]:border [&_td]:p-1 [&_td]:text-right [&_th]:text-right [&_th]:h-8 [&_th]:p-1 border-gray-400">
        <tbody>
          <tr>
            <th>Date Range</th>
            <td colSpan={2}>
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
            </td>
          </tr>
          <tr>
            <th>Locale</th>
            <td colSpan={2}>
              <div className="flex justify-between">
                <RadioGroup
                  options={Object.keys(locales)}
                  labels={localeLabels}
                  value={localeName}
                  onChangeValue={setLocaleName}
                />
                <label>
                  <input
                    type="checkbox"
                    onChange={(e) =>
                      setStyle((style) => ({
                        ...style,
                        isoWeeks: e.target.checked,
                      }))
                    }
                    checked={style.isoWeeks}
                  />
                  &nbsp;ISO weeks
                </label>
              </div>
            </td>
          </tr>
          <tr>
            <th>Palette</th>
            <td colSpan={2}>
              <RadioGroup
                options={Object.keys(palettes)}
                value={paletteName}
                onChangeValue={setPaletteName}
              />
            </td>
          </tr>
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
            <th>Week Ring</th>
            <td>
              Inner:
              <StyleNumberInput
                style={style}
                field="weekInnerRadius"
                setStyle={setStyle}
              />
            </td>
            <td>
              Outer:
              <StyleNumberInput
                style={style}
                field="weekOuterRadius"
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
            <th>Rotation &amp; direction</th>
            <td>
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
            <td>
              <StyleNumberInput
                style={style}
                field="angleOffsetDeg"
                setStyle={setStyle}
                unit="deg"
                min={-360}
                max={360}
                step={0.1}
                size={5}
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
                min={0}
                max={360}
                step={0.001}
                size={5}
              />
            </td>
          </tr>
          <tr>
            <th>Font sizes</th>
            <td colSpan={2}>
              <div className="flex text-nowrap justify-between">
                <label>
                  Month:
                  <StyleNumberInput
                    style={style}
                    field="monthFontSize"
                    setStyle={setStyle}
                    size={5}
                  />
                </label>
                <label>
                  Week:
                  <StyleNumberInput
                    style={style}
                    field="weekFontSize"
                    setStyle={setStyle}
                    size={5}
                  />
                </label>
                <label>
                  Event:
                  <StyleNumberInput
                    style={style}
                    field="eventFontSize"
                    setStyle={setStyle}
                    size={5}
                  />
                </label>
              </div>
            </td>
          </tr>
          <tr>
            <th>Today</th>
            <td colSpan={2}>
              <label>
                <input
                  type="checkbox"
                  onChange={(e) =>
                    setStyle((style) => ({
                      ...style,
                      alignWheelToToday: e.target.checked,
                    }))
                  }
                  checked={style.alignWheelToToday}
                />
                &nbsp;Align wheel to today
              </label>
              <label>
                <input
                  type="checkbox"
                  onChange={(e) =>
                    setStyle((style) => ({
                      ...style,
                      showTodayIndicator: e.target.checked,
                    }))
                  }
                  checked={style.showTodayIndicator}
                />
                &nbsp;Show Today indicator
              </label>
            </td>
          </tr>
          <tr>
            <th>Future Color</th>
            <td colSpan={2}>
              <StyleColorAndOpacityInput
                style={style}
                setStyle={setStyle}
                colorField="futureColor"
                opacityField="futureColorOpacity"
              />
            </td>
          </tr>
          <tr>
            <th>Past Color</th>
            <td colSpan={2}>
              <StyleColorAndOpacityInput
                style={style}
                setStyle={setStyle}
                colorField="pastColor"
                opacityField="pastColorOpacity"
              />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
