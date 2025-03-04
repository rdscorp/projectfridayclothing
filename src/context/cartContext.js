import React, { createContext, useState, useEffect } from "react";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(0);

  useEffect(() => {
    const updateCartQuantity = () => {
      const cartData = localStorage.getItem("cart");
      if (cartData) {
        const cart = JSON.parse(cartData);
        const totalQty = Object.values(cart).reduce((acc, item) => acc + item.qty, 0);
        setCartItems(totalQty);
      }
    };

    // Run once when component mounts
    updateCartQuantity();

    // Listen for localStorage changes across tabs
    window.addEventListener("storage", updateCartQuantity);

    return () => {
      window.removeEventListener("storage", updateCartQuantity);
    };
  }, []);

  return (
    <CartContext.Provider value={{ cartItems, setCartItems }}>
      {children}
    </CartContext.Provider>
  );
};
