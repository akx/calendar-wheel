import * as datefns from "date-fns";
import React from "react";
import monthColors from "../monthColors";
import { CalendarEvent } from "../types";
import {
  DEFAULT_FRACTION_DIGITS,
  generateArcPathCommand,
  generateFatArcPathCommand,
} from "../utils/svg";
import { WheelStyleConfig } from "../wheelStyle";

function* generateDays(minDate: Date, maxDate: Date) {
  let current = new Date(minDate);
  while (current <= maxDate) {
    yield current;
    current = datefns.addDays(current, 1);
  }
}

function* generateMonthTuples(minDate: Date, maxDate: Date) {
  let current = new Date(minDate);
  while (current <= maxDate) {
    const firstDayOfMonth = datefns.startOfMonth(current);
    const lastDayOfMonth = datefns.endOfMonth(current);
    yield [firstDayOfMonth, lastDayOfMonth] as const;
    current = datefns.addMonths(current, 1);
  }
}

interface WheelProps {
  events: readonly CalendarEvent[];
  minDate: Date;
  maxDate: Date;
  dateLocale: datefns.Locale;
  styleConfig: WheelStyleConfig;
}

function getMonthRingElements(
  minDateT: Date,
  maxDateT: Date,
  dateToAngle: (date: Date) => number,
  {
    monthInnerRadius,
    monthOuterRadius,
    reverse,
    monthFontSize,
  }: WheelStyleConfig,
  dateLocale: datefns.Locale,
) {
  if (monthInnerRadius >= monthOuterRadius) return null;
  return Array.from(generateMonthTuples(minDateT, maxDateT)).map(
    ([date1, date2]) => {
      const textPathId = `month-${+date1}`;
      const startAngle = dateToAngle(date1);
      const endAngle = dateToAngle(date2);
      const [textStartAngle, textEndAngle] = reverse
        ? [endAngle, startAngle]
        : [startAngle, endAngle];
      return (
        <React.Fragment key={+date1}>
          <path
            d={generateFatArcPathCommand(
              0,
              0,
              monthInnerRadius,
              monthOuterRadius,
              startAngle,
              endAngle,
              reverse,
            )}
            opacity={0.7}
            fill={monthColors[date1.getMonth()]!.hex}
          />
          <path
            id={textPathId}
            fill="none"
            d={generateArcPathCommand(
              0,
              0,
              monthOuterRadius + 5,
              textStartAngle,
              textEndAngle,
            )}
          />
          <text>
            <textPath
              fontSize={monthFontSize}
              href={`#${textPathId}`}
              textAnchor={reverse ? "end" : "start"}
              startOffset={reverse ? "100%" : "0%"}
            >
              {datefns.formatDate(date1, "LLLL yyyy", {
                locale: dateLocale,
              })}
            </textPath>
          </text>
        </React.Fragment>
      );
    },
  );
}

function getDateRingElements(
  minDateT: Date,
  maxDateT: Date,
  dateToAngle: (date: Date) => number,
  { dateInnerRadius, dateOuterRadius }: WheelStyleConfig,
) {
  if (dateInnerRadius >= dateOuterRadius) return null;
  return Array.from(generateDays(minDateT, maxDateT)).map((date) => {
    const angle = dateToAngle(date);
    const cosAngle = Math.cos(angle);
    const sinAngle = Math.sin(angle);
    const x1 = cosAngle * dateInnerRadius;
    const y1 = sinAngle * dateInnerRadius;
    const x2 = cosAngle * dateOuterRadius;
    const y2 = sinAngle * dateOuterRadius;
    const weekday = datefns.getISODay(date);
    const stroke = weekday === 6 || weekday === 7 ? "red" : "white";
    return (
      <line
        key={+date}
        x1={x1.toFixed(DEFAULT_FRACTION_DIGITS)}
        y1={y1.toFixed(DEFAULT_FRACTION_DIGITS)}
        x2={x2.toFixed(DEFAULT_FRACTION_DIGITS)}
        y2={y2.toFixed(DEFAULT_FRACTION_DIGITS)}
        stroke={stroke}
        strokeWidth={1}
        opacity={0.5}
      />
    );
  });
}

function getEventsElements(
  events: readonly CalendarEvent[],
  dateToAngle: (date: Date) => number,
  {
    eventFontSize,
    eventInnerRadius,
    laneGap,
    laneWidth,
    minimumVisibleAngleDeg,
    reverse,
  }: WheelStyleConfig,
) {
  const minimumVisibleAngle = (minimumVisibleAngleDeg / 360) * Math.PI * 2;
  return events.map((event) => {
    // TODO: time zones not supported
    const textPathId = `textPath-${event.uid}`;
    const startAngle = dateToAngle(event.start);
    const endAngle = dateToAngle(event.end);
    if (Math.abs(endAngle - startAngle) < minimumVisibleAngle) {
      return null;
    }
    const [textStartAngle, textEndAngle] = reverse
      ? [endAngle, startAngle]
      : [startAngle, endAngle];
    const isLarge = Math.abs(endAngle - startAngle) > Math.PI;
    const normLane = event.lane - 1;
    const laneInnerRadius = eventInnerRadius - normLane * (laneWidth + laneGap);
    const laneOuterRadius = laneInnerRadius + laneWidth;
    return (
      <React.Fragment key={event.uid}>
        <path
          d={generateFatArcPathCommand(
            0,
            0,
            laneInnerRadius,
            laneOuterRadius,
            startAngle,
            endAngle,
            reverse,
            isLarge,
          )}
          fill="#f5f6fa"
          stroke="#2f3640"
          strokeWidth={0.5}
        />
        <path
          id={textPathId}
          fill="none"
          d={generateArcPathCommand(
            0,
            0,
            (laneInnerRadius + laneOuterRadius) / 2,
            textStartAngle,
            textEndAngle,
            false,
            isLarge,
          )}
        />
        <text
          fontSize={eventFontSize}
          dominantBaseline="middle"
          textAnchor="middle"
        >
          <textPath href={`#${textPathId}`} startOffset="50%">
            {event.subject}
          </textPath>
        </text>
      </React.Fragment>
    );
  });
}

export function Wheel({
  events,
  minDate,
  maxDate,
  dateLocale,
  styleConfig,
}: WheelProps) {
  const minDateT = datefns.startOfDay(minDate);
  const maxDateT = datefns.endOfDay(maxDate);
  const minTimestamp = +minDateT;
  const maxTimestamp = +maxDateT;
  const tsRange = maxTimestamp - minTimestamp;
  const { angleOffsetDeg, size, reverse } = styleConfig;

  const angleOffset = (angleOffsetDeg / 360) * Math.PI * 2;

  const dateToAngle = (date: Date) => {
    const p = (+date - minTimestamp) / tsRange;
    return p * Math.PI * 2 * (reverse ? -1 : 1) + angleOffset;
  };

  return (
    <svg viewBox={`0 0 ${size} ${size}`}>
      <g transform={`translate(${size / 2},${size / 2})`}>
        {getMonthRingElements(
          minDateT,
          maxDateT,
          dateToAngle,
          styleConfig,
          dateLocale,
        )}
        {getDateRingElements(minDateT, maxDateT, dateToAngle, styleConfig)}
        {getEventsElements(events, dateToAngle, styleConfig)}
      </g>
    </svg>
  );
}
