export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    
    // Default to index.html
    let path = url.pathname;
    if (path === '/') {
      path = '/index.html';
    }
    
    // Get file from R2 bucket
    const object = await env.WEBSITE_BUCKET.get(path);
    
    if (object === null) {
      return new Response('Not found', { status: 404 });
    }
    
    const headers = new Headers();
    object.writeHttpMetadata(headers);
    headers.set('etag', object.httpEtag);
    
    // Set correct content types
    if (path.endsWith('.css')) {
      headers.set('content-type', 'text/css');
    } else if (path.endsWith('.js')) {
      headers.set('content-type', 'application/javascript');
    } else if (path.endsWith('.html')) {
      headers.set('content-type', 'text/html');
    }
    
    return new Response(object.body, {
      headers,
    });
  },
};