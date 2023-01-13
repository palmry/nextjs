import React, { useEffect } from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import ReactJWPlayer from 'react-jw-player'
import { generateVastUrl } from 'wsc/utils/generateVastUrl'
import { detectDeviceType } from 'wsc/utils/detectDeviceType'
import { videoAdUnit, executeVideoAuction } from 'wsc/videoAdAuction'

import { sendGaEvent } from 'wsc/utils/googleTagManager'

import get from 'lodash/get'

import { FONT_FAMILIES, COLORS } from '../utils/styles'
import ICON_PLAY_BUTTON from '../statics/images/icon-play-button.svg'

const PLAYER_SKIN_NAME = 'momcom-player-skin'
const PLAYER_SKIN = {
  name: PLAYER_SKIN_NAME,
  active: 'white',
  inactive: 'white',
  background: 'transparent',
}

const deviceType = () => {
  const { isMobile, isTablet } = detectDeviceType()
  return isMobile ? 'mobile' : isTablet ? 'tablet' : 'desktop'
}

const ScReactJWPlayer = styled(ReactJWPlayer)`
  //=======================================================
  // Style for JW player
  //=======================================================

  & .jwplayer.jw-skin-${PLAYER_SKIN_NAME} {
    // set font icons
    .jw-icon {
      font-family: ${FONT_FAMILIES.JWPLAYER};
    }

    // set font style of text in jw-controlbar
    .jw-icon.jw-text {
      font-family: ${FONT_FAMILIES.SANSSERIF};
      word-break: normal; // to avoid unintentionally wrap of text in div jw-text-duration
    }

    // always hide title of video
    .jw-title {
      display: none !important;
    }

    // styled on-screen button ( rewind, display, next )
    .jw-display {
      // styled icon container
      .jw-display-icon-container {
        // always hide "next" icon
        &.jw-display-icon-next {
          display: none !important;
        }

        // override default padding, margin between button
        padding: 0;
        margin: 0 4px;

        // hide svg button
        svg {
          display: none;
        }

        // set style of icon
        .jw-icon.jw-icon-display,
        .jw-icon.jw-icon-rewind {
          border-radius: 50%;
          width: 100px;
          height: 100px;
          margin-bottom : 20px;
          opacity: 0.75;
          background-color: ${COLORS.LT_DARK_GREY_BLUE};
          box-shadow: 0 3px 6px 0 rgba(0, 0, 0, 0.16);

          &:before {
            font-size: 1.5rem;
            line-height: 24px;
            width: 24px;
            height: 24px;
          }
        }

        // set "display" icon to play
        .jw-icon.jw-icon-display:before {
          content: '\\E60E';
        }

        // set "rewind" icon to rewind 10 seconds
        .jw-icon.jw-icon-rewind:before {
          content: '\\E905';
        }
      }
    }

    // styled controlbar
    .jw-controlbar {
      // styled slider time (timeline bar)
      .jw-slider-horizontal .jw-slider-container {
        // override default slider time height
        height: 2px;

        // override default knob size
        .jw-knob {
          width: 16px;
          height: 16px;
        }
      }

      // styled button in controlbar
      .jw-button-container {
        // hide some button
        //.jw-icon-playback, // if we hide this button, user will don't know playing state on desktop
        //.jw-icon-rewind, // if we hide this button, it will has no way to rewind video 10 seconds on desktop
        .jw-icon-next,
        .jw-icon-live,
        .jw-icon-cast,
        .jw-icon-airplay,
        .jw-related-btn,
        //.jw-icon-cc,
        .jw-icon-settings {
          display: none;
        }

        // styled some icon
        .jw-icon-rewind,
        .jw-icon-fullscreen,
        .jw-icon-cc {
          font-size: 1.25rem;
          padding: 0 8px;
          max-width: 44px;
        }

        // styled rewind icon
        .jw-icon-rewind {
          // replace old rewind icons
          svg {
            display: none;
          }

          // with new rewind icon
          &:before {
            content: '\\E905';
          }
        }

        // styled cc icon
        .jw-icon-cc {
          // replace old cc icons
          svg {
            display: none;
          }

          // with new turn on cc icon
          &:before {
            content: '\\E605';
          }

          // and new turn off cc icon
          &.jw-off:before {
            content: '\\E604';
          }
        }

        // styled fullscreen icon
        .jw-icon-fullscreen {
          // replace old fullscreen icons
          svg {
            display: none;
          }

          // with new enter fullscreen icon
          &:before {
            content: '\\E608';
          }

          // and new exit fullscreen icon
          &.jw-off:before {
            content: '\\E613';
          }
        }
      }
    }

    //============================================================
    // OVERRIDDEN BY THESE STYLES WHEN PLAYER STATE IS IDLE
    //============================================================

    &.jw-state-idle {
      // remove grey overlay before play video
      .jw-controls {
        background: transparent;
      }

      // styled on-screen button - use image from design team instead of font icon
      .jw-display .jw-display-icon-container .jw-icon.jw-icon-display {
        opacity: 1;
        background-image: url("${ICON_PLAY_BUTTON}");

        &:before {
          content: '';
        }
      }

      .jw-display .jw-display-container {
        &:after {
          font-family: ${FONT_FAMILIES.POPPINS};
          font-size : 1.125rem;
          content: 'WATCH VIDEO';
          position: absolute;
          left: 0;
          top: 50%;
          width:100%;
          color : ${COLORS.WHITE};
          margin-top: 45px
        }
      }
    }

    //============================================================
    // OVERRIDDEN BY THESE STYLES WHEN PLAYER STATE IS BUFFERING
    //============================================================

    &.jw-state-buffering {
      // styled on-screen button - set "display" icon to loading
      .jw-display .jw-display-icon-container .jw-icon.jw-icon-display:before {
        content: '\\E601';
        animation: spin 2s linear infinite;
      }

      @keyframes spin {
        0% {
          transform: rotate(0deg);
        }
        100% {
          transform: rotate(360deg);
        }
      }
    }

    //============================================================
    // OVERRIDDEN BY THESE STYLES WHEN PLAYER STATE IS PLAYING
    //============================================================

    &.jw-state-playing {
      // styled on-screen button
      .jw-display {
        // set "display" icon to pause
        .jw-display-icon-container .jw-icon.jw-icon-display:before {
          content: '\\E60D';
        }

        // always show "rewind" icon when video play
        .jw-display-icon-rewind {
          display: inline-block;
        }
      }
    }

    //============================================================
    // OVERRIDDEN BY THESE STYLES WHEN PLAYER STATE IS PAUSED
    //============================================================

    &.jw-state-paused {
      // styled on-screen button
      .jw-display {
        // always hide "rewind" icon when video pause
        .jw-display-icon-rewind {
          display: none;
        }
      }
    }

    //============================================================
    // OVERRIDDEN BY THESE STYLES WHEN PLAYER STATE IS COMPLETE
    //============================================================

    &.jw-state-complete {
      // styled on-screen button - set "display" icon to replay
      .jw-display .jw-display-icon-container .jw-icon.jw-icon-display:before {
        content: '\\E610';
      }
    }

    //============================================================
    // OVERRIDDEN BY THESE STYLES DEPENDING ON PLAYER WIDTH SIZE
    //    jw-breakpoint-1 =      0 - 419px
    //    jw-breakpoint-2 =  420px - 539px
    //    jw-breakpoint-3 =  540px - 639px
    //    jw-breakpoint-4 =  640px - 799px
    //    jw-breakpoint-5 =  800px - 959px
    //    jw-breakpoint-6 =  960px - 1279px
    //    jw-breakpoint-7 = 1280px - Infinity
    //============================================================

    &.jw-breakpoint-3,
    &.jw-breakpoint-4,
    &.jw-breakpoint-5 {
      // increase on-screen button size
      .jw-display .jw-display-icon-container {
        .jw-icon.jw-icon-display,
        .jw-icon.jw-icon-rewind {

          &:before {
            font-size: 1.75rem;
            line-height: 28px;
            width: 28px;
            height: 28px;
          }
        }
      }
    }

    &.jw-breakpoint-6,
    &.jw-breakpoint-7 {
      // increase on-screen button size
      .jw-display .jw-display-icon-container {
        .jw-icon.jw-icon-display,
        .jw-icon.jw-icon-rewind {

          &:before {
            font-size: 2.5rem;
            line-height: 40px;
            width: 40px;
            height: 40px;
          }
        }
      }
    }

    &.jw-breakpoint-7 {
      // increase slider time height
      .jw-controlbar .jw-slider-horizontal .jw-slider-container {
        height: 6px;
      }
    }
  }
`

