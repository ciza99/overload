import { ProcessEnvVariable, ProcessValueProps } from "./config-types";

import { NodeEnvironment } from "types/environement";

export const processEnvVariable: ProcessEnvVariable = ({ key, ...props }) => {
  const value = process.env[key];
  if ("required" in props) {
    const { processValue } = props;

    if (!value) {
      throw new Error(`environment variable ${key} is required!`);
    }

    return processValue?.({ key, value }) ?? value;
  }

  if ("processValue" in props) {
    const { processValue } = props;
    return processValue({ key, value });
  }

  if ("defaultValue" in props) {
    const { defaultValue } = props;
    return value ?? defaultValue;
  }

  return value;
};

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
