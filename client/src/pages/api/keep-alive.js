// api/cron/keep-alive.js
export const config = {
  runtime: "edge",
};

// This function will be called by Vercel Cron
export default async function handler(request) {
  try {
    // Replace with your Render.com backend URL
    const response = await fetch("https://espreading.onrender.com");

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.text();

    return new Response(
      JSON.stringify({
        status: "success",
        message: "Keep alive ping successful",
        timestamp: new Date().toISOString(),
        response: data,
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        status: "error",
        message: error.message,
        timestamp: new Date().toISOString(),
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}
