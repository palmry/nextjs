import React, { useState, useEffect, useContext } from 'react'
import styled from 'styled-components'
import CloseIcon from '../statics/images/icon-close.svg'
import Logo from '../statics/images/logo-lt-symbol.svg'
import { FONT_FAMILIES, MEDIA, COLORS } from '../utils/styles'
import SubscribeForm from './SubscribeForm'
import { SubmitButton } from './button/SubmitButton'
import { withCookies } from 'react-cookie'
import { getFpv } from 'wsc/utils/fpv'
import { CSSTransition } from 'react-transition-group'
import SubscribePopupStyle from './styled/SubscribePopupStyle'
import {
  getActiveCategory,
  getActiveSubCategory,
} from 'wsc/utils/activeCategory'
import Link from 'wsc/components/Link'
import { calculatePregnancyWeek } from 'wsc/utils/forms'
import {
  listSubscribe,
  getAndUpdateContact,
  createCustomFieldObject,
} from 'wsc/utils/getResponseAPI'
import { sendGaEvent, parentalStatusVariable } from 'wsc/utils/googleTagManager'
import { DetectDeviceContext } from 'wsc/components/context/DetectDeviceProvider'
import Modal from '@material-ui/core/Modal'
import Backdrop from '@material-ui/core/Backdrop'

const popupWidth = '352px'
const popupMaxWidthForMobile = '320px'
const popupHeight = '80vh'
const popupHeightForMobile = '90vh'
const popupMaxHeight = '658px'
const popupZIndex = 10002

// const ScIconMenu = styled((props) => <IconMenu {...restProps} />)``

const ScModal = styled((props) => <Modal {...restProps} />)`
  z-index: ${popupZIndex} !important;
  && > div:nth-child(2) {
    outline: 0;
  }
`
const ScBackdrop = styled((props) => <Backdrop {...restProps} />)`
  && {
    transition: opacity 299ms cubic-bezier(0, 0, 0.6, 1) 0ms !important;
  }
`
const ScWrapper = styled.div`
  position: fixed;
  z-index: ${popupZIndex};
  bottom: 20px;
  left: 20px
  width: ${popupWidth};
  height: ${popupHeight};
  max-height: ${popupMaxHeight};
  background-color: ${COLORS.LT_HOSPITAL_GREEN};
  ${MEDIA.MOBILE`
    width: 100%;
    max-width: ${popupMaxWidthForMobile};
    height: ${popupHeightForMobile};
    top: 50%;
    left: 50%;
    -ms-transform: translate(-50%, -50%);
    transform: translate(-50%, -50%);
  `}
  overflow-y: scroll;
  &::-webkit-scrollbar {
    width: 4px;
  }
  &::-webkit-scrollbar-thumb {
    background: ${COLORS.LT_LIGHT_GRAY};
    border-radius: 2px;
  }
  &::-webkit-scrollbar-thumb:hover, 
  &::-webkit-scrollbar-thumb:active {
    background: ${COLORS.LT_SUN_YELLOW};
  }
`
const ScCloseIcon = styled((props) => <CloseIcon {...restProps} />)`
  height: 15px;
  width: 15px;
  position: sticky;
  top: 12px;
  left: calc(100% - 23px);
  display: block
  fill: white;
  &:hover {
    cursor: pointer;
  }
`
const ScContainer = styled.div`
  font-family: ${FONT_FAMILIES.POPPINS};
  padding: 40px 24px 18px;
  color: white;
  position: absolute;
`
const ScLogo = styled((props) => <Logo {...restProps} />)`
  display: block
  margin: 0 auto 12px;
  height: 32px;
  width: 52.6px;
`
const ScHeader = styled.div`
  text-align: center;
  font-weight: bold;
  font-size: 1.25rem;
  line-height: 1.35;
  margin-bottom: 8px;
  ${MEDIA.TABLET`
    font-size: 1.18rem;
    line-height: 1.4;
  `}
  ${MEDIA.MOBILE`
    font-size: 1.12rem;
    line-height: 1.4;
  `}
`
const ScBody = styled.div`
  text-align: center;
  font-size: 1.25rem;
  line-height: 1.35;
  margin-bottom: 8px;
  ${MEDIA.TABLET`
    font-size: 1.18rem;
    line-height: 1.4;
  `}
  ${MEDIA.MOBILE`
    font-size: 1.12rem;
    line-height: 1.4;
  `}
`
const ScPrivacy = styled.div`
  text-align: center;
  font-size: 0.75rem;
  letter-spacing: 0.72px;
`
const ScLink = styled((props) => <Link {...restProps} />)`
  border: none;
  color: ${COLORS.WHITE};
  text-decoration: underline;
`
const ScCloseTextWrapper = styled((props) => <ScPrivacy {...restProps} />)`
  margin-top: 10px;
`
const ScCloseText = styled.div`
  display: inline;
  text-decoration: underline;
  &:hover {
    cursor: pointer;
  }
`
const ScLabel = styled.div`
  font-family: ${FONT_FAMILIES.POPPINS};
  font-weight: bold;
  margin-bottom: 8px;
  font-size: 0.93rem;
  line-height: 1.4;
  ${MEDIA.MOBILE`
    font-size: 1rem;
  `};
`
const ScSubmitButton = styled((props) => <SubmitButton {...restProps} />)`
  margin-bottom: 10px;
  text-align: center;
  height: 50px;
  width: 120px;
  font-weight: 600;
  ${MEDIA.TABLET`
    width: 120px;
  `}
  ${MEDIA.DESKTOP`
    height: 50px;
  `}
`
export let SetPageviewCountGlobal = null

