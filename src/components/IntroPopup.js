import { StaticImage } from "gatsby-plugin-image"
import React, { useState, useEffect } from "react"

const IntroPopup = () => {
    const [showPopup, setShowPopup] = useState(false)

    useEffect(() => {
        const hasVisited = localStorage.getItem("hasVisited")
        if (!hasVisited) {
            setShowPopup(true)
        }
    }, [])

    const handleClose = () => {
        localStorage.setItem("hasVisited", "true")
        setShowPopup(false)
    }

    if (!showPopup) return null

    return (
        <div style={styles.overlay}>
            <div className="introPopupClass" style={styles.popup}>
                <StaticImage
                    src="../images/IMG_2359.jpg"
                    loading="eager"
                    quality={95}
                    formats={["auto", "webp", "avif"]}
                    alt=""
                    style={{ marginBottom: `var(--space-3)`, width: '100%', }}
                />
                <p className="ftt" style={{ color: '#000' }}>JOIN THE PROJECT</p>
                <p className="fbt" style={{ color: '#000' }}>SIGNUP TO OUR MAILING LIST AND GET 10% OFF YOUR FIRST ORDER
                </p>
                <div>
                    <input className="eib2" type="email" placeholder="Email Address" />
                    <button className="esb2">JOIN</button>
                </div>
                <button onClick={handleClose} style={styles.button}>CLOSE</button>
            </div>
        </div>
    )
}

const styles = {
    overlay: {
        position: "fixed", top: 0, left: 0, width: "100%", height: "100%",
        backgroundColor: "rgba(0,0,0,0.5)", display: "flex",
        justifyContent: "center", alignItems: "center", zIndex: 1000
    },
    popup: {
        background: "#fff", padding: "20px", backgroundColor: "#fff",
        textAlign: "center", maxWidth: "500px", boxShadow: "0px 4px 6px rgba(0,0,0,0.1)"
    },
    button: {
        marginTop: "15px", padding: "10px 20px", backgroundColor: "black",
        color: "white", border: "none", cursor: "pointer"
    }
}

export default IntroPopup
