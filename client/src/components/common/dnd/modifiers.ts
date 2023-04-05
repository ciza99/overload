import { Modifier } from "./types";

export const restrictToYAxis: Modifier = ({ translateY }) => {
  "worklet";
  return { translateY, translateX: 0 };
};
