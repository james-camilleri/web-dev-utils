import { asyncDeepMap } from '../utils/deep-map'
import { isWebImage } from '../utils/type-guards'

interface SanityConfig {
  apiVersion: string
  dataset: string
  projectId: string
}

export async function prefetchImageMetadata(
  input: Record<string, any>,
  sanityConfig: SanityConfig,
  fetch: (input: RequestInfo, init?: RequestInit) => Promise<Response>,
) {
  const fetchMetadata = async (input: any) => {
    // Return block content as is to prevent unnecessary recursion.
    if (input._type === 'block') return input
    if (!isWebImage(input)) return

    const url = metadataUrl(input.asset._ref, sanityConfig)

    return fetch(url, { mode: 'cors' })
      .then((response) => response.json())
      .then((payload) => payload.result[0])
  }

  return asyncDeepMap(input, fetchMetadata)
}

function metadataUrl(id: string, config: SanityConfig) {
  const { apiVersion, dataset, projectId } = config
  const query = `*[_id == "${id}"]{ extension, ...metadata{ blurHash, breakpoints, dimensions }}`
  return `https://${projectId}.apicdn.sanity.io/v${apiVersion}/data/query/${dataset}?query=${query}`
}