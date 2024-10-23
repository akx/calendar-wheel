export const DEFAULT_FRACTION_DIGITS = 2;

export function generateArcPathCommand(
  centerX: number,
  centerY: number,
  radius: number,
  startAngle: number,
  endAngle: number,
  fractionDigits: number = DEFAULT_FRACTION_DIGITS,
): string {
  const x1 = centerX + radius * Math.cos(startAngle);
  const y1 = centerY + radius * Math.sin(startAngle);
  const x2 = centerX + radius * Math.cos(endAngle);
  const y2 = centerY + radius * Math.sin(endAngle);
  return `M${x1.toFixed(fractionDigits)},${y1.toFixed(fractionDigits)} A${radius} ${radius} 0 0 1 ${x2.toFixed(fractionDigits)},${y2.toFixed(fractionDigits)}`;
}

export function generateFatArcPathCommand(
  centerX: number,
  centerY: number,
  innerRadius: number,
  outerRadius: number,
  startAngle: number,
  endAngle: number,
  fractionDigits: number = DEFAULT_FRACTION_DIGITS,
) {
  const ix1 = centerX + innerRadius * Math.cos(startAngle);
  const iy1 = centerY + innerRadius * Math.sin(startAngle);
  const ix2 = centerX + innerRadius * Math.cos(endAngle);
  const iy2 = centerY + innerRadius * Math.sin(endAngle);
  const ox1 = centerX + outerRadius * Math.cos(startAngle);
  const oy1 = centerY + outerRadius * Math.sin(startAngle);
  const ox2 = centerX + outerRadius * Math.cos(endAngle);
  const oy2 = centerY + outerRadius * Math.sin(endAngle);

  return [
    `M${ix1.toFixed(fractionDigits)},${iy1.toFixed(fractionDigits)} A${innerRadius} ${innerRadius} 0 0 1 ${ix2.toFixed(fractionDigits)},${iy2.toFixed(fractionDigits)}`,
    `L${ox2.toFixed(fractionDigits)},${oy2.toFixed(fractionDigits)}`,
    `A${outerRadius} ${outerRadius} 0 0 0 ${ox1.toFixed(fractionDigits)},${oy1.toFixed(fractionDigits)}`,
    `Z`,
  ].join(" ");
}
