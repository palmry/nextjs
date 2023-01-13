import { css } from "styled-components"
import { getConfig } from "./globalConfig"
import { MEDIA, rgba } from "./styleUtils"

const { COLORS } = getConfig("StyleConfig")

const defaultGlobalStyle = css`
  .HomeTopFeaturedMainSection {
    --withImageBoxShadow_boxShadowLength: 15px;
    ${MEDIA.TABLET`--withImageBoxShadow_boxShadowLength: 18px;`}
    ${MEDIA.DESKTOP`--withImageBoxShadow_boxShadowLength: 20px;`}
  }

  .HomeTopFeaturedSubSection {
    --withImageBoxShadow_boxShadowLength: 5px;
    ${MEDIA.TABLET`--withImageBoxShadow_boxShadowLength: 8px;`}
    ${MEDIA.DESKTOP`--withImageBoxShadow_boxShadowLength: 6px;`}
  }

  .AuthorImage {
    --withImageBoxShadow_boxShadowLength: 10px;
  }

  .AuthorIndexImage {
    --withImageBoxShadow_boxShadowLength: 10px;
  }

  .PostHeader .AuthorImage {
    --withImageBoxShadow_boxShadowLength: 5px;
  }

  .SuggestedPosts {
    --withImageBoxShadow_boxShadowLength: 5px;
  }

  .BrandedContent {
    --withImageBoxShadow_boxShadowLength: 8px;
  }

  /* -------------------------------------------------------- */
  /* Button styles
  /* -------------------------------------------------------- */

  .withButtonOutlined {
    --withButton_Color: ${COLORS.LIGHT_BLUE};
    --withButton_BackgroundColor: ${COLORS.WHITE};
    --withButton_Border: 1px solid ${COLORS.LIGHT_BLUE};
    --withButtonSvgFill: ${COLORS.LIGHT_BLUE}

    --withButton_HoverBackgroundColor: ${COLORS.LIGHT_BLUE};
    --withButton_HoverBorder: 1px solid ${COLORS.LIGHT_BLUE};

    --withButton_ActiveBackgroundColor: ${COLORS.DARK_BLUE};
    --withButton_ActiveBorder: 1px solid ${COLORS.DARK_BLUE};
  }

  .withButtonLight {
    --withButton_BackgroundColor: transparent;
    --withButton_Border: 1px solid ${COLORS.WHITE};
    
    --withButton_HoverBackgroundColor: ${rgba(COLORS.WHITE, "0.3")};
    
    --withButton_ActiveBackgroundColor: ${rgba(COLORS.WHITE, "0.7")};
  }
`

export default defaultGlobalStyle
