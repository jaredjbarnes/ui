import type { Meta, StoryObj } from '@storybook/react';
import React, { useRef, useState } from 'react';
import { ElementTethered } from '../element_tethered.js';
import { Tethered } from '../tethered.js';
import type { Rectangle } from '../../../utils/types/dimensions.js';

const meta: Meta = {
  title: 'Overlay/Tethered Flicker',
  parameters: { layout: 'fullscreen' },
};

export default meta;
type Story = StoryObj;

/**
 * Records the tethered overlay's on-screen top/left on every animation frame
 * for a short window after it opens, then prints the frames. If the fix works,
 * the FIRST recorded frame is already at the anchored position (never 0,0).
 */
function FlickerProbe() {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);
  const [frames, setFrames] = useState<string[]>([]);

  const openAndRecord = () => {
    setFrames([]);
    setOpen(true);
    const recorded: string[] = [];
    let count = 0;
    const tick = () => {
      const el = document.querySelector('.j13b-tethered') as HTMLElement | null;
      if (el) {
        const r = el.getBoundingClientRect();
        recorded.push(`frame ${count}: top=${Math.round(r.top)} left=${Math.round(r.left)}`);
      } else {
        recorded.push(`frame ${count}: (not mounted)`);
      }
      count += 1;
      if (count < 8) {
        requestAnimationFrame(tick);
      } else {
        // eslint-disable-next-line no-console
        console.log('FLICKER_FRAMES\n' + recorded.join('\n'));
        setFrames(recorded);
      }
    };
    requestAnimationFrame(tick);
  };

  return (
    <div style={{ padding: 200 }}>
      <button ref={buttonRef} onClick={openAndRecord} data-testid="trigger">
        Open overlay
      </button>
      {open && (
        <ElementTethered
          anchorElement={buttonRef}
          verticalAnchor="bottom"
          verticalOrigin="top"
          verticalOffset={8}
        >
          <div
            style={{
              padding: 16,
              background: '#222',
              color: 'white',
              borderRadius: 8,
              width: 240,
            }}
          >
            Tethered content that must appear directly under the button, never
            flashing at the top-left corner.
          </div>
        </ElementTethered>
      )}
      <pre data-testid="frames" style={{ marginTop: 24, fontSize: 12 }}>
        {frames.join('\n')}
      </pre>
    </div>
  );
}

export const FirstOpenFlicker: Story = {
  render: () => <FlickerProbe />,
};

/** Bare <Tethered> with a static anchor rect — no ElementTethered wrapper. */
function BareProbe() {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [anchor, setAnchor] = useState<Rectangle | null>(null);

  const open = () => {
    const r = buttonRef.current!.getBoundingClientRect();
    setAnchor({
      position: { x: r.left, y: r.top },
      dimensions: { width: r.width, height: r.height },
    });
  };

  return (
    <div style={{ padding: 200 }}>
      <button ref={buttonRef} onClick={open} data-testid="trigger">
        Open bare overlay
      </button>
      <Tethered
        anchor={anchor}
        verticalAnchor="bottom"
        verticalOrigin="top"
        verticalOffset={8}
      >
        <div
          style={{
            padding: 16,
            background: '#630',
            color: 'white',
            borderRadius: 8,
            width: 240,
          }}
        >
          Bare tethered content — must appear under the button, never at 0,0.
        </div>
      </Tethered>
    </div>
  );
}

export const BareStaticAnchor: Story = {
  render: () => <BareProbe />,
};
