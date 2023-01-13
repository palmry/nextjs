import FollowUsResponseImage from './FollowUsResponseImage'
import INSTAGRAM_CONFIGS from '../../statics/configs/instagram.json'
import React from 'react'

const FollowUs = () => {
  return INSTAGRAM_CONFIGS.length > 0 ? <FollowUsResponseImage /> : ''
}

export default FollowUs
