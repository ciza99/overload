import { View } from "react-native";
import BaseToast, {
  ToastConfigParams,
  ToastShowParams,
} from "react-native-toast-message";

import { colors } from "../theme";
import { Divider } from "./divider";
import { Icon } from "./icon";
import { Typography } from "./typography";

const renderToast = ({ type, text1, text2 }: ToastConfigParams<unknown>) => (
  <View className="flex w-[90%] flex-row justify-center px-2">
    <View className="flex grow flex-row items-center rounded-lg bg-base-600/95 px-4 py-2">
      <View className="mr-2">
        {type === "success" ? (
          <Icon color={colors.success} name="checkmark-circle-outline" />
        ) : type === "error" ? (
          <Icon color={colors.danger} name="alert-circle-outline" />
        ) : (
          <Icon color={colors.danger} name="information-circle-outline" />
        )}
      </View>
      <Divider direction="vertical" className="mr-2 bg-base-300" />
      <View className="flex shrink flex-col">
        {text1 && <Typography className="text-lg">{text1}</Typography>}
        {text2 && <Typography className="text-base-100">{text2}</Typography>}
      </View>
    </View>
  </View>
);

type ToastType = "success" | "error" | "info";
type ConfigType<TParams = unknown> = Record<
  ToastType,
  (params: ToastConfigParams<TParams>) => JSX.Element
>;

const toastConfig: ConfigType = {
  success: renderToast,
  error: renderToast,
  info: renderToast,
};

export const Toast = () => (
  <BaseToast
    position="bottom"
    bottomOffset={90}
    autoHide={true}
    config={toastConfig}
  />
);

type ShowParams = Omit<ToastShowParams, "type"> & {
  type: ToastType;
};

export const toast = {
  show: (params: ShowParams) => BaseToast.show(params),
  hide: BaseToast.hide,
};
