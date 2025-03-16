import React, { useEffect, useState } from "react";
import { graphql } from "gatsby";
import Header from "../components/header";
import { GatsbyImage, getImage, StaticImage } from "gatsby-plugin-image";
import { addToCart } from "../utils/cartUtils";
import { Link } from "gatsby";
// Custom hook for Razorpay script loading
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

const ProductPage = ({ data, pageContext }) => {
  const { slug, title, price, compare_at_price, description, image, size, color, weight, dimensions, imgURL } = pageContext.product;

  const [cart, setCart] = useState({});
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [showSizeChart, setShowSizeChart] = useState(false);
  const [AddedToCart, setAddedToCart] = useState(false);
  // Load Razorpay script
  useRazorpayScript();

  // Load cart from localStorage after component mounts
  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      const storedCart = JSON.parse(localStorage.getItem("cart")) || {};
      setCart(storedCart);
    } catch (error) {
      console.error("Failed to parse cart from localStorage:", error);
      setCart({});
    }
  }, []);

  // Save cart to localStorage when it changes
  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      localStorage.setItem("cart", JSON.stringify(cart));
    } catch (error) {
      console.error("Failed to save cart to localStorage:", error);
    }
  }, [cart]);

  // Helper function to get image by filename (without extension)
  const getImageByName = (fileName) => {
    if (!fileName) return null;
    const cleanFileName = fileName.replace(/\.(jpg|jpeg|png)$/, "");
    const imageNode = data.allFile.nodes.find((node) => node.name === cleanFileName);
    return imageNode ? getImage(imageNode.childImageSharp) : null;
  };

  // Handle Add to Cart
  useEffect(() => {
    const handleStorageChange = () => {
      const savedCart = JSON.parse(localStorage.getItem("cart")) || {};
      setCart(savedCart);
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const handleAddToCart = () => {
    if (!selectedSize || !selectedColor) {
      alert("Please select both a size and a color.");
      return;
    }
    const variantKey = `${slug}.${selectedColor}.${selectedSize}`;
    addToCart({
      name: title,
      slug: slug + "." + selectedColor + "." + selectedSize,
      id: slug + "." + selectedColor + "." + selectedSize,
      price: price,
      image: image[0],
      compare_at_price: compare_at_price,
      qty: (cart[variantKey]?.qty || 0) + 1,
      weight: weight,
      dimensions: dimensions,
      imgURL: imgURL,
      prdURL: "https://projectfriday.in/products/" + slug,
    });
    setAddedToCart(true);
  };


  // Handle Buy Now
  const handlePayment = async () => {
    if (typeof window === "undefined") return;

    if (!selectedSize || !selectedColor) {
      alert("Please select both a size and a color.");
      return;
    }

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
              "name": `${title} - ${selectedColor} - ${selectedSize}`,
              "description": `${title} - ${selectedColor} - ${selectedSize}`,
              "weight": weight,
              "dimensions": dimensions,
              "image_url": imgURL,
              "product_url": "https://projectfriday.in/products/" + slug,
              "notes": {}
            }
          ]
        }),
      });

      const orderData = await orderResponse.json();
      if (!orderData.id) throw new Error("Order creation failed");

      if (!window.Razorpay) {
        throw new Error("Razorpay not available");
      }

      const options = {
        key: process.env.GATSBY_RZP_AUTH, // Use GATSBY_ prefix for client-side env vars
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
      {showSizeChart ?
        <div style={{
          width: '100%',
          height: '100%',
          position: 'fixed',
          zIndex: '100',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#000000aa'
        }}>
          <div style={{
            display: "flex", gap: "20px", width: "500px", flexDirection: 'column',
            backdropFilter: 'blur(1rem)', backgroundColor: '#056D63', borderRadius: '10px',
            border: '4px white solid',
            alignSelf: 'center',
            justifySelf: 'center'
          }}>
            <p style={{
              color: 'white', fontSize: '24px', textAlign: 'center', marginTop: '20px', marginBottom: '0px',
              fontFamily: 'AdamCgPro'
            }}>Size Chart</p>
            <GatsbyImage image={getImageByName('pfc-sizechart.png')} style={{ width: '100%', height: 'auto' }} />
            <button onClick={() => { setShowSizeChart(false) }} style={{
              background: 'transparent', marginBottom: '15px', textDecoration: 'underline', color: 'white', border: 'none', outline: 'none', cursor: 'pointer'
            }}>Close</button>
          </div>
        </div> : null}
      {AddedToCart ?
        <div style={{
          width: '100%',
          height: '100%',
          position: 'fixed',
          zIndex: '100',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#000000aa'
        }}>
          <div style={{
            display: "flex", gap: "20px", width: "500px", flexDirection: 'column',
            backdropFilter: 'blur(1rem)', backgroundColor: '#056D63', borderRadius: '10px',
            border: '4px white solid',
            alignSelf: 'center',
            justifySelf: 'center'
          }}>
            <p style={{
              color: 'white', fontSize: '24px', textAlign: 'center', marginTop: '20px', marginBottom: '0px',
              fontFamily: 'AdamCgPro'
            }}>Item added to the cart</p>
            <div style={{
              display: 'flex'
            }}>
              <GatsbyImage image={getImageByName(image[0])} style={{
                marginTop: "var(--space-3)",
                marginBottom: "var(--space-3)", aspectRatio: '9/11', width: '250px'
              }} />
              <GatsbyImage image={getImageByName(image[1])} style={{
                marginTop: "var(--space-3)",
                marginBottom: "var(--space-3)", aspectRatio: '9/11', width: '250px'
              }} />
            </div>
            <Link to="/cart" style={{
              background: 'black', marginBottom: '15px', textDecoration: 'none', color: 'white', border: 'none', outline: 'none', cursor: 'pointer',
              height: '50px', fontFamily: 'AdamCgPro', fontSize: '20px',
              display: 'flex', justifyContent: 'center', alignItems: 'center'
            }}>GO TO CART</Link>
            <button onClick={() => { setAddedToCart(false) }} style={{
              background: 'transparent', marginBottom: '15px', textDecoration: 'underline', color: 'white', border: 'none', outline: 'none', cursor: 'pointer'
            }}>Close</button>
          </div>
        </div> : null}
      <Header siteTitle={data.site.siteMetadata?.title || "Title"} />
      <div
        className="prodCont">
        <div
          className="prodImgs">
          {/* Main Product Image */}
          {image.length > 0 && <GatsbyImage image={getImageByName(image[0])} alt={title} className="prodMainImage" style={{ marginBottom: "var(--space-3)" }} />}
          {image.slice(1, 2).map((imgSrc, index) => (
            <GatsbyImage key={index} image={getImageByName(imgSrc)} alt={`${title} - Image ${index + 1}`} className="prodSubImage" style={{ marginBottom: "var(--space-3)" }} />
          ))}
          {image.slice(2).map((imgSrc, index) => (
            <GatsbyImage key={index} image={getImageByName(imgSrc)} alt={`${title} - Image ${index + 1}`} className="prodSubImage1" style={{ marginBottom: "var(--space-3)", display: "none" }} />
          ))}
          {/* Sub Images */}
          <div className="prodImgsSub">
            {image.slice(2).map((imgSrc, index) => (
              <GatsbyImage key={index} image={getImageByName(imgSrc)} alt={`${title} - Image ${index + 1}`} className="prodMainImage1" style={{ marginBottom: "var(--space-3)" }} />
            ))}
          </div>
        </div>
        <div
          className="prodDets">
          <h1 style={{ color: "var(--color-primary)", fontFamily: "AdamCgPro", fontSize: "25px", marginBottom: '15px' }}>{title}</h1>
          <span style={{
            display: "flex", gap: "5px", alignItems: "center", color: "gray", fontSize: "20px", marginBottom: '15px'
          }}>
            <span style={{ color: 'gray' }} className="material-icons">star</span>
            <span className="material-icons">star</span>
            <span className="material-icons">star</span>
            <span className="material-icons">star</span>
            <span className="material-icons">star</span>
            <p style={{
              fontSize: '13px'
            }}>(0) reviews</p>
          </span>
          <p style={{ fontSize: "22px", color: "var(--color-primary)" }}>
            <s style={{ color: "#ffffffaa" }}>₹{price}</s>&nbsp;&nbsp;<span style={{
              color: "#FF4E4E", fontWeight: 'bold'
            }}>₹{compare_at_price}&nbsp;&nbsp;&nbsp;<sup><sup><span style={{
              color: "white", background: '#29BF4C', borderRadius: '100px', fontSize: '13px',
              padding: '2px 10px', fontWeight: 'normal'
            }}>SAVE ₹{price - compare_at_price}</span></sup></sup></span>
          </p>
          <span style={{
            display: "flex", gap: "5px", alignItems: "center", color: "gray", fontSize: "20px",
            marginBottom: '15px'
          }}>
            <span style={{
              color: '#FFB829',
              fontSize: '10px',
              lineHeight: '10px',
            }} className="material-icons">circle</span>
            <span style={{
              fontSize: '15px',
              color: '#FFB829'
            }}>Only few items left.</span>
          </span>
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
          <button onClick={() => { setShowSizeChart(true) }} style={{
            background: 'transparent', textDecoration: 'underline', color: 'white', border: 'none', outline: 'none', cursor: 'pointer',
            width: 'fit-content', height: '30px', borderRadius: '5px', fontWeight: 'bold',
            marginTop: '10px',
          }}>Show Size Chart</button>
          <button style={{ background: "#056D63", width: "100%", height: "50px", outline: "none", border: "none", fontSize: "18px", color: "#fff", marginTop: "30px", cursor: "pointer" }} onClick={handlePayment}>
            BUY NOW
          </button>
          <button style={{ background: "#FFF", width: "100%", height: "50px", outline: "none", border: "none", fontSize: "18px", marginTop: "10px", cursor: "pointer" }} onClick={handleAddToCart}>
            ADD TO CART
          </button>
          <div style={{
            height: 'auto', display: 'flex', alignItems: 'center', marginTop: '20px',
            gap: '10px'
          }}>
            <StaticImage style={{
              width: '60px', height: 'auto'
            }} src="../images/upi-icon.svg" alt="Logo" />
            <StaticImage style={{
              width: '60px', height: 'auto'
            }} src="../images/amex-svgrepo-com.svg" alt="Logo" />
            <StaticImage style={{
              width: '60px', height: 'auto'
            }} src="../images/google-pay-svgrepo-com.svg" alt="Logo" />
            <StaticImage style={{
              width: '60px', height: 'auto'
            }} src="../images/jcb-svgrepo-com.svg" alt="Logo" />
            <StaticImage style={{
              width: '60px', height: 'auto'
            }} src="../images/mastercard-full-svgrepo-com.svg" alt="Logo" />
            <StaticImage style={{
              width: '60px', height: 'auto'
            }} src="../images/visa-classic-svgrepo-com.svg" alt="Logo" />
            <StaticImage style={{
              width: '100px', height: '30px'
            }} src="../images/cod.svg" alt="Logo" />
          </div>
          <GatsbyImage image={getImageByName('pfas1.png')} style={{ marginTop: "var(--space-3)", marginBottom: "var(--space-3)" }} />
          <p style={{
            fontSize: '11px', color: 'white', fontFamily: 'AdamCgPro'
          }}>Experience the perfect combination of style and comfort with <strong>Project Friday</strong>'s premium oversized T-shirts. Designed for a relaxed yet stylish look, our T-shirts are crafted from high-quality 240gsm fabric, ensuring durability and a soft feel.</p>

          <ul style={{
            fontSize: '11px', color: 'white', fontFamily: 'AdamCgPro'
          }}>
            <li><strong>Oversized Fit</strong> – A relaxed and trendy silhouette for all-day comfort.</li>
            <li><strong>Premium 240gsm Fabric</strong> – Thick, high-quality cotton for a soft and structured feel.</li>
            <li><strong>Wrinkle-Free</strong> – Keeps its fresh look with minimal effort.</li>
            <li><strong>Versatile Style</strong> – Perfect for casual, streetwear, or layered outfits.</li>
            <li><strong>Long-Lasting Durability</strong> – Made to withstand everyday wear.</li>
            <li><strong>Odor-Resistant</strong> – Breathable fabric helps keep you fresh throughout the day.</li>
          </ul>

          <p style={{
            fontSize: '11px', color: 'white', fontFamily: 'AdamCgPro'
          }}>The model is 185cm (6ft1) and is wearing a size Medium for an oversized fit.</p>

          <p style={{
            fontSize: '11px', color: 'white', fontFamily: 'AdamCgPro'
          }}><strong>Shipping Information:</strong> Orders to <strong>North India</strong> are delivered within <strong>1-2 days</strong>, while orders to <strong>East and South India</strong> take <strong>3-4 days</strong>.</p>

        </div>
      </div>
      {/* Footer */}
      <footer style={{ marginTop: `var(--space-5)`, fontSize: `var(--font-sm)`, marginBottom: '20px', paddingLeft: '5vw', paddingRight: '5vw' }}>
        <div className="footer-div">
          <div id="collection" style={{ paddingTop: '20px', justifyContent: 'space-between', display: 'flex', alignItems: 'flex-start' }}>
            <a href="/" className="logo-text-bottom" style={{ textDecoration: "none", color: `var(--color-primary)` }}>PROJECT FRIDAY <sup>®</sup></a>
          </div>
          <div>
            <p className="ftt">BORING STUFF</p>
            <p className="fbt">
              <a href="/privacy">LEGAL NOTICE</a><br />
              <a href="/privacy">PRIVACY POLICY</a><br />
              <a href="/terms">TERMS & CONDITIONS</a><br />
            </p>
          </div>
          <div>
            <p className="ftt">SUPPORT</p>
            <p className="fbt">
              <a>RETURNS</a><br />
              <a>ORDER TRACKING</a><br />
              <a>FAQ</a><br />
              <a>CONTACT</a><br />
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

// Replace useStaticQuery with page query
export const query = graphql`
  query ProductPageQuery {
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
`;