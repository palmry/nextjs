import gql from 'graphql-tag'
import { createQueryComponent, isPreviewBranch } from '../../utils/graphql'
import PostPageContentFragment from './PostPageContentFragment'

const GET_POST = gql`
  query GetPost(
    $slug: String!
    $limit: Int
    $isPreviewBranch: Boolean!
    ${!isPreviewBranch() ? '$currentISODate: DateTime!' : ''}
  ) {
    postCollection(
      preview: $isPreviewBranch
      limit: $limit
      where: { slug: $slug ${!isPreviewBranch() ? ', publishDate_lte: $currentISODate' : ''}}
    ) {
      items {
        ...PostPageContent
      }
    }
  }
  ${PostPageContentFragment}
`

export const GetPostQuery = createQueryComponent(GET_POST)
