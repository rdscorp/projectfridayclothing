import * as React from "react"
import Layout from "../components/layout"
import Seo from "../components/seo"

const TermsConditions = () => (
    <Layout>
        <div style={{
            marginTop:"200px"
        }}>
            <h1>Terms & Conditions</h1>
            <p>By using our website and purchasing our products, you agree to the following terms and conditions.</p>

            <h2>Use of Our Services</h2>
            <p>You must be at least 18 years old or have parental consent to use our services.</p>

            <h2>Orders & Payments</h2>
            <p>All orders are subject to availability. We reserve the right to cancel orders or refuse service at our discretion.</p>

            <h2>Returns & Refunds</h2>
            <p>We accept returns within 30 days of purchase if the product is in its original condition. Refunds are processed within 7 business days.</p>

            <h2>Changes to Terms</h2>
            <p>We reserve the right to modify these terms at any time.</p>
        </div>
    </Layout>
)

export const Head = () => <Seo title="Terms & Conditions" />

export default TermsConditions;