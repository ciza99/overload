export const moduloWrap = (input: number, modulo: number) =>
  ((input % modulo) + modulo) % modulo;
