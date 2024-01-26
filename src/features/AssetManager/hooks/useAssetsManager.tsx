import { useSignal } from "@preact/signals-react";
import Asset from "../components/Window/Asset";
const useAssetsManager = () => {
    const SPRITES = useSignal<HTMLImageElement[]>([]);
    const showSprites = () => {
        return SPRITES.value?.map((frame, index) => (
            <Asset 
                key={index} 
                src={frame.src}
                filename={"test"}
            />
        ))
    }
    const loadSprites = (files: FileList) => {
        for (let index = 0; index < files.length; index++) {
            const reader = new FileReader;
            const file = files[index];
            reader.readAsDataURL(file);
            reader.onload = (e) => {
                const img = new Image();
                img.src = e.target!.result as string;
                // TODO: better performance w/ linked list
                SPRITES.value = [...SPRITES.value, img];
            }
        }
    }
    return {
        showSprites,
        loadSprites
    }
}
export default useAssetsManager;