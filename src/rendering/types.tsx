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
        [key: string]: TextureObject;
    };
}
  
type Config = {
    name: string;
    version: string;
    textures: {
      [key: string]: Textures;
    };
}

export type {
    TextureAtlasMetadata,
    Texture,
    TextureSources,
    Config,
    TexturesMapping,
}