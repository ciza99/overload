import { RefObject } from "react";
import Animated from "react-native-reanimated";

export type NodeId = number | string;
export type NodeType = "draggable" | "droppable";

export type Draggable = {
  id: NodeId;
  ref: RefObject<Animated.View>;
};

export type Droppable = Draggable;
export type Transform = { tx: number; ty: number };
