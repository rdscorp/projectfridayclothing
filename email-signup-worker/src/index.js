export default {
	async fetch(request) {
	  if (request.method !== "POST") {
		return new Response(JSON.stringify({ error: "Method Not Allowed" }), {
		  status: 405,
		  headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
		});
	  }
  
	  try {
		const { email } = await request.json();
		if (!email) {
		  return new Response(JSON.stringify({ error: "Email is required" }), {
			status: 400,
			headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
		  });
		}
  
		// Check Firestore for existing email
		const FIRESTORE_URL = `https://firestore.googleapis.com/v1/projects/projectfridayclothing/databases/(default)/documents/mailing_list/${email}`;
		const firestoreResponse = await fetch(FIRESTORE_URL);
		
		if (firestoreResponse.ok) {
		  return new Response(JSON.stringify({ message: "Email already subscribed" }), {
			status: 200,
			headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
		  });
		}
  
		// Add email to Firestore
		await fetch(`https://firestore.googleapis.com/v1/projects/projectfridayclothing/databases/(default)/documents/mailing_list`, {
		  method: "POST",
		  headers: { "Content-Type": "application/json" },
		  body: JSON.stringify({ fields: { email: { stringValue: email } } }),
		});
  
		// Send welcome email via EmailJS
		const EMAILJS_API_URL = "https://api.emailjs.com/api/v1.0/email/send";
		const EMAILJS_SERVICE_ID = "projectfridayclothing";
		const EMAILJS_TEMPLATE_ID = "template_9p614l9";
		const EMAILJS_USER_ID = "UioKeLVYp-SeBJcFT";
  
		const emailData = {
		  service_id: EMAILJS_SERVICE_ID,
		  template_id: EMAILJS_TEMPLATE_ID,
		  user_id: EMAILJS_USER_ID,
		  template_params: { "to_email": email },
		};
  
		const emailResponse = await fetch(EMAILJS_API_URL, {
		  method: "POST",
		  headers: { "Content-Type": "application/json" },
		  body: JSON.stringify(emailData),
		});

  
		if (!emailResponse.ok) {
		  return new Response(JSON.stringify({ error: "Failed to send email", resp:JSON.stringify(emailResponse) }), {
			status: 500,
			headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
		  });
		}
  
		return new Response(JSON.stringify({ success: "Email added and welcome email sent!" }), {
		  status: 200,
		  headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
		});
  
	  } catch (error) {
		return new Response(JSON.stringify({ error: error.message }), {
		  status: 500,
		  headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
		});
	  }
	}
  };
  