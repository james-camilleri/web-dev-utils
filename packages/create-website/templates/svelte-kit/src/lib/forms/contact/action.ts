import type { RequestEvent } from '@sveltejs/kit'

import { fail, message, superValidate } from 'sveltekit-superforms'
import { zod } from 'sveltekit-superforms/adapters'

import {
  CONTACT_FORM_EMAIL_ADDRESS,
  MAILJET_API_KEY,
  MAILJET_SECRET_KEY,
} from '$env/static/private'

import { type ContactFormSubmission, contactFormSubmissionSchema } from './schema'

async function sendEmail(svelteFetch: typeof fetch, payload: ContactFormSubmission) {
  const { name, email, subject, message } = payload

  const token = btoa(`${MAILJET_API_KEY}:${MAILJET_SECRET_KEY}`)

  const response = await svelteFetch('https://api.mailjet.com/v3.1/send', {
    headers: {
      Authorization: `Basic ${token}`,
      'Content-Type': 'application/json',
    },
    method: 'POST',
    body: JSON.stringify({
      Messages: [
        {
          From: {
            Name: name,
            Email: CONTACT_FORM_EMAIL_ADDRESS,
          },
          To: [
            {
              Email: CONTACT_FORM_EMAIL_ADDRESS,
            },
          ],
          ReplyTo: {
            Email: email,
          },

          Subject: `Contact form submission${subject ? ': ' + subject : ''}`,
          TextPart: message,
        },
      ],
    }),
  })

  if (!response.ok) {
    console.log(await response.text())
    throw Error('Error emailing message.')
  }
}

export async function contactFormAction<Event extends RequestEvent>({ fetch, request }: Event) {
  const form = await superValidate(request, zod(contactFormSubmissionSchema))

  if (!form.valid) {
    return fail(400, { form })
  }

  try {
    await sendEmail(fetch, form.data)
  } catch (e) {
    console.error(e)
    return message(form, { valid: false }, { status: 500 })
  }

  return message(form, { valid: true })
}
