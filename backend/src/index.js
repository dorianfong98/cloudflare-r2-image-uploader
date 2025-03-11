export default {
    async fetch(request, env) {
      const { method } = request;
      const url = new URL(request.url);
  
      // Handle image upload (POST request)
      if (method === "POST" && url.pathname === "/api/upload") {
        return await handleUpload(request, env);
      }
  
      // Handle image retrieval (GET request)
      if (method === "GET" && url.pathname.startsWith("/api/images/")) {
        const key = url.pathname.split("/").pop(); // Extract image key from URL
        return await handleGet(key, env);
      }
  
      // Default 404 for other routes
      return new Response("Not Found", { status: 404 });
    },
  };
  
  // Function to handle image uploads
  async function handleUpload(request, env) {
    const contentType = request.headers.get("Content-Type");
    
    // Ensure only images are allowed
    if (!contentType || !contentType.startsWith("image/")) {
      return new Response("Only image uploads are allowed.", { status: 400 });
    }
  
    // Generate a unique filename/key for the image
    const key = crypto.randomUUID();
  
    // Store the image in R2
    await env.IMAGES.put(key, request.body, {
      httpMetadata: { contentType }
    });
  
    // Respond with image access URL
    return new Response(JSON.stringify({
      message: "Upload successful!",
      key: key,
      url: `/api/images/${key}`
    }), {
      status: 201,
      headers: { "Content-Type": "application/json" }
    });
  }
  
  // Function to handle image retrieval (fetching)
  async function handleGet(key, env) {
    const object = await env.IMAGES.get(key);
  
    if (!object) {
      return new Response("Image not found.", { status: 404 });
    }
  
    // Return the image with correct content-type
    return new Response(object.body, {
      headers: {
        "Content-Type": object.httpMetadata.contentType
      }
    });
  }
  