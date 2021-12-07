import { HandlerEvent, HandlerResponse } from '@netlify/functions'
import { SanityClient } from '@sanity/client'

import { generateImageBreakpoints } from './generate-image-breakpoints'
import { optimiseSvg } from './optimise-svg'

const IMAGE_TYPE = 'sanity.imageAsset'
const SVG_EXTENSION = 'svg'

export async function optimiseImage(
  event: HandlerEvent,
  client: SanityClient,
  breakpointNotificationFunction: string
): Promise<HandlerResponse> {
  if (!event.body) return { statusCode: 400 }

  const payload = JSON.parse(event.body)
  const { _type, extension } = payload

  if (_type !== IMAGE_TYPE) return { statusCode: 415 }

  if (extension === SVG_EXTENSION) return optimiseSvg(payload, client)

  const notificationUrl = createNotificationUrl(event, breakpointNotificationFunction)
  return generateImageBreakpoints(payload, notificationUrl)
}

function createNotificationUrl(event: HandlerEvent, breakpointNotificationFunction: string) {
  const { rawUrl } = event

  const baseUrl = rawUrl.split('/').slice(0, -1).join('/')
  const notificationUrl = `${baseUrl}/${breakpointNotificationFunction}`

  return notificationUrl
}