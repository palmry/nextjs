import gql from 'graphql-tag'
import { createQueryComponent } from '../../utils/graphql'

const AUTHOR_QUERY = gql`
  query AuthorQuery($slug: String!, $isPreviewBranch: Boolean!, $locale: String!) {
    authorCollection(preview: $isPreviewBranch, where: { slug: $slug }, limit: 1, locale: $locale) {
      items {
        sys {
          id
        }
        slug
        authorTitle
        name
        description
        content
        email
        twitterUrl
        facebookUrl
        pinterestUrl
        instagramUrl
        image {
          url
        }
      }
    }
  }
`

export const AuthorPageQuery = createQueryComponent(AUTHOR_QUERY)
