import { useSignal } from "@preact/signals-react";
import { useEffect } from "react";
import { input } from "./input";
const useToolbar = () => {
    const __tabContent = useSignal<JSX.Element>(<div/>);
    const __tab = useSignal<HTMLElement | null>(null);
    const attrs = {
        get tabContent() {
            return __tabContent.value
        },
        set tabContent(value: JSX.Element) {
            __tabContent.value = value
        },
        get tab() {
            return __tab.value
        },
        set tab(value: HTMLElement | null) {
            __tab.value = value
        }
    }
    const __input = input(attrs);
    const openTab = (element: HTMLElement , content: JSX.Element) => {
        if (__tab.value) {
            __tab.value.style.backgroundColor = "";
        }
        __tab.value = element;
        __tab.value.style.backgroundColor = "var(--hover-color)";
        __tabContent.value = content;
    }
    useEffect(() => {
        __input.initialize();
    },[])
    return {
        attrs,
        openTab
    }
}
export {
    useToolbar
}