import { Transform } from "./types";

export type ModifierFnc = (props: Transform) => Transform;

export const restrictToYAxis: ModifierFnc = ({ ty }) => {
  "worklet";
  return { tx: 0, ty };
};
