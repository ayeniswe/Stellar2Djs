type Toolbar = {
    openTab: (element: HTMLElement, content: JSX.Element) => void
    attrs: ToolbarAttrs
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