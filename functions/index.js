const functions = require("firebase-functions");
const fetch = require("node-fetch");
const btoa = require("btoa");

const RAZORPAY_KEY_ID = "rzp_live_mi2y3REwcXxBGN";  // Replace with your Razorpay Key ID
const RAZORPAY_SECRET = "5M6Uw7avSXaABiAaLn0NRJbm";  // Replace with your Razorpay Secret

exports.createOrder = functions.https.onRequest(async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).send("Method Not Allowed");
  }

  try {
    const response = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Basic ${btoa(`${RAZORPAY_KEY_ID}:${RAZORPAY_SECRET}`)}`
      },
      body: req.body
    });

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    console.error("Error creating Razorpay order:", error);
    res.status(500).send("Failed to create order");
  }
});
