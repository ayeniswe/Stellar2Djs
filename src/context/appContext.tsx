import React, { createContext, useContext } from 'react';
import { useControls, useSpriteAnimation, useTimeline } from '../features/AnimationPlayer/hooks';
import { AppContextProps } from './type';
import { useScene } from '../features/Scene/hooks';
import { useToolbar } from '../features/Toolbar/hooks';

const AppContext = createContext<AppContextProps | null>(null);

const AppContextProvider = ({ children }: { children: React.JSX.Element }) => {
  const spriteAnimation = useSpriteAnimation();
  const timeline = useTimeline(spriteAnimation);
  const timelineControls = useControls(timeline);
  const toolbar = useToolbar();
  const scene = useScene(null); // should be replaced when scene component is rendered
  return (
    <AppContext.Provider
      value={{
        timeline,
        timelineControls,
        spriteAnimation,
        scene,
        toolbar
      }}>
      {children}
    </AppContext.Provider>
  );
};

const useAppContext = () => {
  const ctx = useContext(AppContext);
  if (!ctx) {
    throw new Error('useAppContext must be used within an AppContextProvider');
  }
  return ctx;
};

export {
  AppContextProvider,
  AppContext,
  useAppContext
};
