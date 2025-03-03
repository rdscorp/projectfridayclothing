module.exports = {
  siteMetadata: {
    title: `Project Friday`,
    description: `Discover PROJECT FRIDAY, a bold and contemporary lifestyle apparel brand from Jaipur, India. Designed for the fearless and fashion-forward, we blend urban aesthetics with premium craftsmanship to create statement pieces that celebrate individuality. Elevate your style with PROJECT FRIDAY—where every day feels like a new beginning.`,
    author: `RDS Corp`,
    siteUrl: `https://projectfriday.in/`,
  },
  plugins: [
    `gatsby-plugin-image`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/images`,
      },
    },
    `gatsby-transformer-sharp`,
    {
      resolve: `gatsby-plugin-sharp`,
      options: {
        defaults: {
          formats: [`auto`, `webp`, `jpg`], // **Removed `avif` to fix error**
          placeholder: `dominantColor`,
          quality: 90,
        },
      },
    },
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `Project Friday`,
        short_name: `projectfriday`,
        start_url: `/`,
        background_color: `#663399`,
        display: `minimal-ui`,
        icon: `src/images/favicon-32x32.jpg`, // This path is relative to the root of the site.
      },
    },
  ],
};
