import { forwardRef } from "react";
import { View } from "react-native";
import {
  BottomSheetBackdropProps,
  BottomSheetBackgroundProps,
  BottomSheetModal as BottomSheetModalBase,
  BottomSheetModalProps,
} from "@gorhom/bottom-sheet";
import Animated, {
  Extrapolate,
  interpolate,
  useAnimatedStyle,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export const BackdropComponent = ({
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

export const BackgroundComponent = ({ style }: BottomSheetBackgroundProps) => (
  <View className="rounded-tl-2xl rounded-tr-2xl bg-base-700" style={style} />
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
    const { top, bottom } = useSafeAreaInsets();

    return (
      <BottomSheetModalBase
        {...props}
        ref={ref}
        containerStyle={{
          marginTop: top,
          zIndex: 10,
          paddingBottom: bottom,
        }}
        backdropComponent={backdropComponent}
        backgroundComponent={backgroundComponent}
        handleIndicatorStyle={handleIndicatorStyle}
      />
    );
  }
);

BottomSheetModal.displayName = "BottomSheetModal";