/*----------------------------------------------------------------------------------
 *  RENDER PHASE
 *---------------------------------------------------------------------------------*/

const SubscribePopup = ({ cookies }) => {
  const [isHideSubscribePopup, setIsHideSubscribePopup] = useState(true)
  const [pageviewCount, setPageviewCount] = useState(getFpv())
  const { isMobile } = useContext(DetectDeviceContext)
  const ignorePage = ['/', '/newsletter']

  SetPageviewCountGlobal = (counter) => {
    setPageviewCount(counter)
  }

  useEffect(() => {
    if (
      pageviewCount > 5 &&
      cookies.get('HideSubscribePopup') !== 'true' &&
      !ignorePage.includes(window.location.pathname)
    ) {
      setIsHideSubscribePopup(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cookies, pageviewCount])

  useEffect(() => {
    if (!isHideSubscribePopup)
      sendGaEvent({ eventName: 'newsletterCapture', formType: 'popup' })
  }, [isHideSubscribePopup])

  const closePopup = () => {
    // set cookie with expires after 7 days (604800 seconds)
    cookies.set('HideSubscribePopup', true, { path: '/', maxAge: 604800 })
    setIsHideSubscribePopup(true)
  }

  const submitHandler = async (values) => {
    let email = values.email
    let pregnancyWeek = values.dueDate && calculatePregnancyWeek(values.dueDate)
    let customFields = [
      createCustomFieldObject('main_category', getActiveCategory()),
      createCustomFieldObject('related_category', getActiveSubCategory()),
      createCustomFieldObject(
        'parental_status_checkboxes',
        values.parentalStatus
      ),
      createCustomFieldObject('due_date', values.dueDate),
      createCustomFieldObject('pregnancy_week', pregnancyWeek),
      createCustomFieldObject('birthdate', values.birthdate),
    ]
    setIsHideSubscribePopup(true)
    try {
      await listSubscribe(null, email, customFields)
    } catch (error) {
      if (
        error?.response?.data?.httpStatus === 409 &&
        error?.response?.data?.code === 1008
      ) {
        // Contact already added
        try {
          await getAndUpdateContact(null, email, customFields)
        } catch (error) {
          console.error(
            error?.response?.data?.message || error?.message || `${error}`
          )
          return
        }
      } else {
        console.error(
          error?.response?.data?.message || error?.message || `${error}`
        )
        return
      }
    }

    // send GA event after subscribe successfully only
    sendGaEvent({
      eventName: 'newsletterSubscribe',
      formType: 'popup',
      ...parentalStatusVariable(values.parentalStatus),
    })

    // set cookie without expires
    cookies.set('HideSubscribePopup', true, { path: '/' })
  }

  const popupContent = (
    <ScWrapper onClose={() => setIsHideSubscribePopup(true)}>
      <ScContainer>
        <ScLogo />
        <ScHeader>WANT MORE STORIES?</ScHeader>
        <ScBody>Get the best of LittleThings delivered to you weekly!</ScBody>
        <SubscribeForm
          onSubmit={submitHandler}
          scLabel={ScLabel}
          scSubmitButton={ScSubmitButton}
          submitButtonLabel="SUBMIT"
          submitButtonWithArrow={false}
        />
        <ScPrivacy>
          {'View our '}
          <ScLink to={'https://www.wildskymedia.com/privacy-policy/'}>
            {'Privacy Policy'}
          </ScLink>
        </ScPrivacy>
        <ScCloseTextWrapper>
          <ScCloseText onClick={closePopup}>Close</ScCloseText>
        </ScCloseTextWrapper>
      </ScContainer>
      <ScCloseIcon
        onClick={() => {
          closePopup()
        }}
      />
    </ScWrapper>
  )

  return (
    <React.Fragment>
      <SubscribePopupStyle />
      <CSSTransition
        in={
          !isHideSubscribePopup &&
          !ignorePage.includes(window.location.pathname)
        }
        timeout={300}
        classNames="subscribe"
        unmountOnExit
      >
        {isMobile ? (
          <ScModal
            open={!isHideSubscribePopup}
            onClose={closePopup}
            closeAfterTransition
            BackdropComponent={ScBackdrop}
          >
            {popupContent}
          </ScModal>
        ) : (
          popupContent
        )}
      </CSSTransition>
    </React.Fragment>
  )
}

SubscribePopup.propTypes = {}

SubscribePopup.defaultProps = {}

export default withCookies(SubscribePopup)
