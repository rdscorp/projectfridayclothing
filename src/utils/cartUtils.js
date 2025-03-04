export const getCartItems = () => {
    if (typeof window !== "undefined") {
      const cart = JSON.parse(localStorage.getItem("cart")) || [];
      return Array.isArray(cart) ? cart : [];
    }
    return [];
  };
  
  export const getTotalQuantity = () => {
    const cart = getCartItems();
    return cart.reduce((sum, item) => sum + item.qty, 0);
  };
  
  export const addToCart = (newItem) => {
    if (typeof window !== "undefined") {
      let cart = getCartItems();
      
      // Check if item already exists in cart
      const existingItemIndex = cart.findIndex(item => item.id === newItem.id);
      
      if (existingItemIndex !== -1) {
        cart[existingItemIndex].qty += newItem.qty; // Increase quantity
      } else {
        cart.push(newItem);
      }
      
      localStorage.setItem("cart", JSON.stringify(cart));
      window.dispatchEvent(new Event("cartUpdated"));
    }
  };
  
  export const removeFromCart = (id) => {
    if (typeof window !== "undefined") {
      let cart = getCartItems().filter(item => item.id !== id);
      localStorage.setItem("cart", JSON.stringify(cart));
      window.dispatchEvent(new Event("cartUpdated"));
    }
  };
  
  export const clearCart = () => {
    if (typeof window !== "undefined") {
      localStorage.setItem("cart", JSON.stringify([]));
      window.dispatchEvent(new Event("cartUpdated"));
    }
  };
  