// Load environment variables
require('dotenv').config({
  path: `.env.${process.env.NODE_ENV}`,
})
const slugify = require('slugify')

module.exports = {
  siteMetadata: {
    title: `WebriQ Gatsby + Strapi Starter Template`,
    author: `WebriQ`,
    description: `WebriQ Gatsby Starter Template with its blog posts coming Strapi app instance.`,
    siteUrl: `https://webriq-gatsby-cms-starter-template-strapi.webriq.me`,
    social: {
      twitter: `kylemathews`,
    },
  },
  plugins: [
    {
      resolve: `gatsby-source-strapi`,
      options: {
        apiURL: 'https://gatsby-template.herokuapp.com',
        contentTypes: [`posts`, `categories`, `authors`],
        loginData: {
          identifier: 'galangdj@gmail.com',
          password: 'test123',
        },
      },
    },
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    {
      resolve: `gatsby-plugin-google-analytics`,
      options: {
        // trackingId: `ADD YOUR TRACKING ID HERE`,
        // head: true,
        // anonymize: true,
        // respectDNT: true,
        // cookieDomain: `example.com`
      },
    },
    {
      resolve: `gatsby-plugin-sass`,
      options: {
        implementation: require('sass'),
      },
    },
    {
      resolve: `gatsby-plugin-google-fonts`,
      options: {
        fonts: [
          `open sans\:400,600,700,800`,
          `montserrat\:400,500,600,700`, // you can also specify font weights and styles
        ],
      },
    },
    `gatsby-plugin-sitemap`,
    {
      resolve: `gatsby-plugin-feed`,
      options: {
        query: `
          {
            site {
              siteMetadata {
                title
                description
                siteUrl
                site_url: siteUrl
              }
            }
          }
        `,
        feeds: [
          {
            serialize: ({ query: { site, allStrapiPosts } }) => {
              return allStrapiPosts.edges.map(edge => {
                return Object.assign({}, edge.node, {
                  description: edge.node.shortdescription || edge.node.excerpt,
                  date: edge.node.date || edge.node.created_at,
                  url:
                    site.siteMetadata.siteUrl +
                    '/' +
                    slugify(edge.node.title.toLowerCase()),
                  guid:
                    site.siteMetadata.siteUrl +
                    '/' +
                    slugify(edge.node.title.toLowerCase()),
                  custom_elements: [{ 'content:encoded': edge.node.body }],
                })
              })
            },
            query: `
              {
                allStrapiPosts(sort: {fields: date, order: ASC}) {
                  edges {
                    node {
                      id
                      title
                      body
                      shortdescription
                      excerpt
                      date
                      created_at
                    }
                  }
                }
              }
            `,
            output: '/rss.xml',
            title: "Your Site's RSS Feed",
          },
        ],
      },
    },
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `WebriQ Blog`,
        short_name: `WebriQ`,
        start_url: `/`,
        background_color: `#663399`,
        theme_color: `#f7f7f7`,
        display: `minimal-ui`,
        icon: `static/gatsby-icon.png`,
      },
    },
    `gatsby-plugin-offline`,
    `gatsby-plugin-react-helmet`,
  ],
}
