export const createMediaQuery = (bound: "min" | "max", width: number) =>
  `(${bound}-width: ${width}px)`;
