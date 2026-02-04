export default {
  async fetch(request) {
    const url = new URL(request.url);

    let length = parseInt(url.searchParams.get('length')) || 16;
    const useUpper = url.searchParams.get('uppercase') !== 'false';
    const useLower = url.searchParams.get('lowercase') !== 'false';
    const useNumbers = url.searchParams.get('numbers') !== 'false';
    const useSymbols = url.searchParams.get('symbols') === 'true';

    if (length < 4) length = 4;
    if (length > 128) length = 128;

    const upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lower = 'abcdefghijklmnopqrstuvwxyz';
    const numbers = '0123456789';
    const symbols = '!@#$%^&*()-_=+[]{}|;:,.<>?';

    let charset = '';
    if (useUpper) charset += upper;
    if (useLower) charset += lower;
    if (useNumbers) charset += numbers;
    if (useSymbols) charset += symbols;

    if (!charset) {
      return new Response(JSON.stringify({ error: 'No character sets selected' }), { status: 400 });
    }

    const password = Array.from({ length }, () => charset[Math.floor(Math.random() * charset.length)]).join('');

    return new Response(JSON.stringify({ password }), {
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
