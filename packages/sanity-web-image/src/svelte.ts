import ResponsiveImage from './svelte/ResponsiveImage.svelte'

export { prefetchImageMetadata } from './front-end/prefetch-image-metadata.js'
export { ResponsiveImage, ResponsiveImage as default }

export type { ImageWithMetadata as WebImage, RawImage as RawWebImage } from './types/web-image.js'
