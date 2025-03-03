import React from "react";
import { CartProvider } from "./src/context/cartContext";

export const wrapRootElement = ({ element }) => <CartProvider>{element}</CartProvider>;
