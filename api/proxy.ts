// This file defines a Vercel Serverless Function that acts as a CORS proxy.
// It should be placed in the `api` directory at the root of your project.
// Vercel will automatically detect this and create a serverless endpoint.
// Example request from frontend: /api/proxy?url=https://example.com

// Note: In a real Typescript project with Vercel, you might install
// `@vercel/node` and use its types for more robust type checking.
// For this environment, we'll keep it simple and compatible.
// import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: any, res: any) {
  // Extract the target URL from the query parameters
  const url = req.query.url as string;

  if (!url) {
    res.status(400).send('Error: The "url" query parameter is missing.');
    return;
  }

  try {
    // Use the URL constructor to validate and parse the URL
    const targetUrl = new URL(url);

    // Fetch the content from the target URL
    const response = await fetch(targetUrl.toString(), {
      headers: {
        // It's good practice to mimic a real browser's User-Agent
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch from target: ${response.status} ${response.statusText}`);
    }

    const data = await response.text();

    // Set appropriate headers for the response to the client
    // Cache the response for 10 minutes on the server and 5 minutes in the browser
    res.setHeader('Cache-Control', 's-maxage=600, stale-while-revalidate=300');
    res.setHeader('Content-Type', response.headers.get('Content-Type') || 'text/html; charset=utf-8');
    
    // Send the fetched content back to the client
    res.status(200).send(data);
  } catch (error: any) {
    console.error('Proxy error:', error);
    res.status(500).send(`Error fetching the URL: ${error.message}`);
  }
}
