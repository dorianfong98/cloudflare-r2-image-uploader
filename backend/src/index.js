export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const { method } = request;

    // Log the incoming request
    console.log('Incoming request method:', method);
    console.log('Request URL:', request.url);

    // Handle image upload (POST /api/upload)
    if (method === 'POST' && url.pathname === '/api/upload') {
      console.log('Received upload request.');

      try {
        const formData = await request.formData();
        console.log('Form Data:', formData);  // Log the incoming form data

        const file = formData.get('file'); // Make sure this matches the form field name
        if (!file) {
          return new Response('No file provided', { status: 400 });
        }
        console.log('File received:', file.name);

        //R2 upload logic

        const bucket = env.IMAGES;
        await bucket.put(file.name, file.stream());

        return new Response(
          JSON.stringify({
            message: 'Upload successful!',
            key: file.name,
            url: `/api/images/${file.name}`,
          }),
          {
            headers: { 'Content-Type': 'application/json' },
          }
        );
      } catch (error) {
        console.error('Error handling file upload:', error);
        return new Response('Something went wrong. Please try again.', { status: 500 });
      }
    }

    // Handle image fetch (GET /api/images/{key})
    if (method === 'GET' && url.pathname.startsWith('/api/images/')) {
      const key = url.pathname.split('/').pop();
      console.log('Fetching image with key:', key);

      // You can fetch from R2 here based on the `key`
      // Example:
      // const bucket = env.IMAGES;
      // const image = await bucket.get(key);
      // if (image) {
      //   return new Response(image.body, { headers: { 'Content-Type': 'image/jpeg' } });
      // }

      // For now, just returning a dummy image response
      return new Response('Image content here', {
        headers: { 'Content-Type': 'image/jpeg' },
      });
    }

    // If no matching route, return 404
    return new Response('❌ Not Found', { status: 404 });
  },
};
