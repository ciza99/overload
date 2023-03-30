import { ReactNode, useRef } from "react";
import { View } from "react-native";
import { useDrag } from "@use-gesture/react";
import { useSprings, config, animated } from "@react-spring/native";
import clamp from "lodash/clamp";

const swap = <T,>(array: T[], aIndex: number, bIndex: number) => {
  const newArray = [...array];
  [newArray[aIndex], newArray[bIndex]] = [newArray[bIndex], newArray[aIndex]];

  return newArray;
};

const fn =
  (order: number[], active = false, originalIndex = 0, curIndex = 0, y = 0) =>
  (index: number) =>
    active && index === originalIndex
      ? {
          y: curIndex * 100 + y,
          scale: 1.1,
          zIndex: 1,
          shadow: 15,
          immediate: (key: string) => key === "zIndex",
          config: (key: string) =>
            key === "y" ? config.stiff : config.default,
        }
      : {
          y: order.indexOf(index) * 100,
          scale: 1,
          zIndex: 0,
          shadow: 1,
          immediate: false,
        };

const AnimatedView = animated(View);

export const DraggableList = ({ children }: { children: ReactNode[] }) => {
  const order = useRef(children.map((_, i) => i));
  const [springs, api] = useSprings(children.length, fn(order.current));

  const bind = useDrag(
    ({ args: [originalIndex], active, movement: [, my] }) => {
      const curIndex = order.current.indexOf(originalIndex);
      const curRow = clamp(
        Math.round((curIndex * 100 + my) / 100),
        0,
        children.length - 1
      );
      const newOrder = swap(order.current, curIndex, curRow);
      api.start(fn(newOrder, active, originalIndex, curIndex, my));
      if (!active) order.current = newOrder;
    }
  );

  return (
    <View>
      {springs.map(({ zIndex, shadow, y, scale }, i) => (
        <AnimatedView
          key={i}
          style={{
            zIndex,
            // boxShadow: shadow.to(
            //   (s) => `rgba(0, 0, 0, 0.15) 0px ${s}px ${2 * s}px 0px`
            // ),
            transform: [{ translateY: y }, { scale }],
          }}
          children={children[i]}
        />
      ))}
    </View>
  );
};
