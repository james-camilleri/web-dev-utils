import ResponsiveImage from './svelte/ResponsiveImage.svelte'

export { optimiseAllImages } from './back-end/optimise-all-images'
export { updateImageMetadata } from './back-end/update-image-metadata'
export { optimiseImage } from './back-end/optimise-image'

export { prefetchImageMetadata } from './front-end/prefetch-image-metadata'
export { WebImageSchema } from './sanity/schema'

export { ResponsiveImage, ResponsiveImage as default }

export type { ImageWithMetadata as WebImage } from './types/web-image'
