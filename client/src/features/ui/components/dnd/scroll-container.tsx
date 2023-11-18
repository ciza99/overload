import { ReactNode } from "react";
import { ScrollViewProps, useWindowDimensions, View } from "react-native";
import Animated, {
  cancelAnimation,
  measure,
  MeasuredDimensions,
  scrollTo,
  useAnimatedReaction,
  useAnimatedRef,
  useAnimatedScrollHandler,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

import { useDndContext } from "./DndContext";

export const ScrollContainer = ({
  children,
  ...rest
}: Omit<ScrollViewProps, "onScroll" | "ref"> & { children: ReactNode }) => {
  const scrollRef = useAnimatedRef<Animated.ScrollView>();
  const contentRef = useAnimatedRef<View>();
  const scrollY = useSharedValue(0);
  const { absolute, scrollOffset, dragging } = useDndContext();
  const dimensions = useWindowDimensions();
  const containerMeasurement = useSharedValue<MeasuredDimensions | null>(null);
  const contentMesurement = useSharedValue<MeasuredDimensions | null>(null);
  const initialScroll = useSharedValue({ x: 0, y: 0 });

  useAnimatedReaction(
    () => {
      // noop
    },
    () => {
      if (!dragging) return;
      containerMeasurement.value = measure(scrollRef);
      contentMesurement.value = measure(contentRef);
    },
    [dragging]
  );

  const handler = useAnimatedScrollHandler(
    (e) => {
      if (dragging) return;
      scrollY.value = e.contentOffset.y;
      initialScroll.value = { x: e.contentOffset.x, y: e.contentOffset.y };
    },
    [dragging]
  );

  useAnimatedReaction(
    () => ({ scrollY: scrollY.value, initialScroll: initialScroll.value }),
    (props) => {
      scrollOffset.value = { x: 0, y: props.scrollY - props.initialScroll.y };
    },
    []
  );

  useAnimatedReaction(
    () => ({
      absolute: absolute.value,
      containerMeasurement: containerMeasurement.value,
      contentMesurement: contentMesurement.value,
    }),
    ({ absolute, containerMeasurement, contentMesurement }) => {
      if (!dragging || !containerMeasurement || !contentMesurement) {
        cancelAnimation(scrollY);
        return;
      }

      const positionY = absolute.y + scrollY.value;
      if (positionY < scrollY.value + 150) {
        scrollY.value = withTiming(0, { duration: 1500 });
        return;
      }

      if (positionY > scrollY.value + dimensions.height - 150) {
        scrollY.value = withTiming(
          contentMesurement.height - containerMeasurement.height,
          {
            duration: 1500,
          }
        );
        return;
      }

      cancelAnimation(scrollY);
    },
    [dimensions, dragging]
  );

  useAnimatedReaction(
    () => scrollY.value,
    (scrollY) => {
      scrollTo(scrollRef, 0, scrollY, false);

      if (dragging) return;
      initialScroll.value = { x: 0, y: scrollY };
    },
    [dragging]
  );

  return (
    <Animated.ScrollView
      scrollEventThrottle={16}
      ref={scrollRef}
      onScroll={handler}
      {...rest}
    >
      <View ref={contentRef}>{children}</View>
    </Animated.ScrollView>
  );
};
