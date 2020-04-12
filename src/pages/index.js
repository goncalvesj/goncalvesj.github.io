import React from 'react';
import Helmet from 'react-helmet';
import { graphql } from 'gatsby';
import Layout from '../layout';
import PostListing from '../components/PostListing';
import SEO from '../components/SEO';
import Bio from '../components/Bio';
import config from '../../data/SiteConfig';

const divStyle = {
  'marginLeft': '30%',
  'marginBottom': '5%'
};
const Index = ({ data }) => (
  <Layout>
    <main>
      <Helmet title={config.siteTitle} />
      <SEO />
      <div style={divStyle}>
        <Bio config={config}></Bio>
      </div>
      <PostListing postEdges={data.allMarkdownRemark.edges} />
    </main>
  </Layout>
);

export default Index;

/* eslint no-undef: "off" */
export const pageQuery = graphql`
  query IndexQuery {
    allMarkdownRemark(
      limit: 2000
      sort: { fields: [fields___date], order: DESC }
    ) {
      edges {
        node {
          fields {
            slug
            date(formatString: "MMMM DD, YYYY")
          }
          excerpt
          timeToRead
          frontmatter {
            title
            tags
            cover
            date
            categories
          }
        }
      }
    }
  }
`;
