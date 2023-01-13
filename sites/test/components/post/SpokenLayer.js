import { useEffect, useState } from 'react'
import PropTypes from 'prop-types'

const SpokenLayer = slug => {
  const players = document.getElementsByClassName('spokenlayer')
  const [loaded, setLoaded] = useState(typeof window.WebPlayer !== 'undefined')

  const unmountPlayers = players => {
    for (let i = 0; i < players.length; i++) {
      window.WebPlayer.unmount(players[i])
    }
  }

  useEffect(() => {
    //moving library script here to load only when needed
    if (players.length && !loaded) {
      const s = document.createElement('script')
      s.async = true
      s.src = 'https://webplayer.spokenlayer.net/0.1/webplayer.js'
      document.head.appendChild(s)
      s.addEventListener('load', () => {
        unmountPlayers(players)
        setLoaded(true)
      })
    }

    if (loaded) {
      for (let i = 0; i < players.length; i++) {
        const args = {
          iframe: true,
          type: 'inline',
          autoplay: false,
          publication: players[i].dataset.publication,
          playlist: players[i].dataset.playlist,
          variant: 'largeBottom',
        }
        window.WebPlayer.mount(args, players[i])
      }
      if (process.env.NODE_ENV === 'development') {
        console.log(
          'SpokenLayer : did mount/did update : URL : ',
          document.URL,
          ' : players.length : ',
          players.length
        )
      }
    }

    return () => {
      if (loaded && players.length) {
        unmountPlayers(players)
        if (process.env.NODE_ENV === 'development') {
          console.log(
            'SpokenLayer : will unmount : URL : ',
            document.URL,
            ' : players.length : ',
            players.length
          )
        }
      }
    }
  }, [slug, players, loaded])

  return null
}

SpokenLayer.propTypes = {
  slug: PropTypes.string.isRequired,
}

export default SpokenLayer
