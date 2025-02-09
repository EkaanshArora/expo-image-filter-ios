// import type { StyleProp, ViewStyle } from 'react-native';

// export type OnLoadEventPayload = {
//   url: string;
// };

export type ExpoImageFilterModuleEvents = {
  onChange: (params: ChangeEventPayload) => void;
};

export type ChangeEventPayload = {
  value: string;
};

export type DictVals = {
  type: "ciColor" | "string" | "number" | "boolean";
  stringValue: string;
};

/**
 * Color represented as a hex string
 * @example "#000000"
 * @example "#ffffff"
 * @example "#00000000"
 * @example "#ffffff00"
 */
export type HexColor = `#${string & { length: 8 | 6 }}`;