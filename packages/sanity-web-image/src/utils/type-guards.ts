import { SanityDocument } from '@sanity/client'

import { ImageWithMetadata } from '../types/web-image'

export function isWebImage(
  document: ImageWithMetadata | SanityDocument,
): document is ImageWithMetadata {
  return document?._type === 'webImage'
}
