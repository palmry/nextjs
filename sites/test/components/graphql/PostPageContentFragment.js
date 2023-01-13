import gql from 'graphql-tag'

export default gql`
  fragment PostPageContent on Post {
    sys {
      id
      firstPublishedAt
      publishedAt
    }
    postType
    title
    content
    slug
    tags
    internalTags
    updatedDate
    publishDate
    hidePublishDate
    videoId
    canonicalLink
    summaryTitle
    summaryBulletedList
    socialTitle
    socialDescription
    seoTitle
    seoDescription
    safeForAdvertiser
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
    squareCroppingPreference
    shoppable
    disclaimer
    hideGallerySlideCountNumbers
    recommendedPostsCollection {
      items {
        title
        slug
        mainCategory {
          slug
        }
        squareCroppingPreference
        featuredImage {
          title
          url
          description
        }
      }
    }
    mainCategory {
      slug
      title
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
    }
    relatedCategoriesCollection {
      items {
        slug
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
      }
    }
    intentionTag
    displayCategory {
      slug
    }
    multipleSeriesCollection(limit: 10) {
      items {
        sys {
          id
        }
        title
        slug
        contentNavigation {
          name
          navigationType
          itemsCollection {
            items {
              sys {
                id
              }
              title
              thumbnail {
                url
              }
              post {
                sys {
                  id
                }
                title
                slug
                mainCategory {
                  slug
                }
                featuredImage {
                  url
                  title
                }
              }
            }
          }
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
      }
    }
    featuredImage {
      title
      url
      description
      width
      height
    }
    socialImage {
      title
      url
      description
      width
      height
    }
    authorsCollection {
      items {
        slug
        name
        description
        content
        twitterUrl
        facebookUrl
        pinterestUrl
        instagramUrl
        status
        image {
          title
          url
          description
        }
      }
    }
    gallerySlidesCollection {
      items {
        __typename
        ... on ProductSlide {
          slug
          title
          hideTitle
          content
          priceType
          price
          priceRange
          storeName
          productLink
          image {
            title
            url
            description
          }
          embedImage
        }
        ... on MediaSlide {
          slug
          title
          hideTitle
          titleUrl
          content
          image {
            title
            url
            description
          }
          embedImage
        }
      }
    }
  }
`
