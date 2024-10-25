import * as datefns from "date-fns";
import React from "react";
import { CalendarEvent } from "../types";
import {
  DEFAULT_FRACTION_DIGITS,
  generateArcPathCommand,
  generateFatArcPathCommand,
} from "../utils/svg";
import { WheelStyleConfig } from "../wheelStyle";
import { Palette } from "../palettes/types";

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
    yield [
      datefns.max([minDate, firstDayOfMonth]),
      datefns.min([maxDate, lastDayOfMonth]),
    ] as const;
    current = datefns.addMonths(current, 1);
  }
}

function* generateWeekTuples(
  minDate: Date,
  maxDate: Date,
  iso: boolean,
  locale: datefns.Locale,
) {
  let current = new Date(minDate);
  while (current <= maxDate) {
    const firstDayOfWeek = iso
      ? datefns.startOfISOWeek(current)
      : datefns.startOfWeek(current, { locale });
    const lastDayOfWeek = iso
      ? datefns.endOfISOWeek(current)
      : datefns.endOfWeek(current, { locale });
    yield [
      datefns.max([minDate, firstDayOfWeek]),
      datefns.min([maxDate, lastDayOfWeek]),
    ] as const;
    current = datefns.addDays(lastDayOfWeek, 1);
  }
}

interface WheelRenderEphemeraInput {
  minDate: Date;
  maxDate: Date;
  dateLocale: datefns.Locale;
  styleConfig: WheelStyleConfig;
  palette: Palette;
}

interface WheelRenderEphemeraInternal extends WheelRenderEphemeraInput {
  dateToAngle: (date: Date) => number;
}

interface WheelProps extends WheelRenderEphemeraInput {
  events: readonly CalendarEvent[];
}

function getMonthRingElements({
  minDate,
  maxDate,
  dateLocale,
  palette,
  styleConfig,
  dateToAngle,
}: WheelRenderEphemeraInternal) {
  const {
    monthInnerRadius,
    monthOuterRadius,
    weekOuterRadius,
    reverse,
    monthFontSize,
  } = styleConfig;
  if (monthInnerRadius >= monthOuterRadius) return null;
  return Array.from(generateMonthTuples(minDate, maxDate)).map(
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
            fill={palette.monthColors[date1.getMonth()]!.hex}
          />
          {monthFontSize > 0 ? (
            <>
              <path
                id={textPathId}
                fill="none"
                d={generateArcPathCommand(
                  0,
                  0,
                  Math.max(weekOuterRadius, monthOuterRadius) + 5,
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
            </>
          ) : null}
        </React.Fragment>
      );
    },
  );
}

function getWeekRingElements({
  minDate,
  maxDate,
  dateLocale,
  styleConfig,
  dateToAngle,
}: WheelRenderEphemeraInternal) {
  const { weekInnerRadius, weekOuterRadius, reverse, weekFontSize, isoWeeks } =
    styleConfig;
  if (weekInnerRadius >= weekOuterRadius) return null;
  return Array.from(
    generateWeekTuples(minDate, maxDate, isoWeeks, dateLocale),
  ).map(([date1, date2]) => {
    const textPathId = `week-${+date1}`;
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
            weekInnerRadius,
            weekOuterRadius,
            startAngle,
            endAngle,
            reverse,
          )}
          stroke="#333"
          fill="none"
          opacity={0.7}
        />
        {weekFontSize > 0 ? (
          <>
            <path
              id={textPathId}
              fill="none"
              d={generateArcPathCommand(
                0,
                0,
                (weekOuterRadius + weekInnerRadius) / 2,
                textStartAngle,
                textEndAngle,
              )}
            />
            <text>
              <textPath
                fontSize={weekFontSize}
                href={`#${textPathId}`}
                textAnchor="middle"
                dominantBaseline="middle"
                startOffset="50%"
              >
                {datefns.formatDate(date1, isoWeeks ? "II" : "ww", {
                  locale: dateLocale,
                })}
              </textPath>
            </text>
          </>
        ) : null}
      </React.Fragment>
    );
  });
}

function getDateRingElements({
  minDate,
  maxDate,
  styleConfig,
  dateToAngle,
}: WheelRenderEphemeraInternal) {
  const { dateInnerRadius, dateOuterRadius } = styleConfig;
  if (dateInnerRadius >= dateOuterRadius) return null;
  return Array.from(generateDays(minDate, maxDate)).map((date) => {
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
  { styleConfig, dateToAngle }: WheelRenderEphemeraInternal,
) {
  const {
    eventFontSize,
    eventInnerRadius,
    laneGap,
    laneWidth,
    minimumVisibleAngleDeg,
    reverse,
  } = styleConfig;
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
        {eventFontSize > 0 ? (
          <>
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
          </>
        ) : null}
      </React.Fragment>
    );
  });
}

function getTodayIndicatorElements({
  dateToAngle,
  styleConfig,
}: WheelRenderEphemeraInternal) {
  const { dateInnerRadius, dateOuterRadius } = styleConfig;
  const dateCenterRadius = (dateInnerRadius + dateOuterRadius) / 2;
  const dateArrowSize = Math.abs(dateOuterRadius - dateInnerRadius) / 5;
  if (dateInnerRadius >= dateOuterRadius) return null;
  const angle = dateToAngle(new Date());
  const cosAngle = Math.cos(angle);
  const sinAngle = Math.sin(angle);
  const arrowX = cosAngle * dateCenterRadius;
  const arrowY = sinAngle * dateCenterRadius;
  const x1 = cosAngle * dateInnerRadius;
  const y1 = sinAngle * dateInnerRadius;
  const x2 = cosAngle * dateOuterRadius;
  const y2 = sinAngle * dateOuterRadius;
  const angleDeg = (angle * 180) / Math.PI;
  return (
    <>
      <line
        x1={x1.toFixed(DEFAULT_FRACTION_DIGITS)}
        y1={y1.toFixed(DEFAULT_FRACTION_DIGITS)}
        x2={x2.toFixed(DEFAULT_FRACTION_DIGITS)}
        y2={y2.toFixed(DEFAULT_FRACTION_DIGITS)}
        stroke="black"
        strokeWidth={2}
        opacity={1}
      />
      <g
        transform={`translate(${arrowX},${arrowY}) rotate(${angleDeg + 180}) translate(0,${dateArrowSize * -0.2})`}
      >
        <polygon
          points={`0,${-dateArrowSize} ${dateArrowSize},${dateArrowSize} ${-dateArrowSize},${dateArrowSize}`}
          fill="white"
          stroke="black"
        />
      </g>
    </>
  );
}

export function Wheel({
  events,
  minDate,
  maxDate,
  dateLocale,
  styleConfig,
  palette,
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

  const eph: WheelRenderEphemeraInternal = {
    minDate: minDateT,
    maxDate: maxDateT,
    dateLocale,
    palette,
    styleConfig,
    dateToAngle,
  };

  const transform = [
    `translate(${size / 2},${size / 2})`,
    styleConfig.alignWheelToToday
      ? `rotate(${((+new Date() - minTimestamp) / tsRange) * -360})`
      : "",
  ]
    .filter(Boolean)
    .join(",");
  return (
    <svg viewBox={`0 0 ${size} ${size}`}>
      <g transform={transform}>
        {getMonthRingElements(eph)}
        {getWeekRingElements(eph)}
        {getDateRingElements(eph)}
        {styleConfig.showTodayIndicator ? getTodayIndicatorElements(eph) : null}
        {getEventsElements(events, eph)}
      </g>
    </svg>
  );
}
