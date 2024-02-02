type KMMapping = {
    [KM in KMInput]?: boolean
}
type BindingsMapping = {
    [key: string]: {
        fn: Function,
        id: string,
        type: Keyboard | Mouse
    }
}
enum MouseInputToName {
  "LeftButton" = 0,
  "MiddleButton" = 1,
  "RightButton" = 2
}
type KMInput =
  | "a"
  | "b"
  | "c"
  | "d"
  | "e"
  | "f"
  | "g"
  | "h"
  | "i"
  | "j"
  | "k"
  | "l"
  | "m"
  | "n"
  | "o"
  | "p"
  | "q"
  | "r"
  | "s"
  | "t"
  | "u"
  | "v"
  | "w"
  | "x"
  | "y"
  | "z"
  | "0"
  | "1"
  | "2"
  | "3"
  | "4"
  | "5"
  | "6"
  | "7"
  | "8"
  | "9"
  | "ArrowDown"
  | "ArrowLeft"
  | "ArrowRight"
  | "ArrowUp"
  | "Backspace"
  | "Tab"
  | "Enter"
  | "Shift"
  | "Control"
  | "Alt"
  | "CapsLock"
  | "Escape"
  | "Space"
  | "PageUp"
  | "PageDown"
  | "End"
  | "Home"
  | "Insert"
  | "Delete"
  | "F1"
  | "F2"
  | "F3"
  | "F4"
  | "F5"
  | "F6"
  | "F7"
  | "F8"
  | "F9"
  | "F10"
  | "F11"
  | "F12"
  | "Meta"
  | "!"
  | "@"
  | "#"
  | "$"
  | "%"
  | "^"
  | "&"
  | "*"
  | "("
  | ")"
  | "-"
  | "_"
  | "+"
  | "="
  | "`"
  | "~"
  | "["
  | "{"
  | "]"
  | "}"
  | "\\"
  | "|"
  | ";"
  | ":"
  | "'"
  | "\""
  | ","
  | "<"
  | "."
  | ">"
  | "/"
  | "?"
  | "LeftButton"
  | "MiddleButton"
  | "RightButton"

type Mouse =
  | "click"
  | "contextmenu"
  | "dblclick"
  | "mousedown"
  | "mouseenter"
  | "mouseleave"
  | "mousemove"
  | "mouseout"
  | "mouseover"
  | "mouseup"
  | "wheel"

type Keyboard =
  | "keydown"
  | "keyup"

export type {
    KMMapping,
    BindingsMapping,
    Mouse,

    KMInput,
    Keyboard
}
export {
  MouseInputToName,
}