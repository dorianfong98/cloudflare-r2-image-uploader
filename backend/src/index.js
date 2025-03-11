export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const { method } = request;

    // CORS headers
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",  // Allow any origin (or specify your frontend URL here)
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",  // Allowed methods
      "Access-Control-Allow-Headers": "Content-Type",  // Allowed headers
    };

    // Handle OPTIONS (CORS Preflight Request)
    if (method === "OPTIONS") {
      return new Response(null, {
        headers: corsHeaders,  // Send the CORS headers for preflight requests
      });
    }

    // Handle image upload (POST /api/upload)
    if (method === 'POST' && url.pathname === '/api/upload') {
      console.log('Received upload request.');

      try {
        const formData = await request.formData();
        console.log('Form Data:', formData);

        const file = formData.get('file'); // Ensure this matches the form field name
        if (!file) {
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

      // Example: Fetch image from R2
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

    // If no matching route, return 404
    return new Response('❌ Not Found', { status: 404, headers: corsHeaders });
  },
};
