addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Use POST method' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' }
    })
  }

  let body
  try {
    body = await request.json()
  } catch (e) {
    return new Response(JSON.stringify({ error: 'Invalid JSON' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    })
  }

  let length = parseInt(body.length) || 16
  const useUpper = body.uppercase !== false
  const useLower = body.lowercase !== false
  const useNumbers = body.numbers !== false
  const useSymbols = body.symbols === true

  if (length < 4) length = 4
  if (length > 128) length = 128

  const upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  const lower = 'abcdefghijklmnopqrstuvwxyz'
  const numbers = '0123456789'
  const symbols = '!@#$%^&*()-_=+[]{}|;:,.<>?'

  let charset = ''
  if (useUpper) charset += upper
  if (useLower) charset += lower
  if (useNumbers) charset += numbers
  if (useSymbols) charset += symbols

  if (!charset) {
    return new Response(JSON.stringify({ error: 'No character sets selected' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    })
  }

  const password = Array.from({ length }, () =>
    charset[Math.floor(Math.random() * charset.length)]
  ).join('')

  return new Response(JSON.stringify({ password }), {
    headers: { 'Content-Type': 'application/json' }
  })
}
