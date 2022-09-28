import { StyleProp } from "react-native";

import { AnyStyle, SxProp } from "context/theme/sx/sx-types";
import { ComponentType, forwardRef } from "react";
import { useSxStyle } from "context/theme/sx/sx-hook";

type BaseProps = {
  style?: StyleProp<AnyStyle>;
};

type StyleOf<TProps> = TProps extends {
  style?: StyleProp<infer Style>;
}
  ? Style
  : never;

export const componentFactory = <
  TProps extends BaseProps,
  TComponent extends ComponentType<TProps>
>(
  ComponentToEnhance: TComponent
) => {
  const ForwardedComponent = forwardRef<
    TComponent,
    TProps & { sx?: SxProp<StyleOf<TProps>> }
  >((props, ref) => {
    const { sx, style } = props;
    const sxStyle = useSxStyle(sx);

    // return <ComponentToEnhance {...props} ref={ref} style={[sxStyle, style]} />;
    return <></>;
  });

  ForwardedComponent.displayName = `Enhanced${ComponentToEnhance.displayName}`;
  return ForwardedComponent;
};
