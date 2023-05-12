import { View } from "react-native";
import { TextField, SubmitButton, Icon } from "@components/common";
import { DialogProps } from "@components/store/use-store";
import { trpc } from "@utils/trpc";
import { Formik } from "formik";
import { useFormikValidation } from "@hooks/use-formik-validation";
import { z } from "zod";

export const CreateTemplateDialog = ({
  close,
  templateGroupId,
}: DialogProps<{ templateGroupId: number }>) => {
  const utils = trpc.useContext();
  const { mutate } = trpc.training.createTemplate.useMutation({
    onSuccess: () => {
      utils.training.getTemplates.invalidate();
    },
    onSettled: () => close(),
  });

  const validate = useFormikValidation(
    z.object({
      name: z.string().min(3, "Name is too short").max(20, "Name is too long"),
    })
  );

  return (
    <View className="w-full">
      <Formik
        initialValues={{ name: "" }}
        onSubmit={({ name }) => mutate({ name, templateGroupId })}
        validate={validate}
      >
        <View className="gap-y-4">
          <TextField name="name" placeholder="Enter name" autoFocus={true} />
          <SubmitButton beforeIcon={<Icon name="add" />}>
            Create template
          </SubmitButton>
        </View>
      </Formik>
    </View>
  );
};
