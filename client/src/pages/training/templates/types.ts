import { RouterOutputs } from "@utils/trpc";

export type TemplateGroupType =
  RouterOutputs["training"]["getTemplates"][number];
export type TemplateType = TemplateGroupType["templates"][number];
