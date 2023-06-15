import { View } from "react-native";
import BaseToast, {
  ToastConfigParams,
  ToastShowParams,
} from "react-native-toast-message";
import { Divider } from "./divider";
import { Icon } from "./icon";
import { Typography } from "./typography";

const renderToast = ({ type, text1, text2 }: ToastConfigParams<unknown>) => (
  <View className="w-full px-2 flex flex-row justify-center">
    <View className="bg-base-600/95 grow flex flex-row items-center px-4 py-2 rounded-lg">
      <View className="mr-2">
        {type === "success" ? (
          <Icon name="checkmark-circle-outline" />
        ) : type === "error" ? (
          <Icon name="alert-circle-outline" />
        ) : (
          <Icon name="information-circle-outline" />
        )}
      </View>
      <Divider direction="vertical" className="bg-base-300 mr-2" />
      <View className="flex flex-col">
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
