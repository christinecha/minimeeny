"use strict"

import React from 'react'
import { connect } from 'react-redux'
import * as helper from './_helpers.js'
import * as action from '../actions.js'

let animationFramesArray = []

export class MiniMeeny extends React.Component {

  componentDidMount() {
    const { dispatch, animations } = this.props

    let audio = document.getElementById('player')

    let audioCtx = new AudioContext()
    let analyser = audioCtx.createAnalyser()
    let source = audioCtx.createMediaElementSource(audio)
    source.connect(analyser)
    analyser.connect(audioCtx.destination)
    analyser.fftSize = 2048

    let frequencyData = new Uint8Array(analyser.frequencyBinCount)

    let envVolume = 0
    let envSet = false
    let framesRendered = 0

    function renderFrame() {
        analyser.getByteFrequencyData(frequencyData)

        if (!envSet && helper.getEnvironmentVolume(frequencyData)) {
          envVolume+= helper.getEnvironmentVolume(frequencyData)
          framesRendered+= 1
          envSet = helper.foundEnvironmentVolume(framesRendered)

          if (envSet) {
            envVolume = envVolume / framesRendered
          }
        }

        let animationFrame = helper.getAnimationFrame(frequencyData, envVolume)

        if (!audio.paused) {
          dispatch(action.UPDATE_FACE(animationFrame))
          requestAnimationFrame(renderFrame)
        } else {
          dispatch(action.UPDATE_FACE({
            height: 5,
            width: 40,
            borderRadius: 50,
            eyebrowHeight: 0
          }))
        }
    }

    audio.play()
    renderFrame()
  }

  render() {

    const { animations, audioFile, character, currentFrame } = this.props

    let face = animations.toJS().face
    let borderRadiusString = face.borderRadius + '% ' + face.borderRadius + '% 100% 100%'

    let styles = {
      mouth: {
        backgroundColor: 'black',
        width: face.width + 'px',
        height: face.height + 'px',
        borderRadius: borderRadiusString,
        margin: '0 auto',
        WebkitTransition: 'height .05s, width .1s, border-radius .05s',
        transition: 'height .05s, width .1s, border-radius .05s'
      },
      eyebrows: {
        marginBottom: face.eyebrowHeight + 'px',
        WebkitTransition: 'margin-bottom .1s',
        transition: 'margin-bottom .1s'
      }
    }

    return (
      <div>
        <audio src={audioFile} id={"player"} controls></audio>
        <div>
          face of {character.toJS().name}
        </div>
        <div className={"eyebrows"} style={styles.eyebrows}>
          <div className={"eyebrow"}></div>
          <div className={"eyebrow"}></div>
        </div>
        <div className={"eyes"}>
          <div className={"eye"}></div>
          <div className={"eye"}></div>
        </div>
        <div style={styles.mouth} ></div>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    animations: state.get('animations'),
    audioFile: state.get('audioFile'),
    character: state.get('character'),
    currentFrame: state.get('currentFrame')
  }
}

export const AppContainer = connect(mapStateToProps)(MiniMeeny)
