import * as React from "react"
import Layout from "../components/layout"
import Seo from "../components/seo"

const PrivacyPolicy = () => (
    <Layout>
        <div style={{
            marginTop: "200px"
        }}>
            <h1>Privacy Policy</h1>
            <p>Your privacy is important to us. This Privacy Policy explains how we collect, use, and protect your personal information.</p>

            <h2>Information We Collect</h2>
            <p>We collect personal information such as your name, email address, shipping address, and payment details when you make a purchase.</p>

            <h2>How We Use Your Information</h2>
            <p>We use your information to process transactions, provide customer support, and improve our services.</p>

            <h2>Data Protection</h2>
            <p>We implement security measures to protect your data from unauthorized access.</p>
        </div>
    </Layout>
)

export const Head = () => <Seo title="Privacy Policy" />

export default PrivacyPolicy;