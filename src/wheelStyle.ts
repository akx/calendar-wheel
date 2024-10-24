export interface WheelStyleConfig {
  // Radii
  dateInnerRadius: number;
  dateOuterRadius: number;
  eventInnerRadius: number;
  monthInnerRadius: number;
  monthOuterRadius: number;
  weekInnerRadius: number;
  weekOuterRadius: number;
  // Lanes
  laneGap: number;
  laneWidth: number;
  // Angles
  angleOffsetDeg: number;
  minimumVisibleAngleDeg: number;
  reverse: boolean;
  // Typography
  eventFontSize: number;
  monthFontSize: number;
  weekFontSize: number;
  // Misc
  isoWeeks: boolean;
  size: number;
}

export function getDefaultWheelStyle(size: number): WheelStyleConfig {
  const monthOuterRadius = (size / 2) * 0.9;
  const monthInnerRadius = (size / 2) * 0.78;
  const weekInnerRadius = (size / 2) * 0.9;
  const weekOuterRadius = (size / 2) * 0.93;
  const radiusAdj = (size / 2) * 0.02;
  const laneWidth = (size / 2) * 0.04;
  const laneGap = Math.ceil(laneWidth / 3);
  return {
    // Misc
    size,
    isoWeeks: true,
    // Lanes
    laneGap,
    laneWidth,
    // Radii
    dateInnerRadius: monthInnerRadius + radiusAdj / 2,
    dateOuterRadius: monthOuterRadius - radiusAdj / 2,
    eventInnerRadius: monthOuterRadius - radiusAdj - laneWidth,
    monthInnerRadius,
    monthOuterRadius,
    weekInnerRadius,
    weekOuterRadius,
    // Angles
    angleOffsetDeg: -90,
    minimumVisibleAngleDeg: 0,
    reverse: false,
    // Typography
    eventFontSize: 9,
    monthFontSize: 20,
    weekFontSize: 12,
  };
}
