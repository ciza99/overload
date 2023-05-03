import { MeasuredDimensions } from "react-native-reanimated";
import { NodeId } from "./types";

type CollisionDetectionProps = {
  activeRect: MeasuredDimensions;
  droppableRects: Record<string, MeasuredDimensions>;
};

type CollisionDetectionFnc = (
  props: CollisionDetectionProps
) => { id: NodeId; ratio: number }[];

export const rectIntersection = (
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
    source.pageY + source.height,
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

export const rectIntersections: CollisionDetectionFnc = ({
  activeRect,
  droppableRects,
}) => {
  "worklet";
  const ratios = Object.entries(droppableRects).map(([id, targetRect]) => {
    const ratio = rectIntersection(activeRect, targetRect);
    return { id, ratio };
  });

  return ratios.sort((a, b) => b.ratio - a.ratio);
};
