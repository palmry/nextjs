import { createGlobalStyle } from "styled-components"
import defaultGlobalStyle from "wsc/defaultGlobalStyle"
import { COLORS, FONT_FAMILIES, MEDIA } from "../../utils/styles"

const GlobalStyle = createGlobalStyle`
  ${defaultGlobalStyle}
  * {
    box-sizing: border-box;
    word-break: break-word;
    margin: 0;
    padding: 0;
  }

  html {
    -webkit-text-size-adjust: 100%; /* Prevent font scaling in landscape while allowing user zoom */
  }

  body {
    /** Ad callouts */
    --adCalloutFontFamily: 'OpenSans', sans-serif;
    --adCalloutFontSize: 12px;

    /** Social Button */
    --socialButton_CircleColor: ${COLORS.LT_DARK_GREY_BLUE};
    --socialButton_CircleHoverColor: ${COLORS.LT_SUN_YELLOW};
    --socialButton_CircleActiveColor: ${COLORS.LT_DARK_SUN_YELLOW};
    --socialButton_NoBgColor: ${COLORS.WHITE};
    --socialButton_NoBgHoverColor: ${COLORS.WARM_YELLOW};
    --socialButton_NoBgActiveColor: ${COLORS.DARKER_YELLOW};

    /** withImageBoxShadow */
    --withImageBoxShadow_boxShadowColor: ${COLORS.LT_HOSPITAL_GREEN}; 

    /** withButton */
    --withButton_BackgroundColor: ${COLORS.LT_DARK_PEACH};
    --withButton_HoverBackgroundColor: ${COLORS.LT_SUN_YELLOW};
    --withButton_ActiveBackgroundColor: ${COLORS.LT_DARK_SUN_YELLOW};

    /** inputBoxDefault */
    --inputBoxDefault_borderColor: ${COLORS.LT_VERY_LIGHT_GRAY};
    --inputBoxValid_borderColor: ${COLORS.LT_AQUA_MARINE};
    --inputBoxFocus_borderColor: ${COLORS.LT_DARK_GREY_BLUE};
    --inputBoxError_color: ${COLORS.LT_DARK_ORANGE};

    /** MUI */
    --checkbox_Color: ${COLORS.LT_DARK_GREY_BLUE};
    --selectedListItem_BgColor: ${COLORS.LT_DARK_GREY_BLUE_08};
    --chip_BgColor: ${COLORS.LT_LIGHT_GREEN};
    --touchRipple_BgColor: ${COLORS.LT_DARK_GREY_BLUE};

    /** defaultPlaceholder */
    --defaultPlaceholder_color: ${COLORS.GREY};

    /** Link */
    --defaultLinkStyle_Color: ${COLORS.BLACK};
    --defaultLinkStyle_BorderBottomColor: ${COLORS.LT_SUN_YELLOW};

    /* ContentMarkdown */
    --contentMarkdown_figureCaption_color: ${COLORS.GREY};
    --contentMarkdown_figureContainer_linkBackgroundColor: ${
      COLORS.LT_SUN_YELLOW
    };
    --contentMarkdown_figureContainer_linkHoverBefore_opacity: 0.3;
    --contentMarkdown_startQuoteContainer_display: none;
    --contentMarkdown_endQuoteContainer_display: none;
    --contentMarkdown_iconTwitterFillColor: ${COLORS.LT_DARK_GREY_BLUE};
    --contentMarkdown_quoteShareText_borderBottom: 0.125rem solid ${
      COLORS.LT_SUN_YELLOW
    };
  }

  body, .font-body, .font-body-serif {
    word-break: break-word;
    color: ${COLORS.BLACK};
    font-size: 1.13rem;
    line-height: 1.7;

    ${MEDIA.TABLET`font-size: 1.19rem;`}
    ${MEDIA.DESKTOP`font-size: 1.25rem;`}
  }

  body, .font-body {
    font-family: ${FONT_FAMILIES.POPPINS};
  }

  .font-body-serif {
    font-family: ${FONT_FAMILIES.SERIF};
  }

  h1, h2, h3, h4, .font-h1, .font-h2, .font-h3, .font-h4 {
    font-family: ${FONT_FAMILIES.ASAP};
    color: ${COLORS.BLACK};
  }

  h1, .font-h1 {
    font-weight: bold;
    font-size: 1.63rem;
    line-height: 1.33;

    ${MEDIA.TABLET`font-size: 2.31rem;`}
    ${MEDIA.DESKTOP`font-size: 2.94rem;`}
  }

  h2, .font-h2 {
    font-weight: 600;
    font-size: 1.44rem;
    line-height: 1.33;

    ${MEDIA.TABLET`font-size: 1.88rem;`}
    ${MEDIA.DESKTOP`font-size: 2.19rem;`}
  }

  h3, .font-h3 {
    font-weight: 600;
    font-size: 1.25rem;
    line-height: 1.6;

    ${MEDIA.TABLET`font-size: 1.5rem;`}
    ${MEDIA.DESKTOP`font-size: 1.69rem;`}
  }

  h4, .font-h4 {
    font-weight: bold;
    font-size: 1.13rem;
    line-height: 1.7;

    ${MEDIA.TABLET`font-size: 1.19rem;`}
    ${MEDIA.DESKTOP`font-size: 1.25rem;`}
  }

  blockquote {
    font-family: ${FONT_FAMILIES.ASAP};
    font-size: 1.88rem;
    font-style: italic;
    color: ${COLORS.BLACK};
    line-height: 1.6;

    ${MEDIA.MOBILE`font-size: 1.44rem;`}
  }

  hr {
    border: none;
    height: 0.0625rem;
    background-color: ${COLORS.GRAY};
  }

  .font-small-body {
    font-size: 1rem;
    line-height: 1.7;

    ${MEDIA.TABLET`font-size: 0.95rem`}
    ${MEDIA.DESKTOP`font-size: 0.94rem`}
  }

  .font-description {
    /* font size and line-height style based on 'Description' style in style guide */
    font-family: ${FONT_FAMILIES.POPPINS};
    font-size: 0.75rem;
    line-height: 1.7;

    ${MEDIA.TABLET`font-size: 0.75rem;`}
    ${MEDIA.DESKTOP`font-size: 0.69rem;`}
  }

  .font-section-header-1 {
    font-family: ${FONT_FAMILIES.POPPINS};
    font-weight: normal;
    font-size: 1.44rem;
    line-height: 1.33;

    ${MEDIA.TABLET`font-size: 1.88rem;`}
    ${MEDIA.DESKTOP`font-size: 2.19rem;`}
  }

  .font-section-header-2 {
    font-family: ${FONT_FAMILIES.POPPINS};
    font-weight: normal;
    font-size: 1.13rem;
    line-height: 1.7;

    ${MEDIA.TABLET`font-size: 1.19rem;`}
    ${MEDIA.DESKTOP`font-size: 1.25rem;`}
  }


  /* TODO: Fix these fonts according to updated style-guide */
  .font-button-title {
    font-size: 1.8em;
  }

  .font-button-subtitle {
    font-weight: bold;
    font-size: 0.86rem;

    ${MEDIA.TABLET`font-size: 0.71rem;`}
    ${MEDIA.DESKTOP`font-size: 0.79rem;`}
  }

  .font-button {
    font-family: ${FONT_FAMILIES.POPPINS};
    line-height: 1.59;
    font-size: 0.94rem;
  }

  /* -------------------------------------------------------- */
  /* Below are a custom CSS className used for override a global style of all needed components
  /* -------------------------------------------------------- */

  .h4-parenting-title {
    ${MEDIA.DESKTOP`
    font-size: 1rem;
    line-height: 1.38;
    svg {
      width: 13px; 
      height: 13px;
    }`}
  }

  .suggested-title {
    ${MEDIA.DESKTOP`font-size: 0.94rem;`}
    ${MEDIA.TABLET`font-size: 0.95rem;`}
    ${MEDIA.MOBILE`font-size: 1rem;`}
    font-weight: bold;
    font-family: ${FONT_FAMILIES.ASAP} !important;
    line-height: 1.7;
  }

  /* --------------------------------------------------------- */
  /* Overrides for wsc defaults */
  /* --------------------------------------------------------- */
  
  .HomeTopFeaturedMainSection {
    --withImageBoxShadow_boxShadowColor: ${COLORS.LT_SUN_YELLOW};
  }

  .HomeTopFeaturedSubSection {
    --withImageBoxShadow_boxShadowColor: ${COLORS.LT_DARK_GREY_BLUE};
  }
  
  .AuthorImage {
    --withImageBoxShadow_boxShadowColor: ${COLORS.LT_SUN_YELLOW};
  }

  .AuthorIndexImage {
    --withImageBoxShadow_boxShadowColor: ${COLORS.LT_DARK_GREY_BLUE};
  }

  .JwPlayer {
    --withImageBoxShadow_boxShadowColor: ${COLORS.LT_SUN_YELLOW};
    --withImageBoxShadow_boxShadowLength: 10px;
  }

  .SuggestedPosts {
    --withImageBoxShadow_boxShadowColor: ${COLORS.LT_DARK_GREEN};
  }

  .withButtonOutlined {
    --withButton_Color: ${COLORS.LT_DARK_GREY_BLUE};
    --withButton_Border: 1px solid ${COLORS.LT_DARK_GREY_BLUE};
    --withButton_SvgFill: ${COLORS.LT_DARK_GREY_BLUE};
        
    --withButton_HoverBackgroundColor: ${COLORS.LT_DARK_GREY_BLUE};
    --withButton_HoverBorder: 1px solid ${COLORS.LT_DARK_GREY_BLUE};
    
    --withButton_ActiveBackgroundColor: ${COLORS.LT_DARK_BLUE};
    --withButton_ActiveBorder: 1px solid ${COLORS.LT_DARK_BLUE};
  }

  .withButtonDark {
    --withButton_BackgroundColor: ${COLORS.LT_DARK_GREY_BLUE};
  }

  .WebinarButton {
    --withButton_BackgroundColor: ${COLORS.LT_HOSPITAL_GREEN};
    --withButton_HoverBackgroundColor: ${COLORS.LT_SUN_YELLOW};
    --withButton_ActiveBackgroundColor: ${COLORS.LT_DARK_SUN_YELLOW};
  }

  .ValentineButton {
    --withButton_BackgroundColor: ${COLORS.VALENTINE_PINK};
    --withButton_Color: ${COLORS.VALENTINE_DARK_PINK};
    --withButton_HoverBackgroundColor: ${COLORS.WHITE};
    --withButton_HoverColor: ${COLORS.VALENTINE_DARK_PINK};
    --withButton_ActiveBackgroundColor: ${COLORS.WHITE};
    --withButton_ActiveColor: ${COLORS.VALENTINE_DARK_PINK};
  }

  .MothersDayButton {
    --withButton_BackgroundColor: ${COLORS.MOTHERS_DAY_GREEN};
    --withButton_HoverBackgroundColor: ${COLORS.MOTHERS_DAY_DARK_PINK};
    --withButton_ActiveBackgroundColor: ${COLORS.MOTHERS_DAY_PINK};
  }

  .FathersDayButton {
    --withButton_BackgroundColor: ${COLORS.FATHERS_DAY_BLUE};
    --withButton_HoverBackgroundColor: ${COLORS.FATHERS_DAY_YELLOW};
    --withButton_ActiveBackgroundColor: ${COLORS.FATHERS_DAY_ORANGE};
  }

  .FirstDayOfSchoolButton {
    --withButton_BackgroundColor: ${COLORS.SCHOOL_DAY_PINK};
    --withButton_HoverBackgroundColor: ${COLORS.SCHOOL_DAY_ORANGE};
    --withButton_ActiveBackgroundColor: ${COLORS.SCHOOL_DAY_GREEN};
    --withButton_Color: ${COLORS.BLACK};
    --withButton_HoverColor: ${COLORS.BLACK};
    --withButton_ActiveColor: ${COLORS.BLACK};
    --withButton_Border: 1px solid ${COLORS.BLACK};
    --withButton_HoverBorder: 1px solid ${COLORS.BLACK};
    --withButton_ActiveBorder: 1px solid ${COLORS.BLACK};
  }

  .HalloweenButton {
    --withButton_BackgroundColor: ${COLORS.HALLOWEEN_GREEN};
    --withButton_HoverBackgroundColor: ${COLORS.HALLOWEEN_SOFT_GREEN};
    --withButton_ActiveBackgroundColor: ${COLORS.HALLOWEEN_PINK};
    --withButton_Color: ${COLORS.BLACK};
    --withButton_HoverColor: ${COLORS.BLACK};
    --withButton_ActiveColor: ${COLORS.BLACK};
    --withButton_Border: 1px solid ${COLORS.BLACK};
    --withButton_HoverBorder: 1px solid ${COLORS.BLACK};
    --withButton_ActiveBorder: 1px solid ${COLORS.BLACK};
  }

  .ThanksgivingButton {
    --withButton_BackgroundColor: ${COLORS.THANKSGIVING_ORANGE};
    --withButton_HoverBackgroundColor: ${COLORS.THANKSGIVING_DARK_ORANGE};
    --withButton_ActiveBackgroundColor: ${COLORS.THANKSGIVING_SOFT_ORANGE};
    --withButton_Color: ${COLORS.BLACK};
    --withButton_HoverColor: ${COLORS.BLACK};
    --withButton_ActiveColor: ${COLORS.BLACK};
  }

  .HolidayButton {
    --withButton_BackgroundColor: ${COLORS.HOLIDAY_DARK_ORANGE};
    --withButton_HoverBackgroundColor: ${COLORS.HOLIDAY_ORANGE};
    --withButton_ActiveBackgroundColor: ${COLORS.HOLIDAY_ORANGE};
    --withButton_Color: ${COLORS.WHITE};
    --withButton_HoverColor: ${COLORS.WHITE};
    --withButton_ActiveColor: ${COLORS.WHITE};
  }

  /** Button Action */
  .buttonAction {
    --withButton_BackgroundColor: ${COLORS.LT_DARK_GREY_BLUE};
    --buttonAction_FontFamily: ${FONT_FAMILIES.POPPINS};
    --buttonAction_FontWeight: 500;
    --buttonAction_Height: 50px;
  }
`

export default GlobalStyle
