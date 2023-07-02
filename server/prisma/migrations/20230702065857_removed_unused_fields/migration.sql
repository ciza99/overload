/*
  Warnings:

  - You are about to drop the column `name` on the `SessionExercise` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ExerciseSet" ALTER COLUMN "weight" DROP NOT NULL,
ALTER COLUMN "reps" DROP NOT NULL;

-- AlterTable
ALTER TABLE "SessionExercise" DROP COLUMN "name";
