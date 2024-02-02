type ButtonProps = {
    /*
     * The triggered action of the button
     */
    action: (...args: any) => void,
    /*
     * The label name of the button
     */
    label: string,
    /*
     * The optional image source of the button
     */
    imgSrc?: string
    /*
     * The type of button
     */
    type?: "file"
}
type ToggleIconProps = {
    /**
     * The name of the toggle icon.
     */
    name: string
    /**
     * The source URL of the icon image.
     */
     src: string
    /**
     * The function to be called when the icon is clicked.
     */
     fn: (...args: any) => void
    /**
     * The keyboard shortcuts to on/off the icon
     */
     keyShortcuts?: string
    /**
     * The tooltip for icon
     */
     title?: string
}
export type {
    ToggleIconProps,
    ButtonProps
} 