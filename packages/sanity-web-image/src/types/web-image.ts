import { SanityImageAssetDocument, SanityReference } from '@sanity/client'

type SanityMetadata = SanityImageAssetDocument['metadata']
type BreakpointMetadata = {
  breakpoints: number[]
}

interface Metadata extends SanityMetadata, BreakpointMetadata {}

export interface OptimisedSanityImage extends SanityImageAssetDocument {
  metadata: Metadata
}

export interface ImageWithMetadata {
  alt?: string
  asset: SanityReference
  metadata: {
    blurHash: string
    breakpoints: number[]
    extension: string
    dimensions: SanityImageAssetDocument['metadata']['dimensions']
  }
}
