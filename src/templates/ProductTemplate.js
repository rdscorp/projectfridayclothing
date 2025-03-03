import React, { useEffect, useState } from "react";
import { graphql, useStaticQuery } from "gatsby";
import Header from "../components/header";
import { GatsbyImage, getImage } from "gatsby-plugin-image";

const ProductPage = ({ pageContext }) => {
  const { slug, title, price, compare_at_price, description, image, size, color } = pageContext.product;

  const [cart, setCart] = useState({});
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);

  // Load cart from localStorage after component mounts
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedCart = JSON.parse(localStorage.getItem("cart")) || {};
      setCart(storedCart);
    }
  }, []);

  // Save cart to localStorage when it changes
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("cart", JSON.stringify(cart));
    }
  }, [cart]);

  // Fetch all images
  const data = useStaticQuery(graphql`
    query AllProductImages {
      allFile(filter: { sourceInstanceName: { eq: "images" } }) {
        nodes {
          name
          childImageSharp {
            gatsbyImageData(width: 500)
          }
        }
      }
      site {
        siteMetadata {
          title
        }
      }
    }
  `);

  // Helper function to get image by filename (without extension)
  const getImageByName = (fileName) => {
    if (!fileName) return null;
    const cleanFileName = fileName.replace(/\.(jpg|jpeg|png)$/, "");
    const imageNode = data.allFile.nodes.find((node) => node.name === cleanFileName);
    return imageNode ? getImage(imageNode.childImageSharp) : null;
  };

  // Load Razorpay Magic Checkout
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/magic-checkout.js";
    script.async = true;
    script.onload = () => console.log("Razorpay script loaded successfully");
    script.onerror = () => console.error("Failed to load Razorpay script");
    document.body.appendChild(script);
    return () => document.body.removeChild(script);
  }, []);

  // Handle Add to Cart
  const handleAddToCart = () => {
    if (!selectedSize || !selectedColor) {
      alert("Please select both a size and a color.");
      return;
    }

    const variantKey = `${slug}.${selectedColor}.${selectedSize}`;
    const newCart = { ...cart, [variantKey]: { name: title, compare_at_price, qty: 1 } };

    setCart(newCart);
    alert("Item added to cart!");
  };

  // Handle Buy Now
  const handlePayment = async () => {
    try {
      const orderResponse = await fetch("https://b4878270-razorpay-order-worker.projectfridayclothing.workers.dev", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          "amount": compare_at_price * 100,
          "currency": "INR",
          "notes": {},
          "line_items_total": compare_at_price * 100,
          "line_items": [
            {
              "type": "e-commerce",
              "sku": slug,
              "variant_id": slug + "." + selectedColor + "." + selectedSize,
              "price": compare_at_price * 100,
              "offer_price": compare_at_price * 100,
              "tax_amount": 0,
              "quantity": 1,
              "name": "Meowtallica",
              "description": "Meowtallica - Tshirt",
              "weight": 1700,
              "dimensions": {
                "length": 1700,
                "width": 1700,
                "height": 1700
              },
              "image_url": "https://static.wixstatic.com/media/3cd432_19f118b4764444dc9046be1fecd5ed96~mv2.webp/v1/fill/w_1120,h_840,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/3cd432_19f118b4764444dc9046be1fecd5ed96~mv2.webp",
              "product_url": "https://static.wixstatic.com/media/3cd432_19f118b4764444dc9046be1fecd5ed96~mv2.webp/v1/fill/w_1120,h_840,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/3cd432_19f118b4764444dc9046be1fecd5ed96~mv2.webp",
              "notes": {}
            }
          ]
        }),
      });

      const orderData = await orderResponse.json();
      if (!orderData.id) throw new Error("Order creation failed");

      const options = {
        key: process.env.RZP_AUTH,
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

      const rzp1 = new window.Razorpay(options);
      rzp1.open();
    } catch (error) {
      console.error("Payment failed:", error);
      alert("Payment failed. Please try again.");
    }
  };

  return (
    <>
      <Header siteTitle={data.site.siteMetadata?.title || "Title"} />
      <div style={{ paddingTop: "150px", display: "flex" }}>
        <div style={{ display: "flex", flexDirection: "column", flexWrap: "wrap", width: "63.5vw", height: "87vh", alignItems: "flex-start", justifyContent: "center", paddingLeft: "1vw", flexShrink: 0 }}>
          {/* Main Product Image */}
          {image.length > 0 && <GatsbyImage image={getImageByName(image[0])} alt={title} className="prodMainImage" style={{ marginBottom: "var(--space-3)", width: "30vw" }} />}
          {image.slice(1, 2).map((imgSrc, index) => (
            <GatsbyImage key={index} image={getImageByName(imgSrc)} alt={`${title} - Image ${index + 1}`} className="prodSubImage" style={{ marginBottom: "var(--space-3)", width: "30vw" }} />
          ))}
          {/* Sub Images */}
          <div style={{ display: "flex", gap: "1vw", flexWrap: "wrap" }}>
            {image.slice(2).map((imgSrc, index) => (
              <GatsbyImage key={index} image={getImageByName(imgSrc)} alt={`${title} - Image ${index + 1}`} className="prodMainImage" style={{ marginBottom: "var(--space-3)", width: "14.5vw" }} />
            ))}
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", paddingLeft: "5vw", marginTop: "60px", position: "relative", width: "32vw" }}>
          <h1 style={{ color: "var(--color-primary)", fontFamily: "AdamCgPro", fontSize: "40px" }}>{title}</h1>
          <p style={{ fontSize: "34px", color: "var(--color-primary)" }}>
            <s style={{ color: "#ffffffaa" }}>₹{price}</s>&nbsp;&nbsp;₹{compare_at_price}
          </p>
          <div style={{ display: "flex", gap: "20px", width: "50%", justifyContent: "space-between" }}>
            {size.map((prodSize, index) => (
              selectedSize !== prodSize ?
                <button onClick={() => setSelectedSize(prodSize)} key={index} style={{ cursor: "pointer", border: "1px solid white", color: "#fff", backgroundColor: "#000", width: "50px", height: "30px", display: "flex", justifyContent: "center", alignItems: "center" }}>
                  {prodSize}
                </button> :
                <button onClick={() => setSelectedSize(prodSize)} key={index} style={{ cursor: "pointer", border: "1px solid white", color: "#000", backgroundColor: "#fff", width: "50px", height: "30px", display: "flex", justifyContent: "center", alignItems: "center" }}>
                  {prodSize}
                </button>
            ))}
          </div>
          <div style={{ display: "flex", gap: "20px", width: "50%", justifyContent: "space-between" }}>
            {color.map((prodColor, index) => (
              selectedColor !== prodColor ?
                <button onClick={() => setSelectedColor(prodColor)} key={index} style={{
                  cursor: "pointer", "flexShrink": 0, backgroundColor: "#000",
                  border: "1px solid white", color: "#fff", width: "auto", paddingLeft: "7.5px", paddingRight: "7.5px", height: "30px",
                  display: "flex", justifyContent: "space-around", alignItems: "center", gap: "5px", marginTop: "20px"
                }}>
                  <span style={{ "backgroundColor": `${prodColor}`, border: '1px solid white', width: "15px", height: "15px", borderRadius: "100px" }} />{prodColor}
                </button>
                :
                <button onClick={() => setSelectedColor(prodColor)} key={index} style={{
                  cursor: "pointer", "flexShrink": 0,
                  border: "1px solid white", color: "#000", "backgroundColor": "#fff", width: "auto", paddingLeft: "7.5px", paddingRight: "7.5px", height: "30px",
                  display: "flex", justifyContent: "space-around", alignItems: "center", gap: "5px", marginTop: "20px"
                }}>
                  <span style={{ "backgroundColor": `${prodColor}`, border: '1px solid black', width: "15px", height: "15px", borderRadius: "100px" }} />{prodColor}
                </button>
            ))}
          </div>
          <button style={{ background: "#056D63", width: "100%", height: "50px", outline: "none", border: "none", fontSize: "18px", color: "#fff", marginTop: "30px", cursor: "pointer" }} onClick={handlePayment}>
            BUY NOW
          </button>
          <button style={{ background: "#FFF", width: "100%", height: "50px", outline: "none", border: "none", fontSize: "18px", marginTop: "10px", cursor: "pointer" }} onClick={handleAddToCart}>
            ADD TO CART
          </button>
          <p style={{ marginTop: "30px" }}>{description}</p>
        </div>
      </div>

      {/* Footer */}
      <footer style={{ marginTop: `var(--space-5)`, fontSize: `var(--font-sm)`, marginBottom: '20px', paddingLeft: '5vw', paddingRight: '5vw' }}>
        <div className="footer-div">
          <div id="collection" style={{ paddingTop: '20px', justifyContent: 'space-between', display: 'flex', alignItems: 'flex-start' }}>
            <p className="logo-text" style={{ fontSize: `42px`, color: `var(--color-primary)` }}>PROJECT FRIDAY <sup>®</sup></p>
          </div>
          <div>
            <p className="ftt">BORING STUFF</p>
            <p className="fbt">
              <span>LEGAL NOTICE</span><br />
              <span>PRIVACY POLICY</span><br />
              <span>TERMS & CONDITIONS</span><br />
            </p>
          </div>
          <div>
            <p className="ftt">SUPPORT</p>
            <p className="fbt">
              <span>RETURNS</span><br />
              <span>ORDER TRACKING</span><br />
              <span>FAQ</span><br />
              <span>CONTACT</span><br />
            </p>
          </div>
          <div>
            <p className="ftt">JOIN THE PROJECT</p>
            <p className="fbt">SIGN UP TO OUR MAILING LIST AND GET 10% OFF YOUR FIRST ORDER</p>
            <div>
              <input className="eib" type="email" placeholder="Email Address" />
              <button className="esb">JOIN</button>
            </div>
          </div>
        </div>
        <span className="copyRightText">
          Copyright © {new Date().getFullYear()} Project Friday &middot; Powered By
          {` `}
          <a href="https://www.rajputanards.com/">Q Engine</a>
        </span>
      </footer>
    </>
  );
};

export default ProductPage;
