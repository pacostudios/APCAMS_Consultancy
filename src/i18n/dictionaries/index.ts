import type { Lang } from "../config";
import { en, type Dictionary } from "./en";
import { hi } from "./hi";
import { ml } from "./ml";

export type { Dictionary };

export const dictionaries: Record<Lang, Dictionary> = { en, ml, hi };
