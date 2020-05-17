// TODO: implement district typings. 

export type MapType = {
  readonly [key: string]: any;
}
export type ValueType =
  | string
  | number
  | boolean
  | null
  | readonly ValueType[]
  | MapType;

export type NodeType = MapType;
