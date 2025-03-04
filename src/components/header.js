import * as React from "react";
import { Link } from "gatsby";
import { getTotalQuantity } from "../utils/cartUtils";

const Header = ({ siteTitle }) => {
  const [cartItems, setCartQuantity] = React.useState(0);

  React.useEffect(() => {
    const updateCartQuantity = () => {
      setCartQuantity(getTotalQuantity());
    };

    updateCartQuantity(); // Initial load
    window.addEventListener("cartUpdated", updateCartQuantity);

    return () => window.removeEventListener("cartUpdated", updateCartQuantity);
  }, []);



  return (
    <>
      <header
        className="promoTextComponent"
        style={{
          margin: `0 auto`,
          padding: `var(--space-4) var(--size-gutter)`,
          display: `flex`,
          alignItems: `center`,
          justifyContent: `space-around`,
          width: "100vw",
          height: "30px",
          background: "#056D63",
        }}
      >
        <span style={{ fontSize: "14px" }}>FREE SHIPPING ALL OVER INDIA</span>
        <span style={{ fontSize: "14px", color: "#fff" }}>FREE SHIPPING ALL OVER INDIA</span>
        <span style={{ fontSize: "14px" }}>FREE SHIPPING ALL OVER INDIA</span>
        <span style={{ fontSize: "14px", color: "#fff" }}>FREE SHIPPING ALL OVER INDIA</span>
        <span style={{ fontSize: "14px" }}>FREE SHIPPING ALL OVER INDIA</span>
        <span style={{ fontSize: "14px", color: "#fff" }}>FREE SHIPPING ALL OVER INDIA</span>
      </header>
      <div
        style={{
          position: "absolute",
          zIndex: 10,
        }}
      >
        <header
          className="logoTextComponent"
          style={{
            margin: `0 auto`,
            padding: `var(--space-4) var(--size-gutter)`,
            display: `flex`,
            alignItems: `center`,
            justifyContent: `flex-start`,
            paddingLeft: `5vw`,
            width: "100vw",
            paddingTop: "32px",
          }}
        >
          <Link
            to="/"
            style={{
              fontSize: `var(--font-lt)`,
              textDecoration: `none`,
              color: `var(--color-secondary)`,
            }}
            className="logo-text"
          >
            PROJECT FRIDAY
          </Link>
        </header>
        <header
          style={{
            margin: `0 auto`,
            padding: `var(--space-4) var(--size-gutter)`,
            display: `flex`,
            alignItems: `center`,
            justifyContent: `space-between`,
            width: "100%",
            paddingTop: "32px",
            paddingLeft: `5vw`,
            paddingRight: `5vw`,
          }}
        >
          <Link
            to="/#collection"
            style={{
              fontSize: `var(--font-sm)`,
              textDecoration: `none`,
              color: `var(--color-secondary)`,
              padding: "5px",
              paddingLeft: "20px",
              paddingRight: "20px",
              background: "#000",
            }}
            className="logo-text"
          >
            Collection
          </Link>
          <Link
            to="/#about"
            style={{
              fontSize: `var(--font-sm)`,
              textDecoration: `none`,
              color: `var(--color-secondary)`,
              padding: "5px",
              paddingLeft: "20px",
              paddingRight: "20px",
              background: "#000",
            }}
            className="logo-text"
          >
            About Us
          </Link>
          <Link
            to="/cart"
            style={{
              fontSize: `var(--font-sm)`,
              textDecoration: `none`,
              color: `var(--color-secondary)`,
              padding: "5px",
              paddingLeft: "20px",
              paddingRight: "20px",
              background: "#000",
            }}
            className="logo-text"
          >
            Cart{" "}
            <span style={{ color: `var(--color-primary)` }}>({cartItems})</span>
          </Link>
        </header>
      </div>
    </>
  );
};

export default Header;
