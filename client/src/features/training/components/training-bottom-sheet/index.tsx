import { FC, useEffect, useRef } from "react";
import { KeyboardAvoidingView, View } from "react-native";
import BottomSheet, { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { FormProvider, useForm } from "react-hook-form";
import { SharedValue } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ConfirmationDialog } from "@features/core/components/confirmation-dialog";
import { useStore } from "@features/core/hooks/use-store";
import { trpc } from "@features/api/trpc";
import { Button, toast } from "@features/ui/components";
import { colors } from "@features/ui/theme";
import { sessionFormToLogFormat } from "@features/training/lib/session-form-to-upload-format";
import { SessionFormType } from "@features/training/types/training";

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
      endSession();
    },
    onError: (error) => {
      toast.show({
        type: "error",
        text1: error.message ?? "Something went wrong",
      });
    },
  });
  const open = useStore((state) => state.dialog.open);
  const initialFormValues = useStore(
    (state) => state.session.initialFormValues
  );
  const active = useStore((state) => state.session.active);
  const startedAt = useStore((state) => state.session.startedAt);
  const endSession = useStore((state) => state.session.endSession);

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

  const onSubmit = (data: SessionFormType) => {
    const hasNoSets = data.exercises.every(({ sets }) => sets.length === 0);

    if (hasNoSets) {
      return toast.show({
        type: "error",
        text1: "You need to finish at least one set",
      });
    }

    uploadSession(
      sessionFormToLogFormat(data, {
        startedAt,
        endedAt: new Date(),
      })
    );
  };

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
            <Button onPress={handleSubmit(onSubmit)}>Finish</Button>
          </View>
          <KeyboardAvoidingView behavior="padding" keyboardVerticalOffset={100}>
            <SessionFormExercises
              className="overflow-visible py-4"
              actions={
                <Button
                  className="mt-4 bg-danger"
                  onPress={() => {
                    open({
                      title: "Cancel session",
                      Component: ConfirmationDialog,
                      props: {
                        content:
                          "Are you sure you want to cancel this session?",
                        confirmText: "Cancel session",
                        confirmButtonProps: {
                          className: "bg-danger",
                        },
                        onConfirm: () => {
                          endSession();
                          ref.current?.close();
                        },
                        cancelText: "Keep going",
                      },
                    });
                  }}
                >
                  Cancel session
                </Button>
              }
            />
          </KeyboardAvoidingView>
        </BottomSheetScrollView>
      </FormProvider>
    </BottomSheet>
  );
};
