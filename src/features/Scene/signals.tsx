import { signal } from '@preact/signals-react';
import { TextureObject } from '../../libs/object/TextureObject';

/**
 * The object currently selected within the scene
 */
const selection = signal<TextureObject | undefined>(undefined);

export { selection };
