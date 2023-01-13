import { getConfig } from '../globalConfig'

const { COLORS } = getConfig('StyleConfig')

export const withButton = `
  color: var(--withButton_Color, ${COLORS.WHITE});
  background-color: var(--withButton_BackgroundColor, ${COLORS.LIGHT_BLUE});
  border: var(--withButton_Border, none);
  svg { fill: var(--withButton_SvgFill, ${COLORS.WHITE}); }

  &:hover {
    color: var(--withButton_HoverColor, ${COLORS.WHITE});
    background-color: var(--withButton_HoverBackgroundColor, ${COLORS.WARM_YELLOW});
    border: var(--withButton_HoverBorder, none);
    svg { fill: var(--withButton_HoverSvgFill, ${COLORS.WHITE}); }
  }

  &:active {
    color: var(--withButton_ActiveColor, ${COLORS.WHITE});
    background-color: var(--withButton_ActiveBackgroundColor, ${COLORS.DARKER_YELLOW});
    border: var(--withButton_ActiveBorder, none);
    svg { fill: var(--withButton_ActiveSvgFill, ${COLORS.WHITE}); }
  }
`
