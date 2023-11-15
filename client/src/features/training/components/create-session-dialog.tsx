import { View } from "react-native";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { DialogProps } from "@features/core/hooks/use-store";
import { trpc } from "@features/api/trpc";
import { Button, Icon, TextField } from "@features/ui/components";

const createSessionSchema = z.object({
  name: z.string().min(3, "Name is too short").max(20, "Name is too long"),
});

export const CreateSessionDialog = ({
  close,
  templateId,
}: DialogProps<{ templateId: number }>) => {
  const utils = trpc.useUtils();
  const { handleSubmit, control } = useForm({
    resolver: zodResolver(createSessionSchema),
    defaultValues: { name: "" },
  });
  const { mutate } = trpc.training.createSession.useMutation({
    onSuccess: () => {
      utils.training.getTemplates.invalidate();
    },
    onSettled: () => close(),
  });

  return (
    <View className="w-full">
      <View>
        <TextField
          name="name"
          className="mb-4"
          placeholder="Enter name"
          autoFocus={true}
          control={control}
        />
        <Button
          beforeIcon={<Icon name="add" />}
          onPress={handleSubmit(({ name }) => mutate({ name, templateId }))}
        >
          Create session
        </Button>
      </View>
    </View>
  );
};
