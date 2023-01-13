import gql from 'graphql-tag'
import { createQueryComponent } from '../../utils/graphql'

const ABOUT_QUERY = gql`
  query AboutQuery($isPreviewBranch: Boolean!, $locale: String!) {
    aboutPageCollection(preview: $isPreviewBranch, limit: 1, locale: $locale) {
      items {
        image {
          title
          url
        }
        ourMission
        ourStory
        contributorsCollection(limit: 4) {
          items {
            slug
            name
            image {
              url
            }
          }
        }
      }
    }
  }
`

export const AboutPageQuery = createQueryComponent(ABOUT_QUERY)
