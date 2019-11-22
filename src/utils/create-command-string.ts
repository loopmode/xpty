import { Command } from '../command';

export function createCommandString(command: Command): string {
  const options = command.args.reduce((result: string[], { key, value }) => {
    const kv = `${key} ${value}`;
    return [...result, kv];
  }, []);
  const cmd = `${command.cmd} ${options.join(' ')}`;
  return cmd.replace(/\s\s/g, ' ');
}
