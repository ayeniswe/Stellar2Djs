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

type TextureObjects = {
    [key: string]: TextureObject
}

type Textures = {
    name: string;
    src: string;
    groups: {
        [key: string]: TextureObjects
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

type RevisionAction = "added" | "removed"

type RevisionRecord = Texture & {
    action: RevisionAction
}

export type {
    TextureAtlasMetadata,
    Texture,
    TextureSources,
    TextureObjects,
    Config,
    TexturesMapping,
    TextureObject,
    RevisionAction,
    RevisionRecord,
    Textures
}