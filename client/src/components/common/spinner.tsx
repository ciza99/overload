import { animated, useSpring } from "@react-spring/native";
import clsx from "clsx";
import { StyleProp, ViewStyle } from "react-native";

type Props = {
  style?: StyleProp<ViewStyle>;
  color?: "primary" | "white";
  className?: string;
};

export const Spinner = ({ style, color = "primary", className }: Props) => {
  const { rotate } = useSpring({
    from: {
      rotate: "0deg",
    },
    to: {
      rotate: "360deg",
    },
    loop: true,
    config: {
      mass: 1,
      tension: 100,
      friction: 20,
    },
  });

  return (
    <animated.View
      className={clsx(
        "!border-l-transparent rounded-full border-4 w-5 h-5",
        {
          "border-t-primary border-r-primary border-b-primary":
            color === "primary",
          "border-t-white border-r-white border-b-white": color === "white",
        },
        className
      )}
      style={[{ transform: [{ rotate }] }, style]}
    />
  );
};
