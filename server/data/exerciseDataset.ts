import fs from "node:fs";
import path from "node:path";

type LocalizedLabel = {
  id: string;
  es: string;
  en: string;
  fr: string;
};

type CountedLocalizedLabel = LocalizedLabel & {
  count: number;
};

type Exercise = {
  slug: string;
  name: {
    es: string;
    en: string;
    fr: string;
  };
  group: LocalizedLabel;
  equipment: LocalizedLabel;
  primaryMuscles: LocalizedLabel[];
  secondaryMuscles: LocalizedLabel[];
  instructions: {
    es: string[];
    en: string[];
    fr: string[];
  };
  level: LocalizedLabel;
};

type ExerciseDataset = {
  groups: CountedLocalizedLabel[];
  muscles: LocalizedLabel[];
  equipment: CountedLocalizedLabel[];
  levels: CountedLocalizedLabel[];
  exercises: Exercise[];
};

const datasetPath = path.join(
  __dirname,
  "./exercise-api/v1/dataset.json",
);

const dataset = JSON.parse(
  fs.readFileSync(datasetPath, "utf8"),
) as ExerciseDataset;

export default dataset;
export type { ExerciseDataset, Exercise, LocalizedLabel };
