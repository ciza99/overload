import { useEffect } from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { NativeStackNavigationProp } from "@react-navigation/native-stack/lib/typescript/src/types";
import { FormProvider, useForm } from "react-hook-form";

import { NavigationParamMap } from "@features/core/components/router";
import { trpc } from "@features/api/trpc";
import { Spinner, toast, Typography } from "@features/ui/components";

import { SessionFormExercises } from "../components/session-form-exercises";
import { sessionFormToUploadFormat } from "../lib/session-form-to-upload-format";
import { sessionToFormValues } from "../lib/session-to-form-values";
import { ExerciseType } from "../types/training";

type Props = NativeStackScreenProps<NavigationParamMap, "session">;

export const SessionEditor = () => {
  const { data: exercises } = trpc.training.getExercises.useQuery();

  if (!exercises) return <Spinner />;

  return <SessionForm exercises={exercises} />;
};

type ExercisesScreenProps = NativeStackNavigationProp<
  NavigationParamMap,
  "session"
>;

const SessionForm = ({ exercises }: { exercises: ExerciseType[] }) => {
  const {
    params: { session },
  } = useRoute<Props["route"]>();
  const methods = useForm({
    defaultValues: sessionToFormValues(session, exercises),
  });

  const utils = trpc.useUtils();
  const navigation = useNavigation<ExercisesScreenProps>();

  const { mutate: updateSession } = trpc.training.updateSession.useMutation({
    onSuccess: () => {
      utils.training.getTemplates.invalidate();
      navigation.goBack();
    },
    onError: () => {
      toast.show({ type: "error", text1: "Session could not be saved" });
    },
  });

  const handleSubmit = methods.handleSubmit;

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Typography
          weight="light"
          className="text-base text-primary"
          onPress={handleSubmit((sessionForm) =>
            updateSession(sessionFormToUploadFormat(sessionForm))
          )}
        >
          Save
        </Typography>
      ),
    });
  }, [navigation, updateSession, handleSubmit]);

  return (
    <FormProvider {...methods}>
      <SessionFormExercises />
    </FormProvider>
  );
};
