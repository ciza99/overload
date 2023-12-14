import { View } from "react-native";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { DialogProps } from "@features/core/hooks/use-store";
import { trpc } from "@features/api/trpc";
import { Button, Icon, TextField } from "@features/ui/components";
import { Toggle } from "@features/ui/components/toggle";

const createSessionSchema = z.discriminatedUnion("isRest", [
  z.object({
    name: z.string().min(4, "Name is too short").max(20, "Name is too long"),
    isRest: z.literal(false),
  }),
  z.object({
    isRest: z.literal(true),
  }),
]);

export const CreateSessionDialog = ({
  close,
  templateId,
}: DialogProps<{ templateId: number }>) => {
  const utils = trpc.useUtils();
  const { handleSubmit, control, watch } = useForm({
    resolver: zodResolver(createSessionSchema),
    defaultValues: { name: "", isRest: false },
  });
  const { mutate } = trpc.training.createSession.useMutation({
    onSuccess: () => {
      utils.training.getTemplate.invalidate({ id: templateId });
    },
    onSettled: () => close(),
  });

  const isRest = watch("isRest");

  return (
    <View className="w-full">
      <Toggle label="Rest day" name="isRest" control={control} />
      {!isRest && (
        <TextField
          name="name"
          label="Session name"
          className="mt-4"
          placeholder="Enter name"
          autoFocus={true}
          editable={isRest ? false : true}
          selectTextOnFocus={isRest ? false : true}
          control={control}
        />
      )}
      <Button
        className="mt-4"
        beforeIcon={<Icon name="add" />}
        onPress={handleSubmit(({ name, isRest }) =>
          mutate({ name, templateId, isRest })
        )}
      >
        {isRest ? "Create rest day" : "Create session"}
      </Button>
    </View>
  );
};
