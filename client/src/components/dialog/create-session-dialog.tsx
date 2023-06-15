import { View } from "react-native";
import { TextField, Icon, Button } from "@components/common";
import { DialogProps } from "@components/store/use-store";
import { trpc } from "@utils/trpc";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

const createSessionSchema = z.object({
  name: z.string().min(3, "Name is too short").max(20, "Name is too long"),
});

export const CreateSessionDialog = ({
  close,
  templateId,
}: DialogProps<{ templateId: number }>) => {
  const utils = trpc.useContext();
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
