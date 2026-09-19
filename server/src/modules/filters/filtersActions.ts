import type { RequestHandler } from "express";
import filtersRepository from "./filtersRepository";
import type { ReferenceItem } from "./filtersRepository";

const browseCategories: RequestHandler<
  Record<string, never>,
  ReferenceItem[]
> = async (_req, res, next) => {
  try {
    const categories = await filtersRepository.readCategories();
    res.json(categories);
  } catch (err) {
    next(err);
  }
};

const browseDifficulties: RequestHandler<
  Record<string, never>,
  ReferenceItem[]
> = async (_req, res, next) => {
  try {
    const difficulties = await filtersRepository.readDifficulties();
    res.json(difficulties);
  } catch (err) {
    next(err);
  }
};

const browseEquipment: RequestHandler<
  Record<string, never>,
  ReferenceItem[]
> = async (_req, res, next) => {
  try {
    const equipment = await filtersRepository.readEquipment();
    res.json(equipment);
  } catch (err) {
    next(err);
  }
};

export default { browseCategories, browseDifficulties, browseEquipment };
