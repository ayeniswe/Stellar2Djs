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
export type {
    ButtonProps
} 