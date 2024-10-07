import { SanityImageAssetDocument } from '@sanity/client'
import { Image, Reference } from 'sanity'

type SanityMetadata = SanityImageAssetDocument['metadata']
type BreakpointMetadata = {
  breakpoints: number[]
}

interface Metadata extends SanityMetadata, BreakpointMetadata {}

export interface OptimisedSanityImage extends SanityImageAssetDocument {
  metadata: Metadata
}

export interface ImageWithMetadata extends Image {
  alt?: string
  asset: Reference
  metadata: {
    blurHash: string
    breakpoints: number[]
    extension: string
    dimensions: SanityImageAssetDocument['metadata']['dimensions']
  }
}
