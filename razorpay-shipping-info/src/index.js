export default {
	async fetch(request) {
	  if (request.method !== "POST") {
		return new Response(JSON.stringify({ error: "Method Not Allowed" }), {
		  status: 405,
		  headers: { "Content-Type": "application/json" },
		});
	  }
  
	  try {
		// Parse the incoming JSON request
		const requestBody = await request.json();
  
		// Extract relevant data
		const { addresses, order_id, razorpay_order_id, contact, email } = requestBody;
  
		// Define shipping methods
		const shippingMethods = [
		  {
			id: "1",
			description: "Free shipping",
			name: "Delivery within 5 days",
			serviceable: true,
			shipping_fee: 0, // Free for prepaid orders
			cod: false,
			cod_fee: 0
		  },
		  {
			id: "2",
			description: "Standard Delivery",
			name: "Delivered on the same day",
			serviceable: true,
			shipping_fee: 10000, // ₹100 for COD orders
			cod: true,
			cod_fee: 10000 // ₹100 COD fee
		  }
		];
  
		// Modify response based on payment method
		const responseAddresses = addresses.map((address) => ({
		  ...address,
		  shipping_methods: shippingMethods
		}));
  
		return new Response(
		  JSON.stringify({ addresses: responseAddresses }),
		  {
			status: 200,
			headers: { "Content-Type": "application/json" },
		  }
		);
	  } catch (error) {
		return new Response(
		  JSON.stringify({ error: "Invalid request format", details: error.message }),
		  { status: 400, headers: { "Content-Type": "application/json" } }
		);
	  }
	}
  };
  