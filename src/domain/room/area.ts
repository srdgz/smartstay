const SQUARE_METERS_PER_SQUARE_FOOT = 0.09290304;

export const squareFeetToSquareMeters = (squareFeet: number) =>
  Math.round(squareFeet * SQUARE_METERS_PER_SQUARE_FOOT);

export const parseSquareFeet = (dimension: string) => {
  const match = dimension.match(/^\s*(\d+)/);
  return match ? Number(match[1]) : null;
};
