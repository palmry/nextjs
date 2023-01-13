import React, { useEffect } from "react"
import styled from "styled-components"
import { useExperiment } from "../AbTest"

const ScConnatixWrapper = styled.div`
  margin-bottom: 30px;
`

const ConnatixPlayer = (props) => {
  const externalPlayerExperiment = useExperiment("external-player")
  const playerId = externalPlayerExperiment.metaData?.playerId
  const scriptId = externalPlayerExperiment.metaData?.scriptId

  useEffect(() => {
    // call render at target element id when componentDidMount only
    if (playerId && scriptId && window.cnxps) {
      window.cnxps.cmd.push(function () {
        window.cnxps({ playerId: playerId }).render(scriptId)
      })
      // For Tracking?
      new Image().src = `https://capi.connatix.com/tr/si?token=${playerId}&cid=78073b55-075a-4510-9623-e2aa3c5ad40a`
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (!playerId) {
    console.error("cannot get Connatix player id from variant mataData")
    return null
  }

  if (!scriptId) {
    console.error("cannot get Connatix script id from variant mataData")
    return null
  }

  // Adapted from "Connatix Tags 20220930"
  // https://docs.google.com/document/d/1X3_EVWQrgcFaBHnaE9HwBHI71RP4U7AFD94BZydSNkQ/edit#
  /* eslint-disable-next-line no-unused-expressions */
  !(function (n) {
    if (!window.cnxps) {
      window.cnxps = {}
      window.cnxps.cmd = []
      var t = n.createElement("iframe")
      // eslint-disable-next-line no-script-url
      t.src = "javascript:false"
      t.display = "none"
      t.onload = function () {
        var n = t.contentWindow.document,
          c = n.createElement("script")
        //  This JS file should load only once. No need to load again in every page.
        c.src =
          "//cd.connatix.com/connatix.playspace.js?cid=78073b55-075a-4510-9623-e2aa3c5ad40a"
        c.setAttribute("async", "1")
        c.setAttribute("type", "text/javascript")
        n.body.appendChild(c)
      }
      n.head.appendChild(t)
    }
  })(document)

  return (
    <ScConnatixWrapper className="noskimlinks">
      <script id={scriptId}></script>
    </ScConnatixWrapper>
  )
}

export default ConnatixPlayer
