import { useSignal } from "@preact/signals-react";
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
        // Closes the tab if it's already open
        if (__tabContent.value.type === content.type) {
            __tab.value!.style.backgroundColor = "";
            __tab.value = null;
            __tabContent.value = <div/>;
        } else {
            if (__tab.value) {
                __tab.value.style.backgroundColor = "";
            }
            __tab.value = element;
            __tab.value.style.backgroundColor = "var(--hover-color)";
            __tabContent.value = content;
        }
    }
    const initialize = () => {
        __input.initialize();
    }
    return {
        attrs,
        openTab,
        initialize
    }
}
export {
    useToolbar
}