/*----------------------------------------------------------------------------------
 *  RENDER PHASE
 *---------------------------------------------------------------------------------*/

const JWPlayer = ({
  customPlayerId,
  playerScriptUrl,
  videoId,
  customTargeting,
  isSponsored,
  showVideoAds,
  className,
}) => {
  const customTargetingCopy = { ...customTargeting }
  const playerId = customPlayerId || `jw-player-${videoId}`
  const adUnit = videoAdUnit('video', `video-${videoId}`, deviceType())
  const PlayBtnClickedEvent = () => {
    if (!isPlayBtnClicked) {
      window.dataLayer = window.dataLayer || []
      sendGaEvent({ eventName: 'videoPlay', videoId: videoId })
      isPlayBtnClicked = true
    }
  }
  let showNextAd = true
  let sendStartEvent = false
  let playedVideoCount = 0
  let currentVideoId = 0
  let isPlayBtnClicked = false

  useEffect(() => {
    if (!adUnit) return

    executeVideoAuction(adUnit)
    return () => {
      // teardown video ad units for this particular instance
      if (window.pbjs && window.pbjs.removeAdUnit) window.pbjs.removeAdUnit(adUnit.code)
    }
  }, [adUnit])

  const generatePrerollUrl = () => {
    if (!showVideoAds) return () => {}
    return generateVastUrl(deviceType(), customTargetingCopy, adUnit)
  }

  customTargetingCopy.next_vid = false
  customTargetingCopy.vid_count = 1

  return (
    <ScReactJWPlayer
      key={playerId}
      playerId={playerId}
      playerScript={playerScriptUrl}
      playlist={`https://content.jwplatform.com/feeds/${videoId}.json`}
      customProps={{
        skin: PLAYER_SKIN,
        advertising: {
          client: 'googima',
          output: 'xml_vast4',
          vpaidmode: 'enabled',
        },
        related: {
          file: '',
          oncomplete: 'autoplay',
          autoplaytimer: 0,
        },
      }}
      generatePrerollUrl={generatePrerollUrl}
      onNinetyFivePercent={() => {
        if (adUnit) executeVideoAuction(adUnit, true)
      }}
      onOneHundredPercent={event => {
        customTargetingCopy.next_vid = true
        // Send a watch end event for the first video only
        if (playedVideoCount === 0) sendGaEvent({ eventName: 'videoFinish', videoId: videoId })
        sendStartEvent = false
      }}
      onVideoLoad={event => {
        // This will be fired before onPlay event
        showNextAd = true
        const loadedVideoId = get(event, 'item.mediaid', 0)
        if (loadedVideoId !== currentVideoId) {
          if (currentVideoId !== 0) playedVideoCount++
          currentVideoId = loadedVideoId
        }
      }}
      onAdComplete={(event, player) => {
        customTargetingCopy.vid_count++
        // always applied DoublePreRoll for LT
        if (showNextAd) {
          showNextAd = false
          player.playAd(generatePrerollUrl())
        }
      }}
      onPlay={PlayBtnClickedEvent}
      onTime={event => {
        // This will be fired while the player is running
        if (playedVideoCount < 2 && event.position > 2 && !sendStartEvent) {
          sendStartEvent = true
          if (playedVideoCount > 0)
            sendGaEvent({ eventName: 'videoStart', videoId: videoId, videoAutoStart: true })
          else sendGaEvent({ eventName: 'videoStart', videoId: videoId, videoAutoStart: false })
        }
      }}
      onAdPlay={PlayBtnClickedEvent}
      className={className}
    />
  )
}

JWPlayer.propTypes = {
  customPlayerId: PropTypes.string,
  playerScriptUrl: PropTypes.string,
  videoId: PropTypes.string.isRequired,
  customTargeting: PropTypes.object,
  isSponsored: PropTypes.bool,
  showVideoAds: PropTypes.bool,
  className: PropTypes.string,
}

JWPlayer.defaultProps = {
  customPlayerId: null,
  playerScriptUrl: 'https://cdn.jwplayer.com/libraries/Rbf6BmRc.js',
  customTargeting: {},
  isSponsored: false,
  showVideoAds: true,
  className: null,
}

export default JWPlayer
