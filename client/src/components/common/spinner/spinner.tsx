import { animated, useSpring } from "@react-spring/native";
import cx from "clsx";
import { View, ViewProps } from "react-native";

type Props = {
  tw?: string;
  style?: ViewProps["style"];
};

const AnimatedView = animated(View);

export const Spinner = ({ tw, style }: Props) => {
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
    <AnimatedView
      tw={cx(
        tw,
        "border-4 border-r-transparent border-gray-300 rounded-full h-8 w-8"
      )}
      style={[{ transform: [{ rotate }] }, style]}
    />
  );
};
