import { KeyValueItem } from "../key-value-item";

 

export function toObject(items: KeyValueItem[]): { [key: string]: string } {
  return items.reduce(
    (result, kv) => Object.assign(result, { [kv.key]: kv.value }),
    {}
  );
}
