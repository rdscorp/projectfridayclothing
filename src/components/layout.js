/**
 * Layout component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.com/docs/how-to/querying-data/use-static-query/
 */

import * as React from "react"
import { useStaticQuery, graphql } from "gatsby"

import Header from "./header"
import IntroPopup from "./IntroPopup"

const Layout = ({ children }) => {
  const data = useStaticQuery(graphql`
    query SiteTitleQuery {
      site {
        siteMetadata {
          title
        }
      }
    }
  `)

  return (
    <>
      <Header siteTitle={data.site.siteMetadata?.title || `Title`} />
      <IntroPopup/>
      <div
        style={{
          margin: `0 auto`,
          maxWidth: `var(--size-content)`,
          padding: `var(--size-gutter)`,
        }}
      >
        <main>{children}</main>
        <footer
          style={{
            marginTop: `var(--space-5)`,
            fontSize: `var(--font-sm)`,
            marginBottom: '20px'
          }}
        >
          <div className="footer-div">
            <div id="collection" style={{ paddingTop: '20px', justifyContent: 'space-between', display: 'flex', alignItems:'flex-start' }} >
              <a href="/" className="logo-text-bottom" style={{ textDecoration:"none",fontSize: `42px`, color: `var(--color-primary)` }}>PROJECT FRIDAY <sup>®</sup></a>
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
              <p className="fbt"><a>RETURNS</a><br />
                <a>ORDER TRACKING</a><br />
                <a>FAQ</a><br />
                <a>CONTACT</a><br />
              </p>
            </div>
            <div>
              <p className="ftt">JOIN THE PROJECT</p>
              <p className="fbt">SIGNUP TO OUR MAILING LIST AND GET 10% OFF YOUR FIRST ORDER
              </p>
              <div>
                <input className="eib" type="email" placeholder="Email Address" />
                <button className="esb">JOIN</button>
              </div>
            </div>
          </div>
          <span className="copyRightText">Copyright © {new Date().getFullYear()} Project Friday &middot; Powered By
          {` `}
          <a href="https://www.rajputanards.com/">Q Engine</a></span>
        </footer>
      </div>
    </>
  )
}

export default Layout
