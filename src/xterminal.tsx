import React from 'react';

import * as pty from 'node-pty';

import cx from 'classnames';

import { XTerminalPtyAdapter } from './utils/xterminal-pty-adapter';

interface XTerminalProps {
  className?: string;
  ptyProcess: pty.IPty | null;
  readOnly: boolean;
}

export const XTerminal: React.FC<XTerminalProps> = props => {
  const element = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!props.ptyProcess) {
      return () => null;
    }
    const adapter = new XTerminalPtyAdapter();
    adapter.setElement(element.current as HTMLElement);
    adapter.setProcess(props.ptyProcess, props.readOnly);
    return () => adapter.destroy();
  }, [props.ptyProcess]);

  const {
    current: handleWheel
  } = React.useRef((event: React.WheelEvent<HTMLDivElement>) =>
    event.stopPropagation()
  );

  return (
    <div className={cx('XTermView', props.className)} onWheel={handleWheel}>
      {!props.ptyProcess && (
        <div className="notification is-dark is-family-code is-small">
          Not started
        </div>
      )}
      <div ref={element} />
    </div>
  );
};
