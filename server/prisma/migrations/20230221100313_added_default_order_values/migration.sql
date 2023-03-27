-- AlterTable
CREATE SEQUENCE "exerciseset_order_seq";
ALTER TABLE "ExerciseSet" ALTER COLUMN "order" SET DEFAULT nextval('exerciseset_order_seq');
ALTER SEQUENCE "exerciseset_order_seq" OWNED BY "ExerciseSet"."order";

-- AlterTable
CREATE SEQUENCE "template_order_seq";
ALTER TABLE "Template" ALTER COLUMN "order" SET DEFAULT nextval('template_order_seq');
ALTER SEQUENCE "template_order_seq" OWNED BY "Template"."order";

-- AlterTable
CREATE SEQUENCE "templategroup_order_seq";
ALTER TABLE "TemplateGroup" ALTER COLUMN "order" SET DEFAULT nextval('templategroup_order_seq');
ALTER SEQUENCE "templategroup_order_seq" OWNED BY "TemplateGroup"."order";

-- AlterTable
CREATE SEQUENCE "training_order_seq";
ALTER TABLE "Training" ALTER COLUMN "order" SET DEFAULT nextval('training_order_seq');
ALTER SEQUENCE "training_order_seq" OWNED BY "Training"."order";

-- AlterTable
CREATE SEQUENCE "trainingexercise_order_seq";
ALTER TABLE "TrainingExercise" ALTER COLUMN "order" SET DEFAULT nextval('trainingexercise_order_seq');
ALTER SEQUENCE "trainingexercise_order_seq" OWNED BY "TrainingExercise"."order";
