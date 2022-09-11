import { useMemo, useRef } from 'react';

import { useSetupAdobe } from 'src/hooks/useSetupAdobe/useSetupAdobe';
import { getCanvasSize } from 'src/utils/getCanvasSize';
import { hexToRgba } from 'src/utils/hexToRgba';

import { Props } from './AnimateCC.types';

export const AnimateCC = (props: Props) => {
  const {
    style: additionalStyles,
    animationName,
    composition,
    getAnimationObject,
    paused,
    ...rest
  } = props;

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { properties } = useSetupAdobe({
    ...props,
    canvasRef,
  });

  const color = useMemo(
    () =>
      properties
        ? hexToRgba(properties.color, properties.opacity)
        : 'transparent',
    [properties],
  );

  const { width: canvasWidth, height: canvasHeight } =
    getCanvasSize(properties);

  return (
    <div>
      <div
        style={{
          width: '100%',
          height: '100%',
          ...additionalStyles,
        }}
        {...rest}
      >
        <canvas
          ref={canvasRef}
          width={canvasWidth}
          height={canvasHeight}
          style={{
            display: 'block',
            width: '100%',
            backgroundColor: color,
          }}
        />
        <div
          style={{
            pointerEvents: 'none',
            overflow: 'hidden',
            width: `${properties?.width ?? 0}px`,
            height: `${properties?.height ?? 0}px`,
            position: 'absolute',
            left: '0px',
            top: '0px',
            display: 'block',
          }}
        />
      </div>
    </div>
  );
};
