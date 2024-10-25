import { WheelStyleConfig } from "../wheelStyle";
import React from "react";

type StyleColorAndOpacityInputProps = {
  style: WheelStyleConfig;
  setStyle: React.Dispatch<React.SetStateAction<WheelStyleConfig>>;
  colorField: keyof WheelStyleConfig;
  opacityField: keyof WheelStyleConfig;
};

export function StyleColorAndOpacityInput({
  style,
  setStyle,
  colorField,
  opacityField,
}: StyleColorAndOpacityInputProps) {
  return (
    <div className="flex justify-between gap-2">
      <input
        type="color"
        className={"grow " + (!style[colorField] ? "opacity-30" : "")}
        value={String(style[colorField] ?? "transparent")}
        onChange={(e) =>
          setStyle((style) => ({
            ...style,
            [colorField]: e.target.value,
          }))
        }
      />
      <label>
        Opacity:
        <input
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={String(style[opacityField])}
          onChange={(e) =>
            setStyle((style) => ({
              ...style,
              [opacityField]: e.target.valueAsNumber,
            }))
          }
        />
      </label>
      <button
        onClick={() => setStyle((style) => ({ ...style, [colorField]: null }))}
        className="border px-2"
      >
        Clear
      </button>
    </div>
  );
}
