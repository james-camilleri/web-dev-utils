import { decode } from 'blurhash'
import { Image, ImageUrlBuilder } from 'sanity'

import { ImageWithMetadata } from '../types/web-image'

import { CANVAS_SIZE, SVG, Sizes } from './types'

export function isImageWithMetaData(
  image: Image | ImageWithMetadata | undefined,
): image is ImageWithMetadata {
  return !!image && image.metadata != null
}

function isRawSanityImage(image: Image | ImageWithMetadata): image is Image {
  return !image.metadata
}

async function fetchImageMetaData(image: Image, imageUrlBuilder: ImageUrlBuilder) {
  const { asset } = image
  const { dataset, projectId } = imageUrlBuilder.options

  if (!asset?._ref || !dataset || !projectId) {
    return
  }

  const query = `*[_id == "${asset?._ref}"]{ extension, ...metadata{ blurHash, breakpoints, dimensions }}[0]`
  const apiVersion = new Date().toISOString().split('T')[0] // Just use current API. We may regret this later.
  const url = `https://${projectId}.apicdn.sanity.io/v${apiVersion}/data/query/${dataset}?query=${query}`

  try {
    const payload = await fetch(url)
    const metadata = (await payload.json()).result as ImageWithMetadata['metadata']

    return metadata
  } catch (e) {
    console.error(e)
  }
}

export async function getImageWithMetadata(
  image: Image | ImageWithMetadata | undefined,
  imageUrlBuilder: ImageUrlBuilder,
) {
  if (!image) {
    return Promise.resolve(undefined)
  }

  return isRawSanityImage(image) ?
      { ...image, metadata: await fetchImageMetaData(image, imageUrlBuilder) } as ImageWithMetadata
    : Promise.resolve(image)
}

export function generateSizesString(sizes?: Sizes) {
  const FALLBACK_WIDTH = '100vw'

  if (sizes === undefined) return FALLBACK_WIDTH

  const queryList = Object.entries(sizes).map(([query, size]) => {
    const queryString = /\(.*\)/.test(query) ? query : `(min-width: ${query})`
    return `${queryString} ${size}`
  })

  queryList.push(FALLBACK_WIDTH)
  return queryList.join(', ')
}

export async function fetchSvgSource(src?: string, alt?: string, extension?: string) {
  if (!src || extension !== SVG) {
    return
  }

  try {
    const response = await fetch(src)
    if (!response.ok) {
      throw Error(response.statusText)
    }

    const source = await response.text()
    return alt ?
        source.replace(
          /(<.*?>)(.*)/,
          (_, openingTag, svgContent) => `${openingTag}<title>${alt}</title>${svgContent}`,
        )
      : source
  } catch (e) {
    console.error('Error retrieving SVG source', e)
  }
}

export function breakpointUrl(
  urlBuilder: ImageUrlBuilder | undefined,
  breakpoint: number,
  cropRatio?: number,
  format?: 'webp',
) {
  if (!urlBuilder) {
    return ''
  }

  let builder = urlBuilder.width(breakpoint)

  if (cropRatio) {
    builder = builder.height(Math.floor(breakpoint / cropRatio)).fit('min')
  }

  if (format) {
    builder = builder.format(format)
  }

  return `${builder.url()} ${breakpoint}w`
}

export function renderBlurHash(canvas?: HTMLCanvasElement, blurHash?: string) {
  if (!canvas || !blurHash) {
    return
  }

  const pixels = decode(blurHash, CANVAS_SIZE, CANVAS_SIZE)
  const ctx = canvas?.getContext('2d')

  if (!ctx) {
    return
  }

  const imageData = ctx.createImageData(CANVAS_SIZE, CANVAS_SIZE)
  imageData.data.set(pixels)
  ctx?.putImageData(imageData, 0, 0)
}
