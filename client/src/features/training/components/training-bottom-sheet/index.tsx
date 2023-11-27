import { FC, useEffect, useRef } from "react";
import { KeyboardAvoidingView, View } from "react-native";
import BottomSheet, { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { FormProvider, useForm } from "react-hook-form";
import { SharedValue } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useStore } from "@features/core/hooks/use-store";
import { trpc } from "@features/api/trpc";
import { Button, toast } from "@features/ui/components";
import { colors } from "@features/ui/theme";
import { sessionFormToLogFormat } from "@features/training/lib/session-form-to-upload-format";

import { SessionFormExercises } from "../session-form-exercises";
import { Timer } from "./timer";

export const TrainingBottomSheet: FC<{
  snapPointOffset?: number;
  onChange?: (index: number) => void;
  animatedIndex?: SharedValue<number>;
}> = ({ snapPointOffset = 0, onChange, animatedIndex }) => {
  const { mutate: uploadSession } = trpc.training.logSession.useMutation({
    onSuccess: () => {
      ref.current?.close();
      stopSession();
    },
    onError: () => {
      toast.show({ type: "error", text1: "Something went wrong" });
    },
  });
  const initialFormValues = useStore(
    (state) => state.session.initialFormValues
  );
  const active = useStore((state) => state.session.active);
  const startedAt = useStore((state) => state.session.startedAt);
  const stopSession = useStore((state) => state.session.stopSession);

  const methods = useForm({ defaultValues: initialFormValues });

  const handleSubmit = methods.handleSubmit;
  const reset = methods.reset;

  useEffect(() => {
    if (!active) return;
    ref.current?.snapToIndex(1);
    reset(initialFormValues);
  }, [active, reset, initialFormValues]);

  const { top, bottom } = useSafeAreaInsets();
  const ref = useRef<BottomSheet>(null);

  return (
    <BottomSheet
      ref={ref}
      animatedIndex={animatedIndex}
      onChange={onChange}
      backgroundComponent={(props) => (
        <View className="bg-base-800" {...props} />
      )}
      handleIndicatorStyle={{ backgroundColor: "white" }}
      handleStyle={{ backgroundColor: colors.base[700] }}
      backgroundStyle={{ borderTopLeftRadius: 0, borderTopRightRadius: 0 }}
      containerStyle={{
        marginTop: top,
        paddingBottom: bottom,
      }}
      snapPoints={[snapPointOffset + 25, "100%"]}
      index={-1}
    >
      <FormProvider {...methods}>
        <BottomSheetScrollView stickyHeaderIndices={[0]}>
          <View className="flex flex-row items-center justify-between border-b border-base-500 bg-base-700 p-4">
            <Timer />
            <Button
              onPress={handleSubmit((data) =>
                uploadSession(
                  sessionFormToLogFormat(data, {
                    startedAt,
                    endedAt: new Date(),
                  })
                )
              )}
            >
              Finish
            </Button>
          </View>
          <KeyboardAvoidingView behavior="padding" keyboardVerticalOffset={100}>
            <SessionFormExercises className="overflow-visible py-4" />
          </KeyboardAvoidingView>
        </BottomSheetScrollView>
      </FormProvider>
    </BottomSheet>
  );
};
