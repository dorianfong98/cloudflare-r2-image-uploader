export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const { method } = request;

    // CORS headers to allow frontend domain
    const corsHeaders = {
      "Access-Control-Allow-Origin": "https://cloudflare-r2-image-uploader.pages.dev",  // Allow frontend URL
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",  // Allow specific methods
      "Access-Control-Allow-Headers": "Content-Type",  // Allow specific headers
    };

    console.log(`Request received: ${method} ${url.pathname}`);  // Log the request method and URL

    // Handle OPTIONS preflight request (for CORS)
    if (method === "OPTIONS") {
      console.log("Handling OPTIONS request for CORS preflight");
      return new Response(null, { status: 200, headers: corsHeaders });
    }

    // Handle image upload (POST /api/upload)
    if (method === 'POST' && url.pathname === '/api/upload') {
      console.log('Handling POST request for /api/upload');

      try {
        const formData = await request.formData();
        console.log('Form Data:', formData);

        const file = formData.get('file'); // Ensure this matches the field name
        if (!file) {
          console.log('No file provided');
          return new Response('No file provided', { status: 400, headers: corsHeaders });
        }

        console.log('File received:', file.name);

        // R2 upload logic
        const bucket = env.IMAGES;
        await bucket.put(file.name, file.stream());

        return new Response(
          JSON.stringify({
            message: 'Upload successful!',
            key: file.name,
            url: `/api/images/${file.name}`,
          }),
          {
            headers: { 
              'Content-Type': 'application/json',
              ...corsHeaders,  // Include CORS headers in the response
            },
          }
        );
      } catch (error) {
        console.error('Error handling file upload:', error);
        return new Response('Something went wrong. Please try again.', { status: 500, headers: corsHeaders });
      }
    }

    // Handle image fetch (GET /api/images/{key})
    if (method === "GET" && url.pathname.startsWith('/api/images/')) {
      const key = url.pathname.split('/').pop();
      console.log('Fetching image with key:', key);

      const bucket = env.IMAGES;
      const image = await bucket.get(key);
      if (image) {
        return new Response(image.body, {
          headers: { 
            'Content-Type': 'image/jpeg',
            ...corsHeaders,  // Include CORS headers in the response
          },
        });
      }

      return new Response('Image not found', {
        status: 404,
        headers: corsHeaders,
      });
    }

    console.log('Route not found');
    return new Response('❌ Not Found', { status: 404, headers: corsHeaders });
  },
};
