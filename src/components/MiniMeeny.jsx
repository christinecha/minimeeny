"use strict"

import React from 'react'
import { connect } from 'react-redux'
import * as action from '../actions.js'

export class MiniMeeny extends React.Component {

  componentDidMount() {
    setTimeout(() => this.tick(), 100)
    document.getElementById('player').play()
  }

  componentDidUpdate() {
    const { animationFrames, currentFrame } = this.props

    if (currentFrame < animationFrames.toJS().mouth.length - 1) {
      setTimeout(() => this.tick(), 100)
    }
  }

  tick() {
    const { dispatch, currentFrame } = this.props
    console.log(currentFrame)
    dispatch(action.NEXT_ANIMATION_FRAME(currentFrame))
  }

  render() {

    const { animationFrames, audioFile, character, currentFrame } = this.props

    let styles = {
      mouth: {
        backgroundColor: 'black',
        width: animationFrames.toJS().mouth[currentFrame][0] + 'px',
        height: animationFrames.toJS().mouth[currentFrame][1] + 'px',
        borderRadius: '10px 10px 30px 30px',
        margin: '0 auto',
        WebkitTransition: 'width .02s, height .02s',
        transition: 'width .02s, height .02s'
      }
    }

    return (
      <div>
        <audio src={audioFile} id={"player"} controls></audio>
        <div>
          face of {character.toJS().name}
        </div>
        <div style={styles.mouth} ></div>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    animationFrames: state.get('animationFrames'),
    audioFile: state.get('audioFile'),
    character: state.get('character'),
    currentFrame: state.get('currentFrame')
  }
}

export const AppContainer = connect(mapStateToProps)(MiniMeeny)
