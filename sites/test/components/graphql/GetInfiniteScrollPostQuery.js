import gql from 'graphql-tag'
import { createQueryComponent, isPreviewBranch } from '../../utils/graphql'
import PostPageContentFragment from './PostPageContentFragment'

const GET_IS_POST = gql`
  query GetPost(
    $categorySlug: String!
    $postType: String!
    $isPreviewBranch: Boolean!
    $excludeSlugs: [String!]
    ${!isPreviewBranch() ? '$currentISODate: DateTime!' : ''}
    $skip: Int
  ) {
    postCollection(
      preview: $isPreviewBranch
      limit: 1
      order: [publishDate_DESC]
      skip: $skip
      where: {
        postType: $postType
        mainCategory: { slug: $categorySlug }
        slug_not_in: $excludeSlugs
        ${!isPreviewBranch() ? 'publishDate_lte: $currentISODate' : ''}
      }
    ) {
      items {
        ...PostPageContent
      }
    }
  }
  ${PostPageContentFragment}
`

export default createQueryComponent(GET_IS_POST)
