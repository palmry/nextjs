import gql from 'graphql-tag'
import { createQueryComponent } from '../../utils/graphql'

const SERIES_QUERY = gql`
  query SeriesQuery($slug: String!, $isPreviewBranch: Boolean!, $locale: String!) {
    seriesCollection(locale: $locale, preview: $isPreviewBranch, where: { slug: $slug }, limit: 1) {
      items {
        sys {
          id
        }
        slug
        title
        content
        bannerImage {
          title
          url
          description
        }
        sponsor {
          name
          link
          logo {
            title
            url
            description
          }
          showDisplayAds
          showVideoAds
        }
        seoTitle
        seoDescription
      }
    }
  }
`

export const SeriesPageQuery = createQueryComponent(SERIES_QUERY)
