import { View } from "react-native";
import { TextField, SubmitButton } from "@components/common";
import { DialogProps } from "@components/store/use-store";
import { trpc } from "@utils/trpc";
import { Formik } from "formik";
import { useFormikValidation } from "@hooks/use-formik-validation";
import { z } from "zod";
import { Ionicons } from "@expo/vector-icons";

export const CreateGroupDialog = ({ close }: DialogProps) => {
  const utils = trpc.useContext();
  const { mutate } = trpc.training.createTemplateGroup.useMutation({
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
    <View>
      <Formik
        initialValues={{ name: "" }}
        onSubmit={(values) => mutate(values)}
        validate={validate}
      >
        <View className="gap-y-4">
          <TextField name="name" placeholder="Enter name" autoFocus={true} />
          <SubmitButton beforeIcon={<Ionicons name="add" size={24} />}>
            Create group
          </SubmitButton>
        </View>
      </Formik>
    </View>
  );
};
