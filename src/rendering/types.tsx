type TextureAtlasMetadata = {
    name: string,
    src: string,
}

type Texture = TextureAtlasMetadata & {
    sx: number,
    sy: number,
    w: number,
    h: number
    dx: number,
    dy: number,
}


type TexturesMapping = {
    [key: string]: Texture
}

type TextureSources = {
    [key: string]: HTMLImageElement
}

type TextureObject = {
    name: string;
    sx: number;
    sy: number;
    w: number;
    h: number;
}
  
type Textures = {
    id: string;
    src: string;
    objects: {
        [key: string]: {
            [key: string]: TextureObject; // String will follow "1-1" format with first and second number respectively representing the texture id, and the object id
        }
    };
}
  
type Config = {
    name: string;
    version: string;
    textures: {
        [key: string]: {
            [key: string]: Textures; // String will follow a numbering format starting from 1..n
        };
    };
}

export type {
    TextureAtlasMetadata,
    Texture,
    TextureSources,
    Config,
    TexturesMapping,
    TextureObject,
}