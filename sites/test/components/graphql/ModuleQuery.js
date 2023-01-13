import gql from 'graphql-tag'
import { createQueryComponent } from '../../utils/graphql'

const MODULE_QUERY = gql`
  query ModuleQuery(
    $isPreviewBranch: Boolean!
    $moduleName: String!
    $postLimit: Int!
    $locale: String!
  ) {
    moduleCollection(locale: $locale, preview: $isPreviewBranch, where: { name: $moduleName }) {
      items {
        title
        destinationUrl
        isSponsoredContent
        postQueryCondition
        featuredPostsCollection(limit: $postLimit) {
          items {
            ... on Post {
              title
              slug
              squareCroppingPreference
              featuredImage {
                title
                url
                description
              }
              mainCategory {
                slug
              }
              displayCategory {
                title
                slug
              }
              publishDate
            }
          }
        }
      }
    }
  }
`

export const ModuleQuery = createQueryComponent(MODULE_QUERY)
