import { RouterOutputs } from "@features/api/trpc";

export type TemplateGroupType =
  RouterOutputs["training"]["getTemplates"][number];
export type TemplateType = TemplateGroupType["templates"][number];
