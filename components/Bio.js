import React from 'react'
import { config } from 'config'
import { rhythm } from 'utils/typography'
import profilePic from './mimi-sm.png'

class Bio extends React.Component {
  render () {
    return (
      <p
        style={{
          marginBottom: rhythm(2.5),
        }}
      >
        <a href="https://twitter.com/mimiflynn"><img
          src={profilePic}
          alt={`author ${config.authorName}`}
          style={{
            float: 'left',
            marginRight: rhythm(1/4),
            marginBottom: 0,
            width: rhythm(2),
            height: rhythm(2),
          }}
        /></a>
        Written by <strong>{config.authorName}</strong>, a UI engineer in New York City.
      </p>
    )
  }
}

export default Bio
