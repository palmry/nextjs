import React, { useContext } from 'react'
import styled from 'styled-components'
import { DetectDeviceContext } from 'wsc/components/context/DetectDeviceProvider'
import { MEDIA, COLORS } from '../../utils/styles'
import Link from 'wsc/components/Link'

const ScProductLink = styled(Link)`
  border: none;
  color: ${COLORS.WHITE};

  ${MEDIA.DESKTOP`
    &:hover {
      color: ${COLORS.LT_SUN_YELLOW};
    }
  `}

  &:active {
    color: ${COLORS.LT_DARK_SUN_YELLOW};
  }
`

const ScProductDiv = styled.div`
  text-align: center;
  margin-top: 24px;

  ${MEDIA.DESKTOP`
    text-align: left;
    margin-top: 0px;
  `}
  ${(props) => props.order && `order: ${props.order};`}
`

/*----------------------------------------------------------------------------------
 *  RENDER PHASE
 *---------------------------------------------------------------------------------*/

const FooterProduct = () => {
  const { isTablet, isDesktop } = () => useContext(DetectDeviceContext)
  // Need to define CONTACT_LIST here for using isMobile function
  const PRODUCT_LIST = [
    {
      label: 'LITTLETHINGS',
      url: 'https://littlethings.com/',
      tail: ' — ',
    },
    {
      label: 'CAFEMOM',
      url: 'https://cafemom.com/',
      tail: isTablet || isDesktop ? ' — ' : <br />,
    },
    {
      label: 'MAMÁSLATINAS',
      url: 'https://mamaslatinas.com/',
      tail: ' — ',
    },
    {
      label: 'MOM.COM',
      url: 'https://mom.com',
      tail: '',
    },
  ]

  const productLink = PRODUCT_LIST.reduce((result, product) => {
    result.push(
      <React.Fragment key={`product-${product.label}`}>
        <ScProductLink to={product.url}>{product.label}</ScProductLink>
        {product.tail}
      </React.Fragment>
    )

    return result
  }, [])

  return <ScProductDiv order={isDesktop ? 3 : 4}>{productLink}</ScProductDiv>
}

FooterProduct.propTypes = {}

FooterProduct.defaultProps = {}

export default FooterProduct
