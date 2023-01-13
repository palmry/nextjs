import gql from 'graphql-tag'
import { createQueryComponent } from '../../utils/graphql'

const INFINITE_SCROLL_QUERY = gql`
  query InfiniteScrollQuery(
    $isPreviewBranch: Boolean!
    $title: String!
    $postLimit: Int!
    $locale: String!
  ) {
    infiniteScrollCollection(locale: $locale, preview: $isPreviewBranch, where: { title: $title }) {
      items {
        title
        featuredPostsCollection(limit: $postLimit) {
          items {
            ... on Post {
              sys {
                id
              }
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

export const InfiniteScrollQuery = createQueryComponent(INFINITE_SCROLL_QUERY)
