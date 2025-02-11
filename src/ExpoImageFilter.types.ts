import type { SharedRef } from 'expo-modules-core/types';

export type ExpoImageFilterModuleEvents = {
  onChange: (params: ChangeEventPayload) => void;
};

export type ChangeEventPayload = {
  value: string;
};

export type DictVals = {
  type: "ciColor" | "string" | "number" | "boolean" | "cgPoint";
  stringValue: string;
};

export type HexColorWithoutAlpha = `#${Lowercase<string>}`;
export type HexColorWithAlpha = `#${Lowercase<string>}`;

export type HexColor = HexColorWithoutAlpha | HexColorWithAlpha;
export type CGPoint = {
  x: number;
  y: number;
};

export type FilterPropertyPossibleValues = string | number | boolean | HexColor | SharedRef<'image'> | SharedRef<'UIImageInput'> | CGPoint;
export type FilterPropertyValue<T extends string> =
  T extends "inputColor" ? HexColor :
  T extends "inputImage" ? SharedRef<'image'> | SharedRef<'UIImageInput'> :
  FilterPropertyPossibleValues
