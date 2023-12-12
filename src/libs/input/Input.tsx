/**
 * Event handler class for multiple types of events .
 */
class Input {

    static click(fn: Function, id?:string) {
        if (id) {
            document.getElementById(id)?.addEventListener("click", (event) => {
                fn(event);
            });
        } else {
            document.addEventListener("click", (event) => {
                fn(event);
            });
        }
        
    }

    static delete(fn: Function, id?:string) {
        if (id) {
            document.getElementById(id)?.addEventListener("keydown", (event) => {
                if (event.key === "Delete") {
                    fn();
                };
            });
        } else {
            document.addEventListener("keydown", (event) => {
                if (event.key === "Delete") {
                    fn();
                };
            });
        }
    }

}

export {
    Input
}