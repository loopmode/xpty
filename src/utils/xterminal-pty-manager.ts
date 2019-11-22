import { platform } from 'os';
import { EventEmitter } from 'events';

import { IDisposable } from 'xterm';
import * as pty from 'node-pty';
import kill from 'tree-kill';

import { toObject } from './key-value-converter';
import { createCommandString } from './create-command-string';
import { Command } from '../command';
 

interface PtyRecord {
  settings: PtyOptions;
  process: pty.IPty;
  _listener: IDisposable;
}

export interface PtyOptions {
  shell: string;
  cols: number;
  rows: number;
  cwd?: string;
  env?: { [key: string]: string };
}

export interface PtyEvent {
  processId: number;
  commandId: string;
}

export const defaults: Partial<PtyOptions> = {
  shell: platform() === 'win32' ? 'bash.exe' : '/bin/bash',
  cols: 120,
  rows: 80
};

export class PtyProcessManager extends EventEmitter {
  public static SPAWN = 'spawn';
  public static EXIT = 'exit';

  private records: {
    [commandId: string]: PtyRecord | null;
  } = {};

  public get(commandId: string): pty.IPty | null {
    const record = this.records[commandId];
    if (record) {
      return record.process;
    }
    return null;
  }
  private spawn(commandId: string, options: PtyOptions): PtyRecord {
    const settings = { ...defaults, ...options };
    const ptyProcess = pty.spawn(settings.shell, [], {
      cols: settings.cols,
      rows: settings.rows,
      env: settings.env,
      cwd: settings.cwd
    });

    const record: PtyRecord = {
      settings: settings,
      process: ptyProcess,
      _listener: ptyProcess.onExit(() => {
        record._listener.dispose();
        this.emit(PtyProcessManager.EXIT, {
          commandId,
          processId: ptyProcess.pid
        });
        this.records[commandId] = null;
      })
    };

    this.records[commandId] = record;

    this.emit(PtyProcessManager.SPAWN, {
      commandId,
      processId: ptyProcess.pid
    });

    return record;
  }

  kill(commandId: string) {
    const record = this.records[commandId];
    if (record) {
      const signal = platform() === 'win32' ? undefined : 'SIGKILL';
      kill(record.process.pid, signal);
    }
  }

  connect(command: Command, execute?: boolean): pty.IPty {
    console.log('connect');
    const settings = {
      ...defaults,
      env: {
        ...(process.env as { [key: string]: string }),
        ...toObject(command.env)
      },
      cwd: command.cwd
    } as PtyOptions;

    let record = this.records[command.id];
    if (!record) {
      record = this.spawn(command.id, settings);
      if (execute) {
        record.process.write(createCommandString(command));
        record.process.write('\n');
      }
    }

    return record.process;
  }
}
