import { getHeight, getWidth } from '../../utils/styleProps';
import React, { useEffect, useRef } from 'react';
import Canvas from './components/Canvas';
import { SCENE } from './constants';
import { selection } from './signals';
import { useAppContext } from '../../context/appContext';
import { useScene } from './hooks';
import { useSignal } from '@preact/signals-react';

const Scene = () => {
  const ctx = useSignal<CanvasRenderingContext2D | null>(null);
  const ref = useRef<HTMLCanvasElement>(null);
  const app = useAppContext();
  app.scene = useScene(ctx.value!);

  // link canvas to scene
  useEffect(() => {
    if (ref.current) {
      // set scene size
      ref.current.width = getWidth(ref.current).toNumber();
      ref.current.height = getHeight(ref.current).toNumber();
      ctx.value = ref.current.getContext('2d');
      // initialize scene
      app.scene.initialize();
    }
  }, [ctx.value]);

  return (
    <>
      <Canvas reference={ref}/>
    </>
  );
};

export default Scene;
export {
  SCENE,
  selection
};
