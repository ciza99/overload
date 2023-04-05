import { MeasuredDimensions } from "react-native-reanimated";

export type NodeType = "draggable" | "droppable";
export type Key = string;

export type Modifier = (props: {
  active: Key | null;
  over: Key | null;
  activeRect: MeasuredDimensions | null;
  droppableRects: Record<Key, MeasuredDimensions>;
  translateX: number;
  translateY: number;
}) => { translateX: number; translateY: number };
