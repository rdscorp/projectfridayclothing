import * as React from "react"
import { useState, useEffect } from "react"
import { Helmet } from "react-helmet"
import { StaticImage } from "gatsby-plugin-image"

import Layout from "../components/layout"
import Seo from "../components/seo"
import * as styles from "../components/index.module.css"
import HoverImage from "../components/HoverImage"
import useStock from "../../stock"

const links = [
  {
    "text": "Friday Dreams",
    "img": ["IMG_2762.jpg", "IMG_8092.jpg"],
    "url": "/products/friday-dreams/",
    "description": "A comfortable and stylish t-shirt, perfect for your Friday mood.",
    "price": 1295
  },
  {
    "text": "The Sword",
    "img": ["IMG_2757.webp", "IMG_8102.jpg"],
    "url": "/products/the-sword/",
    "description": "A sharp and striking t-shirt design inspired by legendary warriors.",
    "price": 1295
  },
  {
    "text": "Trustissue",
    "img": ["IMG_2760.webp", "IMG_8105.jpg"],
    "url": "/products/trustissue/",
    "description": "A bold statement piece for those who keep their circle small and real.",
    "price": 1295
  },
  {
    "text": "Meowtallica",
    "img": ["IMG_2763.jpg", "IMG_8116.jpg"],
    "url": "/products/meowtallica/",
    "description": "A bold black t-shirt with a fierce feline-inspired heavy metal design.",
    "price": 1295
  },
  {
    "text": "Fallen Angel",
    "img": ["IMG_8111.jpg", "IMG_8109.jpg"],
    "url": "/products/fallen-angel/",
    "description": "A t-shirt that blends dark aesthetics with a rebellious spirit.",
    "price": 1295
  },
  {
    "text": "Gods Only Child",
    "img": ["IMG_8094.jpg", "IMG_8096.jpg"],
    "url": "/products/gods-only-child/",
    "description": "A divine statement t-shirt for those who embrace their individuality.",
    "price": 1295
  },
  {
    "text": "Gods Child",
    "img": ["IMG_8120.jpg", "IMG_8118.jpg"],
    "url": "/products/gods-child/",
    "description": "A divine statement t-shirt for those who embrace their self.",
    "price": 1295
  },
  {
    "text": "Mastermind",
    "img": ["IMG_8129.jpg", "IMG_8127.jpg"],
    "url": "/products/mastermind/",
    "description": "A strategic and stylish t-shirt for those who think three moves ahead.",
    "price": 1295
  },
]

const utmParameters = `?utm_source=starter&utm_medium=start-page&utm_campaign=default-starter`

