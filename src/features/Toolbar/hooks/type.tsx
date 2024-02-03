type Toolbar = {
    /**
     * Open a tab in the toolbar
     * 
     * NOTE - closes the previous tab when opening a new one
     */
    openTab: (element: HTMLElement, content: JSX.Element) => void
    /**
     * The atributes of the toolbar
     */
    attrs: ToolbarAttrs
    /**
     * Initialize the toolbar events
     */
    initialize: () => void
}
type ToolbarAttrs = {
    tabContent: JSX.Element
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
}