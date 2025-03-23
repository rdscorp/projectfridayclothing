import React, {useEffect, useState } from "react";
import Layout from "../components/layout";
import Seo from "../components/seo";
import { GatsbyImage, getImage } from "gatsby-plugin-image";
import { graphql, useStaticQuery } from "gatsby";
import { getCartItems} from "../utils/cartUtils";

function useRazorpayScript() {
    useEffect(() => {
      if (typeof window === "undefined") return;
  
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/magic-checkout.js";
      script.async = true;
      script.onload = () => console.log("Razorpay script loaded successfully");
      script.onerror = () => console.error("Failed to load Razorpay script");
      document.body.appendChild(script);
  
      return () => {
        if (document.body.contains(script)) {
          document.body.removeChild(script);
        }
      };
    }, []);
  }

const Cart = () => {
    const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    setCartItems(getCartItems());

    const updateCart = () => setCartItems(getCartItems());
    window.addEventListener("cartUpdated", updateCart);

    return () => window.removeEventListener("cartUpdated", updateCart);
  }, []);
    const [cart, setCart] = useState([]);

    // ✅ Fetch images at the component level
    const data = useStaticQuery(graphql`
      query ProductImagesQuery {
        allFile(filter: { sourceInstanceName: { eq: "images" } }) {
          nodes {
            name
            childImageSharp {
              gatsbyImageData(width: 500)
            }
          }
        }
      }
    `);

    useRazorpayScript();

    useEffect(() => {
        const cartData = localStorage.getItem("cart");
        if (cartData) {
            setCart(Object.entries(JSON.parse(cartData)));
        }
    }, [cartItems]);

    const removeFromCart = (key) => {
        const updatedCart = cart.filter(([cartKey]) => cartKey !== key);
        setCart(updatedCart);

        const newCartData = updatedCart.reduce((acc, [cartKey, item]) => {
            acc[cartKey] = item;
            return acc;
        }, {});

        localStorage.setItem("cart", JSON.stringify(newCartData));
        setCartItems(updatedCart.reduce((sum, [, item]) => sum + item.qty, 0));
    };

    const handleCheckout = async (cart) => {
        if (typeof window === "undefined") return;
    
        if (!cart.length) {
            alert("Your cart is empty!");
            return;
        }
    
        try {
            // Calculate total price
            const totalAmount = cart.reduce((sum, [, item]) => sum + item.qty * item.compare_at_price, 0);
    
            // Prepare line items
            const lineItems = cart.map(([key, item]) => ({
                "type": "e-commerce",
                "sku": item.slug.split(".")[0],
                "variant_id": `${item.slug}`,
                "price": item.compare_at_price * 100,
                "offer_price": item.compare_at_price * 100,
                "tax_amount": 0,
                "quantity": item.qty,
                "name": `${item.name} - ${item.slug.split(".")[1] || "Default"} - ${item.slug.split(".")[2] || "Default"}`,
                "description": `${item.name} - ${item.slug.split(".")[1] || "Default"} - ${item.slug.split(".")[2] || "Default"}`,
                "weight": item.weight || 0,
                "dimensions": item.dimensions || {},
                "image_url": item.imgURL || "",
                "product_url": item.prdURL || "",
                "notes": {}
            }));
    
            // Create Razorpay order
            const orderResponse = await fetch("https://b4878270-razorpay-order-worker.projectfridayclothing.workers.dev", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    "amount": totalAmount * 100,
                    "currency": "INR",
                    "notes": {},
                    "line_items_total": totalAmount * 100,
                    "line_items": lineItems
                }),
            });
    
            const orderData = await orderResponse.json();
            if (!orderData.id) throw new Error("Order creation failed");
    
            if (!window.Razorpay) {
                throw new Error("Razorpay not available");
            }
    
            // Razorpay options
            const options = {
                key: process.env.RZP_AUTH, // Use GATSBY_ prefix for client-side env vars
                order_id: orderData.id,
                one_click_checkout: true,
                name: "PROJECT FRIDAY",
                show_coupons: true,
                handler: function (response) {
                    alert("Payment successful!");
                    console.log(response);
                },
                modal: {
                    ondismiss: function () {
                        console.log("Checkout form closed");
                    },
                },
            };
    
            // Open Razorpay payment modal
            const rzp1 = new window.Razorpay(options);
            rzp1.open();
        } catch (error) {
            console.error("Payment failed:", error);
            alert("Payment failed. Please try again.");
        }
    };
    

    const getImageByName = (fileName) => {
        if (!fileName) return null;
        const cleanFileName = fileName.replace(/\.(jpg|jpeg|png)$/, "");
        const imageNode = data.allFile.nodes.find((node) => node.name === cleanFileName);
        return imageNode ? getImage(imageNode.childImageSharp) : null;
    };

    return (
        <Layout>
            <Seo title="Cart" />
            <div className="cart-container">
                <h1 className="maintextcart">Your Cart</h1>
                {cart.length === 0 ? (
                    <p style={{
                        color: "#fff",
                    }}>Your cart is empty.</p>
                ) : (
                    <div className="cart-items">
                        {cart.map(([key, item]) => (
                            <div className="cart-item" key={key}>
                                <GatsbyImage image={getImageByName(item.image)} alt={item.name} className="cart-item-image" />
                                <div className="cart-item-info">
                                    <a href={`/products/${item.slug.split('.')[0]}`} ><h2>{item.name}</h2></a>
                                    <p>{item.slug}</p>
                                    <p>Price: ₹{item.compare_at_price}</p>
                                    <p>Quantity: {item.qty}</p>
                                    <p>Total: ₹{item.qty * item.compare_at_price}</p>
                                </div>
                                <button className="rembutton" onClick={() => removeFromCart(key)}><span>Remove</span></button>
                            </div>
                        ))}
                    </div>
                )}
                {cart.length > 0 && (<>
                    <h1 style={{
                        marginTop: "30px",
                        color: "#fff",
                    }} className="maintextcartprice">Total = ₹{cart.reduce((sum, [, item]) => sum + item.qty * item.compare_at_price, 0)}</h1>
                    <button onClick={()=>handleCheckout(cart)} style={{ background: "#056D63", width: "100%", height: "50px", outline: "none", border: "none", fontSize: "18px", color: "#fff", marginTop: "30px", cursor: "pointer" }}>
                        CHECKOUT
                    </button>
                </>
                )}
            </div>
        </Layout>
    );
};

export default Cart;
