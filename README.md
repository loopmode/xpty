# @loopmode/pty

A react component and some helpers for building terminals in electron apps.  
Based on [`xterm`](https://www.npmjs.com/package/xterm) and [`node-pty`](https://www.npmjs.com/package/node-pty).

## Usage

There are two parts to this:

1. A child process that is managed by node-pty and
2. a view that is managed by xterm.

### Creating a child process

```ts
import { PtyManager, createCommand } from '@loopmode/xpty';
const command = createCommand({
  cmd: 'ls -lah',
  cwd: '~'
});
const ptyProcess = PtyManager.connect(command);
```

If you do not want to immediatly execute the command, pass `false` as second argument.

The returned object is an [`pty.IPty`](https://github.com/microsoft/node-pty/blob/master/typings/node-pty.d.ts#L108) instance.

### Rendering a view

Basically, you render the `XTerminal` component and pass a `ptyProcess` prop to it.

```tsx
import React from 'react';
import { XTerminal } from '@loopmode/xpty';

export const Example = ({ ptyProcess }) => {
  return (
    <XTerminal ptyProcess={ptyProcess}>
  )
}
```

### TODO

- hook, e.g. `usePty`, to get a `ptyProcess` easily
- docs for existing features and props
- more features and props
- tests
