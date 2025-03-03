export default {
	async fetch(request, env) {
	  if (request.method === "OPTIONS") {
		// Handle preflight request (CORS)
		return new Response(null, {
		  status: 204,
		  headers: {
			"Access-Control-Allow-Origin": "*",
			"Access-Control-Allow-Methods": "POST, OPTIONS",
			"Access-Control-Allow-Headers": "Content-Type, Authorization",
		  },
		});
	  }
  
	  if (request.method !== "POST") {
		return new Response(JSON.stringify({ error: "Method Not Allowed" }), {
		  status: 405,
		  headers: { 
			"Content-Type": "application/json",
			"Access-Control-Allow-Origin": "*",
		  },
		});
	  }
  
	  try {
		// Read request body
		const reqBody = await request.json();
  
		// Razorpay credentials from environment variables
		const RAZORPAY_KEY_ID = env.RAZORPAY_KEY_ID;
		const RAZORPAY_SECRET = env.RAZORPAY_SECRET;
  
		// Razorpay API request
		const response = await fetch("https://api.razorpay.com/v1/orders", {
		  method: "POST",
		  headers: {
			"Content-Type": "application/json",
			"Authorization": `Basic ${btoa(`${RAZORPAY_KEY_ID}:${RAZORPAY_SECRET}`)}`,
		  },
		  body: JSON.stringify(reqBody),
		});
  
		const data = await response.json();
  
		return new Response(JSON.stringify(data), {
		  status: response.status,
		  headers: {
			"Content-Type": "application/json",
			"Access-Control-Allow-Origin": "*", // Allow all origins
			"Access-Control-Allow-Methods": "POST, OPTIONS",
			"Access-Control-Allow-Headers": "Content-Type, Authorization",
		  },
		});
  
	  } catch (error) {
		return new Response(JSON.stringify({ error: error.message }), {
		  status: 500,
		  headers: {
			"Content-Type": "application/json",
			"Access-Control-Allow-Origin": "*",
		  },
		});
	  }
	}
  };
  