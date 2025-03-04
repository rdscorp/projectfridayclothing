import React from "react";
import { GatsbyImage, getImage } from "gatsby-plugin-image";
import { graphql, useStaticQuery } from "gatsby";

const HoverImage = ({ dIpath, hIpath }) => {
  // Fetch all images ONCE
  const data = useStaticQuery(graphql`
    query {
      allFile {
        nodes {
          relativePath
          childImageSharp {
            gatsbyImageData(layout: CONSTRAINED)
          }
        }
      }
    }
  `);

  // Find the images dynamically
  const defaultImgData = data.allFile.nodes.find(node => node.relativePath === dIpath);
  const hoverImgData = data.allFile.nodes.find(node => node.relativePath === hIpath);

  // Convert to optimized Gatsby images
  const defaultImg = defaultImgData ? getImage(defaultImgData) : null;
  const hoverImg = hoverImgData ? getImage(hoverImgData) : null;

  return (
    <div className="image-container">
      {defaultImg && <GatsbyImage image={defaultImg} alt="Default" className="default-image" style={{
        position: "absolute",
        aspectRatio: "12/15",
        height:"100%"
      }} />}
      {hoverImg && <GatsbyImage image={hoverImg} alt="Hover" className="hover-image" style={{
        position: "absolute",
        aspectRatio: "12/15",
        height:"100%"
      }} />}
    </div>
  );
};

export default HoverImage;
