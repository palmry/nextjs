import gql from 'graphql-tag'
import { createQueryComponent } from '../../utils/graphql'

const WEBINAR_QUERY = gql`
  query WebinarQuery($slug: String!, $isPreviewBranch: Boolean!, $locale: String!) {
    webinarCollection(
      locale: $locale
      preview: $isPreviewBranch
      where: { slug: $slug }
      limit: 1
    ) {
      items {
        sys {
          id
        }
        name
        slug
        date
        endDate
        logo {
          url
        }
        description
        callToAction
        printableImage {
          url
        }
        scheduleCollection {
          items {
            name
            description
            timeSlot
            speaker {
              image {
                url
              }
            }
          }
        }
        speakersCollection {
          items {
            name
            role
            description
            image {
              url
            }
          }
        }
        swagBags
        giveaways
        relatedPostsCollection(limit: 4) {
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
        webinarId
        getResponseListToken
      }
    }
  }
`

export const WebinarPageQuery = createQueryComponent(WEBINAR_QUERY)
