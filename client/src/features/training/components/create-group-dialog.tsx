import { View } from "react-native";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { DialogProps } from "@features/core/hooks/use-store";
import { trpc } from "@features/api/trpc";
import { Button, Icon, TextField } from "@features/ui/components";

const createGroupSchema = z.object({
  name: z.string().min(3, "Name is too short").max(20, "Name is too long"),
});

export const CreateGroupDialog = ({ close }: DialogProps) => {
  const utils = trpc.useContext();
  const { handleSubmit, control } = useForm({
    resolver: zodResolver(createGroupSchema),
    defaultValues: { name: "" },
  });
  const { mutate } = trpc.training.createTemplateGroup.useMutation({
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
          placeholder="Enter name"
          className="mb-4"
          autoFocus={true}
          control={control}
        />
        <Button
          beforeIcon={<Icon name="add" />}
          onPress={handleSubmit((v) => mutate(v))}
        >
          Create group
        </Button>
      </View>
    </View>
  );
};
