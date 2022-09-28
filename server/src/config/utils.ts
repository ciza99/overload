import { ProcessValueProps } from "./config-types";

import { NodeEnvironment } from "types/environement";

export const processNumberFactory =
  (defaultValue: number) =>
  ({ key, value }: ProcessValueProps<string | undefined>) => {
    if (!value) {
      return defaultValue;
    }

    const parsed = parseInt(value);
    if (isNaN(parsed)) {
      throw new Error(`invalid value for variable ${key}`);
    }

    return parsed;
  };

export const processNodeEnvironment = ({
  value,
}: ProcessValueProps<string | undefined>): NodeEnvironment => {
  return value === "production"
    ? "production"
    : value === "test"
    ? "test"
    : "development";
};
