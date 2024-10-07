<script lang="ts">
  import type { ImageWithMetadata } from '../types/web-image'
  import type { Image, ImageUrlBuilder } from 'sanity'

  import { onMount } from 'svelte'

  import { type Sizes, CANVAS_SIZE, SVG } from './types'
  import {
    breakpointUrl,
    fetchSvgSource,
    generateSizesString,
    getImageWithMetadata,
    isImageWithMetaData,
    renderBlurHash,
  } from './utils'

  interface Props {
    image?: Image | ImageWithMetadata
    imageUrlBuilder: ImageUrlBuilder
    sizes?: Sizes
    cropRatio?: number
    contain?: boolean
    align?: 'top' | 'center' | 'bottom'
    maxHeight?: string
    lazy?: boolean
  }

  let {
    image,
    imageUrlBuilder,
    sizes,
    cropRatio,
    contain = false,
    align = 'top',
    maxHeight,
    lazy = true,
  }: Props = $props()

  let canvas: HTMLCanvasElement | undefined = $state()
  let imageWithMetadata: ImageWithMetadata | undefined = $state(
    isImageWithMetaData(image) ? image : undefined,
  )

  // Default loaded to true and set to false on mount, just in case javascript is disabled.
  let loaded = $state(true)
  const onLoad = () => {
    loaded = true
  }

  $effect(() => {
    if (image && !isImageWithMetaData(image)) {
      getImageWithMetadata(image, imageUrlBuilder).then((image) => {
        imageWithMetadata = image
      })
    }
  })

  let {
    alt,
    metadata: {
      blurHash,
      breakpoints,
      dimensions: { aspectRatio, width, height } = {},
      extension,
    } = {},
  } = $derived<ImageWithMetadata | Record<string, undefined>>(imageWithMetadata ?? {})

  let urlBuilder = $derived(image && imageUrlBuilder.image(image))
  let src = $derived(urlBuilder?.url())
  let sizesString = $derived(generateSizesString(sizes))
  let croppedHeight = $derived(cropRatio && width ? Math.floor(width / cropRatio) : height)
  let svgSource = $derived(fetchSvgSource(src, extension))

  let srcset = $derived(
    breakpoints?.map((breakpoint) => breakpointUrl(urlBuilder, breakpoint, cropRatio)).join(', '),
  )

  let webpSrcset = $derived(
    breakpoints
      ?.map((breakpoint) => breakpointUrl(urlBuilder, breakpoint, cropRatio, 'webp'))
      .join(', '),
  )

  let imgAttributes = $derived({
    class: contain ? 'contain' : 'cover',
    decoding: 'async' as const,
    height: croppedHeight,
    loading: lazy ? ('lazy' as const) : undefined,
    sizes: sizesString,
    src,
    srcset,
    width: width,
  })

  onMount(() => {
    if (extension !== SVG) {
      loaded = false
      renderBlurHash(canvas, blurHash)
    }
  })
</script>

{#if image}
  <div class="image-wrapper" style="height: {maxHeight ?? '100%'};" style:--align={align}>
    {#if extension === SVG && svgSource}
      {#await svgSource then src}
        {@html src}
      {/await}
    {:else}
      <canvas
        bind:this={canvas}
        class:loaded
        width={CANVAS_SIZE}
        height={CANVAS_SIZE}
        style={contain ? `aspect-ratio: ${cropRatio || aspectRatio}` : 'height: 100%'}
      ></canvas>
      <picture>
        <source type="image/webp" srcset={webpSrcset} sizes={sizesString} />
        <img {alt} {...imgAttributes} onload={onLoad} class:loaded />
      </picture>
    {/if}
  </div>
{/if}

<style>
  .image-wrapper {
    position: relative;
    overflow: hidden;
  }

  canvas {
    position: absolute;
    width: 100%;
    height: 100%;
    z-index: -1;
    transition: opacity var(--image-fade-transition-speed, 0.2s) ease-in;

    &.loaded {
      opacity: 0;
    }
  }

  img {
    width: 100%;
    height: 100%;
    opacity: 0;
    transition: opacity var(--image-fade-transition-speed, 0.2s) ease-in;

    &.loaded {
      opacity: 1;
    }
  }

  .cover {
    object-fit: cover;
  }

  .contain {
    object-fit: contain;
    object-position: var(--align);
  }

  :global(svg) {
    height: 100%;
  }
</style>
