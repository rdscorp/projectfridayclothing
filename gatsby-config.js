/**
 * Configure your Gatsby site with this file.
 *
 * See: https://www.gatsbyjs.com/docs/reference/config-files/gatsby-config/
 */

/**
 * @type {import('gatsby').GatsbyConfig}
 */

module.exports = {
  siteMetadata: {
    title: `Project Friday`,
    description: `Discover PROJECT FRIDAY, a bold and contemporary lifestyle apparel brand from Jaipur, India. Designed for the fearless and fashion-forward, we blend urban aesthetics with premium craftsmanship to create statement pieces that celebrate individuality. Elevate your style with PROJECT FRIDAY—where every day feels like a new beginning.`,
    author: `RDS Corp`,
    siteUrl: `https://projectfriday.in/`,
  },
  plugins: [
    `gatsby-plugin-image`,
    `gatsby-plugin-svgr`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/images`,
      },
    },
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `Project Friday`,
        short_name: `projectfriday`,
        start_url: `/`,
        background_color: `#663399`,
        // This will impact how browsers show your PWA/website
        // https://css-tricks.com/meta-theme-color-and-trickery/
        // theme_color: `#663399`,
        display: `minimal-ui`,
        icon: `src/images/favicon-32x32.jpg`, // This path is relative to the root of the site.
      },
    },
    {
      resolve: "gatsby-plugin-google-fonts",
      options: {
        fonts: [
          "Material+Icons"
        ],
        display: "swap",
      },
    }
    
  ],
  flags: {
    FAST_DEV: true,
    DEV_SSR: false,  // Ensure SSR is disabled in development
  }
}
