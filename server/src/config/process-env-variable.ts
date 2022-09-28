import { ProcessEnvVariable } from "./config-types";

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
