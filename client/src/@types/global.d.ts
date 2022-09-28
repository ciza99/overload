import { NavigationParamMap } from "src/modules/router/router-types";

declare global {
  namespace ReactNavigation {
    // eslint-disable-next-line @typescript-eslint/no-empty-interface
    interface RootParamList extends NavigationParamMap {}
  }
}
