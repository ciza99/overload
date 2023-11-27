import { RouterOutputs } from "@features/api/trpc";

export type TemplateGroupType =
  RouterOutputs["training"]["getGroupedTemplates"][number];
export type TemplateType = RouterOutputs["training"]["getTemplate"];
