type TextureAtlasMetadata = {
    name: string,
    src: 'tiles' | 'player',
    sx: number,
    sy: number,
    w: number,
    h: number
}

type Texture = TextureAtlasMetadata & {
    dx: number,
    dy: number,
}

type TextureSources = {
    [key: string]: HTMLImageElement
}

export type {
    TextureAtlasMetadata,
    Texture,
    TextureSources
}