import get from "lodash/get"
import isEmpty from "lodash/isEmpty"
import React, { useEffect, useContext } from "react"
import styled from "styled-components"
import PropTypes from "prop-types"
import { DetectDeviceContext } from "wsc/components/context/DetectDeviceProvider"

import Layout from "../Layout"
import DocumentHead from "../DocumentHead"
import ModelHeader from "../ModelHeader"

import { MEDIA, withButton, FONT_FAMILIES } from "../../utils/styles"
import styleConfig from "../../configs/style"

import AdProviderWrapper, { ScAdSlotLeader } from "../AdProviderWrapper"
import { AdSlot } from "wildsky-components"
import {
  setActiveCategory,
  setActiveSubCategory,
  clearAllActiveCategory,
} from "wsc/utils/activeCategory"
import AdFooter from "wsc/components/AdFooter"
import CategoryPosts from "./CategoryPosts"
import { DefaultButton } from "../button/DefaultButton"
import routes from "../../configs/routes"
import { useTranslator } from "../../hooks/useTranslator"
import { getDocumentHeadKey } from "wsc/utils/common"
import { getConfig } from "wsc/globalConfig"

const APP_CONFIGS = getConfig("AppConfig")

const { COLORS } = styleConfig

const ScWrapper = styled.div`
  ${MEDIA.DESKTOP`margin: 40px 0 50px;`}
  ${MEDIA.TABLET`margin: 30px 0 40px;`}
  ${MEDIA.MOBILE`margin: 24px 0 30px;`}
`
const ScRelatedCategoriesSection = styled.div`
  margin-top: 40px;
  ${MEDIA.DESKTOP`
    margin-top: 59px;
    padding 0 120px;
  `}
`
const ScCategoryFlex = styled.div`
  ${MEDIA.DESKTOP`margin: -9px -8px;`}
  ${MEDIA.TABLET`margin: -8px;`}
  ${MEDIA.MOBILE`margin: -7px;`}
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  align-content: space-between;
`

const ScCategoryButton = styled(({ isActive, ...restProps }) => (
  <DefaultButton {...restProps} />
)).attrs({ className: "withButtonDark" })`
  ${withButton}
  ${MEDIA.DESKTOP`
    margin: 9px 8px;
    height: 2rem;
    padding: 0 1.88rem;
  `}
  ${MEDIA.TABLET`
    margin: 8px;
    height: 2.06rem;
    padding: 0 1.88rem;
  `}
  ${MEDIA.MOBILE`
    margin: 7px;
    height: 1.88rem;
    padding: 0 1.25rem;
  `}
  position: relative;

  justify-content: space-between;
  width: max-content;
`
const ScCategoryTitle = styled.h4`
  font-size: 0.75rem;
  letter-spacing: 0.72px;
  font-family: ${FONT_FAMILIES.POPPINS};
  ${MEDIA.DESKTOP`
    font-size: 0.69rem;
    letter-spacing: 0.66px;
  `}

  color: ${COLORS.WHITE};
  text-transform: uppercase;
  font-weight: 600;
`

/*----------------------------------------------------------------------------------
 *  RENDER PHASE
 *---------------------------------------------------------------------------------*/

const CategoryPage = ({ category }) => {
  const { isMobile, isDesktop } = useContext(DetectDeviceContext)
  const { locale } = useTranslator()

  //the credit will be displayed only if bannerImage is not null
  const credit = get(category, "bannerImage.description")

  // TODO: Reactor the sponsorship targeting code here, SeriesPage and PostPage
  const sponsor = category.sponsor

  const slotConfig = {
    targeting: { category: category.slug },
  }
  if (sponsor !== null)
    slotConfig.targeting = { ...slotConfig.targeting, sponsored: sponsor.name }

  const slotList = !isMobile
    ? [["leader", slotConfig]]
    : [
        ["leader", slotConfig],
        ["footer", slotConfig],
      ]

  const relatedCategories = Object.values(category.subcategoriesCollection)

  useEffect(() => {
    if (category.isPrimaryCategory) {
      setActiveCategory(get(category, "title", ""))
    } else {
      setActiveCategory(get(category, "parentCategory.title", ""))
      setActiveSubCategory(get(category, "title", ""))
    }
    return () => {
      clearAllActiveCategory()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category])

  // check that we should add class noskimlinks to this category or not
  let noskimlinks = false
  const allCategoriesSlug = [get(category, "slug")]
  if (!category.isPrimaryCategory) {
    allCategoriesSlug.push(get(category, "parentCategory.slug")) // also include their main category
  }

  for (let excludeCategorySlug of APP_CONFIGS.noSkimlinksForTheseCategorySlugs ||
    []) {
    if (allCategoriesSlug.includes(excludeCategorySlug)) {
      noskimlinks = true
      break
    }
  }

  return (
    <Layout>
      <DocumentHead
        key={getDocumentHeadKey(locale, category.slug)}
        title={category.title}
        seoTitle={category.seoTitle}
        seoDescription={category.seoDescription}
        ogType="article"
      />
      <AdProviderWrapper slotList={slotList} reset={category.slug}>
        <ScAdSlotLeader marginTop={isDesktop ? "50px" : "40px"}>
          <AdSlot au3="leader" />
        </ScAdSlotLeader>

        <ScWrapper className={noskimlinks && "noskimlinks"}>
          <ModelHeader
            title={category.title}
            description={category.content}
            image={category.bannerImage}
            sponsor={sponsor}
            credit={credit}
          />

          {!isEmpty(relatedCategories) && (
            <ScRelatedCategoriesSection>
              <ScCategoryFlex>
                {relatedCategories.map((relatedCategory) => {
                  return (
                    <ScCategoryButton
                      key={relatedCategory["title"]}
                      data-slug={relatedCategory["slug"]}
                      to={routes.category.pathResolver(relatedCategory["slug"])}
                    >
                      <ScCategoryTitle>
                        {relatedCategory["title"]}
                      </ScCategoryTitle>
                    </ScCategoryButton>
                  )
                })}
              </ScCategoryFlex>
            </ScRelatedCategoriesSection>
          )}

          <CategoryPosts src="CONTENTFUL" category={category} />
        </ScWrapper>

        <AdFooter />
      </AdProviderWrapper>
    </Layout>
  )
}

CategoryPage.propTypes = {
  category: PropTypes.shape({
    title: PropTypes.string,
    description: PropTypes.string,
    image: PropTypes.object,
    credit: PropTypes.string,
  }),
}

CategoryPage.defaultProps = {
  category: {},
}

export default CategoryPage
