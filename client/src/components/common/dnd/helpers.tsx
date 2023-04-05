import { RefObject } from "react";
import Animated, { measure, MeasuredDimensions } from "react-native-reanimated";
import { Key } from "./types";

export const calculateRects = (
  nodes: Record<Key, RefObject<Animated.View>>
) => {
  "worklet";

  return Object.entries(nodes).reduce((acc, [key, ref]) => {
    const measuredDimensions = measure(ref);

    return {
      ...acc,
      [key]: measuredDimensions,
    };
  }, {});
};

export const calculateIntersectionRatio = (
  source: MeasuredDimensions,
  target: MeasuredDimensions
) => {
  "worklet";
  const left = Math.max(source.pageX, target.pageX);
  const right = Math.min(
    source.pageX + source.width,
    target.pageX + target.width
  );
  const top = Math.max(source.pageY, target.pageY);
  const bottom = Math.min(
    source.pageY + target.height,
    target.pageY + target.height
  );

  if (left >= right || top >= bottom) {
    return 0;
  }

  const width = right - left;
  const height = bottom - top;

  const intersectionArea = width * height;
  const sourceArea = source.width * source.height;
  const targetArea = target.width * target.height;

  return intersectionArea / (sourceArea + targetArea - intersectionArea);
};

export const calculateIntersections = (
  sourceRect: MeasuredDimensions,
  droppableRects: Record<Key, MeasuredDimensions>
) => {
  "worklet";
  const entries = [...Object.entries(droppableRects)];
  const ratios = entries.map(([key, targetRect]) => {
    if (!targetRect) {
      return { key, ratio: 0 };
    }

    const ratio = calculateIntersectionRatio(sourceRect, targetRect);

    return { key, ratio };
  });

  return ratios.sort((a, b) => b.ratio - a.ratio);
};
