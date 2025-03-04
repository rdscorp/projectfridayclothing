import "./src/components/index.module.css"; // Adjust the path if necessary
import "./src/components/layout.css"; // Adjust the path if necessary
import React from "react";
import { CartProvider } from "./src/context/cartContext";

export const wrapRootElement = ({ element }) => (
  <CartProvider>{element}</CartProvider>
);