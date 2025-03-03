const path = require("path");
const products = require("./src/data/products.json");

exports.createPages = async ({ actions }) => {
  const { createPage } = actions;
  const productTemplate = path.resolve("./src/templates/ProductTemplate.js");

  products.forEach((product) => {
    createPage({
      path: `/products/${product.slug}`,
      component: productTemplate,
      context: {
        product,
      },
    });
  });
};

exports.createSchemaCustomization = ({ actions }) => {
  const { createTypes } = actions;
  createTypes(`
    type Product implements Node {
      variants: JSON
    }
  `);
};

exports.onCreateWebpackConfig = ({ actions }) => {
  actions.setWebpackConfig({
    resolve: {
      fallback: {
        path: require.resolve("path-browserify"),
        os: require.resolve("os-browserify/browser"),
        crypto: require.resolve("crypto-browserify"),
      },
    },
  });
};
