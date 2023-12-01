import { View, ViewProps } from "react-native";
import clsx from "clsx";

type PaperProps = ViewProps & {
  elevation?: 1 | 2 | 3 | 4;
};

export const Paper = ({
  elevation = 1,
  children,
  className,
  ...props
}: PaperProps) => {
  return (
    <View
      className={clsx(
        "rounded-lg",
        {
          "bg-base-700": elevation === 1,
          "bg-base-600": elevation === 2,
          "bg-base-500": elevation === 3,
          "bg-base-400": elevation === 4,
        },
        className
      )}
      {...props}
    >
      {children}
    </View>
  );
};
