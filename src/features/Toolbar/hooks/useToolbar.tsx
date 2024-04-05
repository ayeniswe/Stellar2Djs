import { input } from './input';
import React from 'react';
import { useSignal } from '@preact/signals-react';

const useToolbar = () => {
  const tabContent = useSignal<React.JSX.Element>(<div/>);
  const tab = useSignal<HTMLElement | null>(null);
  const attrs = {
    get tabContent() {
      return tabContent.value;
    },
    set tabContent(value: React.JSX.Element) {
      tabContent.value = value;
    },
    get tab() {
      return tab.value;
    },
    set tab(value: HTMLElement | null) {
      tab.value = value;
    }
  };
  const toolbarInput = input(attrs);

  function openTab(element: HTMLElement, content: React.JSX.Element) {
    // Closes the tab if it's already open
    if (tabContent.value.type === content.type) {
            tab.value!.style.backgroundColor = '';
            tab.value = null;
            tabContent.value = <div/>;
    }
    else {
      if (tab.value) {
        tab.value.style.backgroundColor = '';
      }
      tab.value = element;
      tab.value.style.backgroundColor = 'var(--hover-color)';
      tabContent.value = content;
    }
  }

  function initialize() {
    toolbarInput.initialize();
  }

  return {
    attrs,
    openTab,
    initialize
  };
};

export { useToolbar };
