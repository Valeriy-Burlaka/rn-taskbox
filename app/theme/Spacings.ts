const unitlessValues = {
  space50: 8,
  space75: 12,
  space100: 16, // base value (100%)
  space125: 20,
  space200: 32,
  space300: 48,
  space400: 64,
};

const valuesInPixels: Record<keyof typeof unitlessValues, string> = Object.fromEntries(
  Object
    .entries(unitlessValues)
    .map(([key, value]) => [key, `${value}px`])
);

export const spacings = {
  ...valuesInPixels,
  unitless: unitlessValues,
};
