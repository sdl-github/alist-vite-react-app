import { Type } from "./item_type"

export enum Group {
  SINGLE,
  SITE,
  STYLE,
  PREVIEW,
  GLOBAL,
  ARIA2,
  INDEX,
  SSO,
}
export enum Flag {
  PUBLIC,
  PRIVATE,
  READONLY,
  DEPRECATED,
}

export interface SettingItem {
  key: string
  value: string
  type: Type
  help: string
  options?: string
  group: Group
  flag: Flag
}