const IndexPage = () => {
  // Set the initial title to "Home - Project Friday"
  const [pageTitle, setPageTitle] = useState("Home - Project Friday")

  const sections = React.useMemo(() => [
    { id: "collection", title: "Collection - Project Friday" },
    { id: "about", title: "About Us - Project Friday" },
  ], []);

  const stock = useStock();
  console.log(stock);

  useEffect(() => {
    const observerOptions = {
      root: null,
      threshold: 0.5, // when 50% of the section is visible
    }

    const observerCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const section = sections.find(s => s.id === entry.target.id)
          if (section) {
            setPageTitle(section.title)
          }
        }
      })
    }

    const observer = new IntersectionObserver(observerCallback, observerOptions)
    sections.forEach(({ id }) => {
      const element = document.getElementById(id)
      if (element) {
        observer.observe(element)
      }
    })

    return () => observer.disconnect()
  }, [sections])

  return (
    <Layout>
      {/* Helmet updates the page title dynamically */}
      <Helmet>
        <title>{pageTitle}</title>
      </Helmet>
      <div className={styles.textCenter}>
        <StaticImage
          src="../images/IMG_2359.jpg"
          loading="eager"
          quality={95}
          formats={["auto", "webp", "avif"]}
          alt=""
          className="heroImage"
          style={{
            marginBottom: `var(--space-3)`,
            width: "100vw",
            marginLeft: "-5vw",
          }}
        />
      </div>
      {/* Collection Section */}
      <div
        id="collection"
        className="sectionTextComponent"
        style={{
          paddingTop: "20px",
          justifyContent: "space-between",
          display: "flex",
        }}
      >
        <p className="logo-text" style={{ fontSize: "var(--font-lt)", color: "var(--color-primary)" }}>
          COLLECTION
        </p>
        {/* Additional elements can go here */}
      </div>
      <ul className={styles.list}>
        {links.map((link) => (
          <li key={link.url} className={styles.listItem}>
            <div className="image-container" style={{ width: "100%" }}>
              <div style={{ position: "relative", display: "flex", justifySelf: "center" }}>
                <HoverImage dIpath={link.img[0]} hIpath={link.img[1]} />
              </div>
              <div className={styles.parentContainer}>
                <span className={styles.atcb}>&nbsp;+</span>
                <span className={styles.hoverPopup}>
                  <span>S</span>
                  <br />
                  <span>M</span>
                  <br />
                  <span>L</span>
                  <br />
                </span>
              </div>
            </div>
            <span
              style={{
                display: 'flex',
                justifyContent: 'space-between'
              }}><a className={styles.listItemLink} href={`${link.url}${utmParameters}`}>
                {link.text}
              </a><span style={{ color: `var(--color-primary)` }}>₹{link.price}</span></span>
            <p className={styles.listItemDescription} style={{
              color: '#ffffff70'
            }}>{link.description}</p>
          </li>
        ))}
      </ul>
      {/* About Section */}
      <div
        id="about"
        className="sectionTextComponent"
        style={{
          paddingTop: "20px",
          justifyContent: "space-between",
          display: "flex",
        }}
      >
        <p className="logo-text" style={{ fontSize: "var(--font-lt)", color: "var(--color-primary)" }}>
          ABOUT US
        </p>
        {/* Additional repeating elements can be added here */}
      </div>
      <div
        id="about-details"
        style={{
          paddingBottom: "50px",
          justifyContent: "space-between",
          display: "flex",
          flexDirection: 'column'
        }}
      >
        <div style={{
          display: 'flex',
          gap: '2vw',
          justifyContent: 'center'
        }}>
          <StaticImage
            src="../images/IMG_1552.jpg"
            loading="eager"
            quality={95}
            formats={["auto", "webp", "avif"]}
            alt=""
            style={{
              marginBottom: `var(--space-3)`,
              width: "25%",
              border: '#fff solid 10px'
            }}
          />
          <StaticImage
            src="../images/IMG_1550.jpg"
            loading="eager"
            quality={95}
            formats={["auto", "webp", "avif"]}
            alt=""
            style={{
              marginBottom: `var(--space-3)`,
              width: "25%",
              border: '#fff solid 10px'
            }}
          />

          <StaticImage
            src="../images/IMG_1553.jpg"
            loading="eager"
            quality={95}
            formats={["auto", "webp", "avif"]}
            alt=""
            style={{
              marginBottom: `var(--space-3)`,
              width: "25%",
              border: '#fff solid 10px'
            }}
          />
        </div>
        <h3 style={{ width: "100%" }}>
          Welcome to PROJECT FRIDAY, where fashion meets individuality, and every piece tells a story.
          Based in the heart of Jaipur, India, we are a lifestyle apparel brand that redefines contemporary
          fashion with a touch of boldness, creativity, and authenticity. Our philosophy is simple—style
          should be effortless, versatile, and an extension of who you are. Inspired by the energy of the
          modern generation and the cultural vibrance of our roots, PROJECT FRIDAY creates apparel that blends
          urban aesthetics with premium craftsmanship.
          <br />

          <br />
          At PROJECT FRIDAY, we don’t just make clothes; we create expressions of confidence and attitude.
          Whether it's a statement streetwear piece, a minimal everyday essential, or a bold standout design,
          each item is crafted with attention to detail, high-quality fabrics, and a commitment to sustainable and
          ethical production. We believe that fashion is more than just clothing—it's a movement, an experience,
          and a way to celebrate individuality. Our collections are designed for dreamers, go-getters, and
          rule-breakers—those who refuse to settle for the ordinary and are constantly pushing boundaries in
          their personal and professional lives.
          <br />
          <br />
          With every collection, we strive to break the monotony of conventional fashion, offering a fresh perspective
          on self-expression. PROJECT FRIDAY is more than a brand—it’s a lifestyle, a statement, and a celebration
          of the fearless spirit that defines the youth of today. Join us in shaping the future of fashion, one bold
          step at a time. This is PROJECT FRIDAY—where every day feels like a new beginning.
        </h3>
      </div>
    </Layout>
  )
}

export const Head = () => <Seo title="Home" />

export default IndexPage
