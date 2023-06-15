import {
  BottomSheetBackdropProps,
  BottomSheetBackgroundProps,
  BottomSheetModal as BottomSheetModalBase,
  BottomSheetModalProps,
} from "@gorhom/bottom-sheet";
import { View } from "react-native";
import { forwardRef } from "react";
import Animated, {
  Extrapolate,
  interpolate,
  useAnimatedStyle,
} from "react-native-reanimated";

const BackdropComponent = ({
  animatedIndex,
  style,
}: BottomSheetBackdropProps) => {
  const animatedStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      animatedIndex.value,
      [-1, 0],
      [0, 0.5],
      Extrapolate.CLAMP
    ),
  }));

  return <Animated.View className="bg-black" style={[style, animatedStyle]} />;
};
const BackgroundComponent = ({ style }: BottomSheetBackgroundProps) => (
  <View className="bg-base-700 rounded-tl-2xl rounded-tr-2xl" style={style} />
);

export type BottomSheetModalType = BottomSheetModalBase;

export const BottomSheetModal = forwardRef<
  BottomSheetModalBase,
  BottomSheetModalProps
>(
  (
    {
      backgroundComponent = BackgroundComponent,
      backdropComponent = BackdropComponent,
      handleIndicatorStyle = { backgroundColor: "white" },
      ...props
    },
    ref
  ) => {
    return (
      <BottomSheetModalBase
        {...props}
        ref={ref}
        backdropComponent={BackdropComponent}
        backgroundComponent={BackgroundComponent}
        handleIndicatorStyle={handleIndicatorStyle}
      />
    );
  }
);
