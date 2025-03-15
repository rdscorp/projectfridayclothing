import * as React from "react"
import { useState, useEffect } from "react"
import { Helmet } from "react-helmet"
import { StaticImage } from "gatsby-plugin-image"

import Layout from "../components/layout"
import Seo from "../components/seo"
import * as styles from "../components/index.module.css"
import HoverImage from "../components/HoverImage"
import useStock from "../../stock"
import { addToCart } from "../utils/cartUtils"

const links = [
  {
    "title": "Meowtallica",
    "slug": "meowtallica",
    "price": 1799,
    "compare_at_price": 1295,
    "description": "A bold black t-shirt with a fierce feline-inspired heavy metal design.",
    "img": ["IMG_2763.jpg", "IMG_8116.jpg", "IMG_8114.jpg", "IMG_8115.jpg", "IMG_8117.jpg"],
    "size": ["S", "M", "L"],
    "color": "BLACK",
    "weight": 1700,
    "dimensions": { "length": 1700, "width": 1700, "height": 1700 },
    "url": "/products/meowtallica/",
    "imgURL": "https://i.postimg.cc/wvxj91wd/IMG-2763.jpg"
  },
  {
    "title": "Friday Dreams",
    "slug": "friday-dreams",
    "price": 1799,
    "compare_at_price": 1295,
    "description": "A comfortable and stylish t-shirt, perfect for your Friday mood.",
    "img": ["IMG_2762.jpg", "IMG_8092.jpg", "IMG_8090.jpg", "IMG_2359.jpg", "IMG_8091.jpg"],
    "size": ["S", "M", "L"],
    "color": "BLACK",
    "weight": 1700,
    "dimensions": { "length": 1700, "width": 1700, "height": 1700 },
    "url": "/products/friday-dreams/",
    "imgURL": "https://i.postimg.cc/3rSdJZMf/IMG-2762.jpg"
  },
  {
    "title": "Gods Only Child",
    "slug": "gods-only-child",
    "price": 1799,
    "compare_at_price": 1295,
    "description": "A divine statement t-shirt for those who embrace their individuality.",
    "img": ["IMG_8094.jpg", "IMG_8096.jpg", "IMG_8095.jpg", "IMG_8097.jpg"],
    "size": ["S", "M", "L"],
    "color": "RED",
    "weight": 1700,
    "dimensions": { "length": 1700, "width": 1700, "height": 1700 },
    "url": "/products/gods-only-child/",
    "imgURL": "https://i.postimg.cc/28L8jR73/IMG-8094.jpg"
  },
  {
    "title": "The Sword",
    "slug": "the-sword",
    "price": 1799,
    "compare_at_price": 1295,
    "description": "A sharp and striking t-shirt design inspired by legendary warriors.",
    "img": ["IMG_2757.webp", "IMG_8102.jpg", "IMG_8098.jpg", "IMG_8100.jpg", "IMG_8104.jpg"],
    "size": ["S", "M", "L"],
    "color": "WHITE",
    "weight": 1700,
    "dimensions": { "length": 1700, "width": 1700, "height": 1700 },
    "url": "/products/the-sword/",
    "imgURL": "https://i.postimg.cc/MKgH1Kpy/IMG-2757.webp"
  },
  {
    "title": "Trustissue",
    "slug": "trustissue",
    "price": 1799,
    "compare_at_price": 1295,
    "description": "A bold statement piece for those who keep their circle small and real.",
    "img": ["IMG_2760.webp", "IMG_8105.jpg", "IMG_8106.jpg", "IMG_8107.jpg", "IMG_8108.jpg"],
    "size": ["S", "M", "L"],
    "color": "RED",
    "weight": 1700,
    "dimensions": { "length": 1700, "width": 1700, "height": 1700 },
    "url": "/products/trustissue/",
    "imgURL": "https://i.postimg.cc/HsrjJ7dY/IMG-2760.webp"
  },
  {
    "title": "Fallen Angel",
    "slug": "fallen-angel",
    "price": 1799,
    "compare_at_price": 1295,
    "description": "A t-shirt that blends dark aesthetics with a rebellious spirit.",
    "img": ["IMG_8111.jpg", "IMG_8109.jpg", "IMG_8110.jpg", "IMG_8112.jpg"],
    "size": ["S", "M", "L"],
    "color": "WHITE",
    "weight": 1700,
    "dimensions": { "length": 1700, "width": 1700, "height": 1700 },
    "url": "/products/fallen-angel/",
    "imgURL": "https://i.postimg.cc/0Qt2j94K/IMG-8111.jpg"
  },
  {
    "title": "Mastermind",
    "slug": "mastermind",
    "price": 1799,
    "compare_at_price": 1295,
    "description": "A strategic and stylish t-shirt for those who think three moves ahead.",
    "img": ["IMG_8129.jpg", "IMG_8127.jpg", "IMG_8128.jpg", "IMG_8130.jpg"],
    "size": ["S", "M", "L"],
    "color": "WHITE",
    "weight": 1700,
    "dimensions": { "length": 1700, "width": 1700, "height": 1700 },
    "url": "/products/mastermind/",
    "imgURL": "https://i.postimg.cc/jj4jVHQX/IMG-8129.jpg"
  },
  {
    "title": "Gods Child",
    "slug": "gods-child",
    "price": 1799,
    "compare_at_price": 1295,
    "description": "A divine statement t-shirt for those who embrace their self.",
    "img": ["IMG_8120.jpg", "IMG_8118.jpg", "IMG_8119.jpg", "IMG_8121.jpg"],
    "size": ["S", "M", "L"],
    "color": "RED",
    "weight": 1700,
    "dimensions": { "length": 1700, "width": 1700, "height": 1700 },
    "url": "/products/gods-child/",
    "imgURL": "https://i.postimg.cc/J0vr3PM1/IMG-8120.jpg"
  }
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

  const handleAddToCart = (title, slug, price, compare_at_price, image, weight, dimensions, imgURL, color, size) => {
    const variantKey = `${slug}.${color}.${size}`;
    addToCart({
      name: title,
      slug: slug + "." + color + "." + size,
      id: slug + "." + color + "." + size,
      price: price,
      image: image,
      compare_at_price: compare_at_price,
      qty: 1,
      weight: weight,
      dimensions: dimensions,
      imgURL: imgURL,
      prdURL: "https://projectfriday.in/products/" + slug,
    });
  };

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
              <div style={{
                position: "relative", display: "flex", justifySelf: "center", overflow: "hidden",
                width: "100%", justifyContent: "center",
              }}>
                <HoverImage dIpath={link.img[0]} hIpath={link.img[1]} />
              </div>
              <div className={styles.parentContainer}>
                <span className={styles.atcb}>&nbsp;+</span>
                <span className={styles.hoverPopup}>
                  <span onClick={() => handleAddToCart(link.title, link.slug, link.price, link.compare_at_price, link.img[0], link.weight, link.dimensions, link.imgURL, link.color, "S")} style={{ cursor: "pointer" }}>S</span>
                  <br />
                  <span onClick={() => handleAddToCart(link.title, link.slug, link.price, link.compare_at_price, link.img[0], link.weight, link.dimensions, link.imgURL, link.color, "M")} style={{ cursor: "pointer" }}>M</span>
                  <br />
                  <span onClick={() => handleAddToCart(link.title, link.slug, link.price, link.compare_at_price, link.img[0], link.weight, link.dimensions, link.imgURL, link.color, "L")} style={{ cursor: "pointer" }}>L</span>
                  <br />
                </span>

              </div>
            </div>
            <span
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginTop: '10px'
              }}><a className={styles.listItemLink} href={`${link.url}${utmParameters}`}>
                {link.title}
              </a><span style={{ color: `var(--color-primary)` }}><s style={{ color: `#ffffff90` }}>₹{link.price}</s> ₹{link.compare_at_price}</span></span>
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
            className="aboutImage"
          />
          <StaticImage
            src="../images/IMG_1550.jpg"
            loading="eager"
            quality={95}
            formats={["auto", "webp", "avif"]}
            alt=""
            className="aboutImage"
          />

          <StaticImage
            src="../images/IMG_1553.jpg"
            loading="eager"
            quality={95}
            formats={["auto", "webp", "avif"]}
            alt=""
            className="aboutImage"
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
