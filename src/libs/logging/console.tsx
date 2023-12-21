import { MESSAGE } from "./enums";

const warn = (msg: MESSAGE, ...args: any) => {
    args = args ? " " + args : "";
    console.warn(msg + args);
}
const error = (msg: MESSAGE, ...args: any) => {
    args = args ? " " + args : "";
    console.error(msg + args);
}
const log = (msg: MESSAGE, ...args: any) => {
    args = args ? " " + args : "";
    console.log(msg + args);
}

export {
    warn,
    error,
    log
}