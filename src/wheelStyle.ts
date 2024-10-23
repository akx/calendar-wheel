export interface WheelStyleConfig {
  monthOuterRadius: number;
  monthInnerRadius: number;
  eventInnerRadius: number;
  dateInnerRadius: number;
  dateOuterRadius: number;
  laneWidth: number;
  laneGap: number;
  size: number;
  angleOffsetDeg: number;
  minimumVisibleAngleDeg: number;
}

export function getDefaultWheelStyle(size: number): WheelStyleConfig {
  const monthOuterRadius = (size / 2) * 0.92;
  const monthInnerRadius = (size / 2) * 0.78;
  const radiusAdj = (size / 2) * 0.02;
  const laneWidth = (size / 2) * 0.04;
  const laneGap = Math.ceil(laneWidth / 3);
  return {
    monthOuterRadius,
    monthInnerRadius,
    laneGap,
    laneWidth,
    eventInnerRadius: monthOuterRadius - radiusAdj - laneWidth,
    dateInnerRadius: monthInnerRadius + radiusAdj / 2,
    dateOuterRadius: monthOuterRadius - radiusAdj / 2,
    size,
    angleOffsetDeg: -90,
    minimumVisibleAngleDeg: 0,
  };
}
