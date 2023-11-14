/// <reference types="nativewind/types" />

import { NavigationParamMap } from "@features/core/components/router";

declare global {
  namespace ReactNavigation {
    // eslint-disable-next-line @typescript-eslint/no-empty-interface
    interface RootParamList extends NavigationParamMap {}
  }
}
