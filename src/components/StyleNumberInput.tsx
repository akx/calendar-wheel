import { WheelStyleConfig } from "../wheelStyle";
import React from "react";

interface StyleNumberInputProps
  extends Pick<
    React.HTMLProps<HTMLInputElement>,
    "min" | "max" | "step" | "size"
  > {
  style: WheelStyleConfig;
  field: keyof WheelStyleConfig;
  setStyle: React.Dispatch<React.SetStateAction<WheelStyleConfig>>;
  unit?: string;
}

export function StyleNumberInput({
  style,
  field,
  setStyle,
  unit,
  min = 0,
  max,
  step,
  size,
}: StyleNumberInputProps) {
  return (
    <>
      <input
        type="number"
        className="border border-gray-400 p-1 mx-1 rounded max-w-24"
        // @ts-expect-error we'll only be using this with number fields, pinky swear
        value={style[field]}
        min={min}
        max={max}
        step={step}
        size={size}
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
