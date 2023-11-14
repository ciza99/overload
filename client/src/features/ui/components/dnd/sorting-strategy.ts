import { MeasuredDimensions } from "react-native-reanimated";

import { Transform } from "./types";

export const arrayMove = <TItem>(array: TItem[], from: number, to: number) => {
  "worklet";
  const newArray = array.slice();
  newArray.splice(
    to < 0 ? newArray.length + to : to,
    0,
    newArray.splice(from, 1)[0]
  );

  return newArray;
};

type SortingStrategyFnc = (props: {
  rects: MeasuredDimensions[];
  activeIndex: number;
  overIndex: number;
  index: number;
}) => Transform;

export const rectSortingStrategy: SortingStrategyFnc = ({
  rects,
  activeIndex,
  overIndex,
  index,
}) => {
  "worklet";
  const newRects = arrayMove(rects, overIndex, activeIndex);

  const rect = rects[index];
  const newRect = newRects[index];

  if (!rect || !newRect) {
    return { tx: 0, ty: 0 };
  }

  return {
    tx: newRect.pageX - rect.pageX,
    ty: newRect.pageY - rect.pageY,
  };
};
