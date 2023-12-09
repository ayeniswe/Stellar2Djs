import { TextureAtlasMetadata } from '../rendering/types';

class TextureAtlas {
    static PLAIN_WALL: TextureAtlasMetadata = {
        name: 'plain_wall',
        src: 'tiles',
        sx: 0,
        sy: 16,
        w: 32,
        h: 32
    }
}

export {
    TextureAtlas
}
