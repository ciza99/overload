import { View } from "react-native";
import { TextField, Icon, Button } from "@components/common";
import { DialogProps } from "@components/store/use-store";
import { trpc } from "@utils/trpc";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const createTemplateSchema = z.object({
  name: z.string().min(3, "Name is too short").max(20, "Name is too long"),
});

export const CreateTemplateDialog = ({
  close,
  templateGroupId,
}: DialogProps<{ templateGroupId: number }>) => {
  const utils = trpc.useContext();
  const { handleSubmit, control } = useForm({
    resolver: zodResolver(createTemplateSchema),
    defaultValues: { name: "" },
  });
  const { mutate } = trpc.training.createTemplate.useMutation({
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
          onPress={handleSubmit(({ name }) =>
            mutate({ name, templateGroupId })
          )}
          beforeIcon={<Icon name="add" />}
        >
          Create template
        </Button>
      </View>
    </View>
  );
};
