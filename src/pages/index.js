import { Link } from "gatsby"
import React from "react"
import Image from "../components/image"
import Layout from "../components/layout"
import SEO from "../components/seo"


const IndexPage = () => (
  <Layout>
    <SEO title="Home" />
    <h1>Hi people</h1>
    <p>Welcome to your new Gatsby site. <i>"code to be inserted"</i> </p>
    <p>Now go build something great.</p>
    <div style={{ maxWidth: `300px`, marginBottom: `1.45rem` }}>
      <Image />
    </div>
    <Link to="/page-2/">Go to page 2</Link> <br />
    <Link to="/using-typescript/">Go to "Using TypeScript"</Link>
  </Layout>
)
/* const IndexPage2 = () => {
  const gatsbyRepoData = useStaticQuery(graphql`
    query {
      github {
        repository(name: "gatsby", owner: "gatsbyjs") {
          id
          nameWithOwner
          url
        }
      }
    }
  `)
  return (
    <section>
      <p>
        Build Time Data: Gatsby repo{` `}
        <a href={gatsbyRepoData.github.repository.url}>
          {gatsbyRepoData.github.repository.nameWithOwner}
        </a>
      </p>
    </section>
  )
}
 */
export default IndexPage


const queries = [`
{
  restApiApiV1Teams {
    teams{
      name
    }
  }
}`,
]