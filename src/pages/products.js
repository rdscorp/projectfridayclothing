import React from "react";
import { Link } from "gatsby";
import products from "../data/products.json";

const ProductsPage = () => {
  return (
    <div>
      <h1>Our Products</h1>
      <ul>
        {products.map((product) => (
          <li key={product.slug}>
            <Link to={`/products/${product.slug}`}>
              <h2>{product.title}</h2>
            </Link>
            <p>Price: ${product.price}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProductsPage;
