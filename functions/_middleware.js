export async function onRequest(context) {
  const url = new URL(context.request.url);
  if (url.pathname === '/' && url.hostname === 'live.2ya.top') {
    return Response.redirect('https://live.2ya.top/live.html', 302);
  }
  return context.env.ASSETS.fetch(context.request);
}