import { useStore } from "@features/core/hooks/use-store";
import { toast } from "@features/ui/components";

import { sessionToFormValues } from "../lib/session-to-form-values";
import { ExerciseType, SessionType } from "../types/training";

export const useSession = () => {
  const setSession = useStore((state) => state.session.setSession);
  const isActive = useStore((state) => state.session.active);

  const startSession = (session: SessionType, exercises: ExerciseType[]) => {
    if (isActive) {
      return toast.show({
        type: "info",
        text1: "You are already in a session, please end it first",
      });
    }

    setSession({
      startedAt: new Date(),
      templateId: session.templateId,
      initialFormValues: sessionToFormValues(session, exercises),
    });
  };

  return { startSession };
};
