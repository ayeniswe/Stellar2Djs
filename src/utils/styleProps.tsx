const getLeft = (element: HTMLElement, isComputed = true) => {
    let value: string;
    if(isComputed){
        value = window.getComputedStyle(element).getPropertyValue("left");
    } else {
        value = element.style.left;
    }
    const toNumber = () => {
        return Number(value.replace("px",""));
    }
    return {
        value,
        toNumber
    };
}
const getHeight = (element: HTMLElement, isComputed = true) => {
    let height: string;
    if(isComputed){
        height = window.getComputedStyle(element).getPropertyValue("height");
    } else {
        height = element.style.width;
    }
    const toNumber = () => {
        return Number(height.replace("px",""));
    }
    return {
        height,
        toNumber
    };
}
const getWidth = (element: HTMLElement, isComputed = true) => {
    let width: string;
    if(isComputed){
        width = window.getComputedStyle(element).getPropertyValue("width");
    } else {
        width = element.style.width;
    }
    const toNumber = () => {
        return Number(width.replace("px",""));
    }
    return {
        width,
        toNumber
    };
}
const setLeft = (element: HTMLElement, value: any) => {
    element.style.left = `${value}px`
}
const setOpacity = (element: HTMLElement, value: number) => {
    element.style.opacity = `${value}`
}
export {
    getWidth,
    getHeight,
    getLeft,
    setLeft,
    setOpacity
}