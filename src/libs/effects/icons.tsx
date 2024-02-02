import '../../assets/style.css'
/**
 * Applies an effects to the UI.
 */
const iconEffects = () => {
    const onColor = 'green'
    const offColor = 'white'
    const applyTrashEffect = (button: HTMLElement, on: boolean = true) => {
        const [ svg ]: [SVGSVGElement, HTMLImageElement] = button.children as unknown as [SVGSVGElement, HTMLImageElement];
        const status = svg.lastChild as SVGCircleElement
        if (on) {
            status.style.fill = onColor;
            button.ariaLabel = 'trash mode on';
        } else {
            status.style.fill = offColor;
            button.ariaLabel = 'trash mode off';
        }
    }
    const applyDragEffect = (button: HTMLElement, on: boolean = true) => {
        const [ svg ]: [SVGSVGElement, HTMLImageElement] = button.children as unknown as [SVGSVGElement, HTMLImageElement];
        const status = svg.lastChild as SVGCircleElement
        if (on) {
            status.style.fill = onColor;
            button.ariaLabel = 'drag mode on';
        } else {
            status.style.fill = offColor;
            button.ariaLabel = 'drag mode off';
        }
    }
    const applyEditingEffect = (button: HTMLElement, on: boolean = true) => {
        const [ svg ]: [SVGSVGElement, HTMLImageElement] = button.children as unknown as [SVGSVGElement, HTMLImageElement];
        const status = svg.lastChild as SVGCircleElement
        if (on) {
            status.style.fill = onColor;
            button.ariaLabel = 'editing mode on';
        } else {
            status.style.fill = offColor;
            button.ariaLabel = 'editing mode off';
        }
    }
    const applyClippingEffect = (button: HTMLElement, on: boolean = true) => {
        const [ svg ]: [SVGSVGElement, HTMLImageElement] = button.children as unknown as [SVGSVGElement, HTMLImageElement];
        const status = svg.lastChild as SVGCircleElement
        if (on) {
            status.style.fill = onColor;
            button.ariaLabel = 'clipping mode on';
        } else {
            status.style.fill = offColor;
            button.ariaLabel = 'clipping mode off';
        }
    }
    return {
        applyTrashEffect,
        applyDragEffect,
        applyEditingEffect,
        applyClippingEffect,
    }
}
export {
    iconEffects
}