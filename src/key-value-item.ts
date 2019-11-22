import shortid from 'shortid';

export interface KeyValueItem {
  id: string;
  key: string;
  value: string;
  type: KeyValueType;
}

export type KeyValueType = 'string' | 'text' | 'file' | 'folder';

export function createKeyValueItem({
  type = 'string',
  id = shortid.generate(),
  key,
  value,
}: Partial<KeyValueItem> = {}): KeyValueItem {
  return {
    id, key, value, type
  } as KeyValueItem
}
