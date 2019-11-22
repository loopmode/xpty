import shortid from 'shortid';
import { KeyValueItem } from './key-value-item';

export interface Command {
  id: string;
  name?: string;
  description?: string;

  cmd: string;
  cwd?: string;
  args: KeyValueItem[];
  env: KeyValueItem[];
}

export function createCommand(values: Partial<Command>): Command {
  return {
    ...values,
    id: values.id || shortid.generate(),
    args: values.args || [],
    env: values.env || []
  } as Command;
}
