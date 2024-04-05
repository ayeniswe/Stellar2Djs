/* eslint-disable no-unused-vars */
import React from 'react';

type Toolbar = {
    /**
     * Open a tab in the toolbar
     *
     * NOTE - closes the previous tab when opening a new one
     */
    openTab: (element: HTMLElement, content: React.JSX.Element) => void
    /**
     * The attributes of the toolbar
     */
    attrs: ToolbarAttrs
    /**
     * Initialize the toolbar events
     */
    initialize: () => void
}

type ToolbarAttrs = {
    tabContent: React.JSX.Element
    tab: HTMLElement | null
}

type ToolbarInput = {
    /**
     * Initialize the toolbar events
     */
    initialize: () => void
}

export type {
  Toolbar,
  ToolbarInput,
  ToolbarAttrs
};
