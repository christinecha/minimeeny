"use strict"

import React from 'react'
import { connect } from 'react-redux'
import * as action from '../actions.js'

let animationFramesArray = []

export class MiniMeeny extends React.Component {

  componentDidMount() {
    const { dispatch, animations } = this.props

    let audio = document.getElementById('player')

    let audioCtx = new AudioContext();
    let analyser = audioCtx.createAnalyser();
    let source = audioCtx.createMediaElementSource(audio);
    source.connect(analyser);
    analyser.connect(audioCtx.destination);
    analyser.fftSize = 2048;

    let frequencyData = new Uint8Array(analyser.frequencyBinCount);

    let envVolume = 0
    let envSet = false
    let framesRendered = 0

    function renderFrame() {
        // $('#visualizer').empty()
        analyser.getByteFrequencyData(frequencyData);
        // console.log(frequencyData)

        let width = 40
        let height = 5

        let volume = 0
        let pitch = 0
        let eyebrowHeight = 0
        let borderRadius = 50

        for (let i = 6; i < 18; i++) {
          if (envSet == false) {
            envVolume += frequencyData[i]
          }

          volume += frequencyData[i]
          if (i == 6 || frequencyData[i] > frequencyData[i-1]) {
            pitch = i
          }
        }

        if (!envSet && framesRendered >= 3) {
          envSet = true
          envVolume = envVolume / framesRendered
        } else if (envVolume == 0){
          // nada
        } else {
          framesRendered+= 1
        }


        let trueVolume = volume - envVolume
        if (trueVolume > 100) {

          let excess = trueVolume - 100
          let excessCorrected = 0
          for (let i = 1; i <= excess; i++) {
            excessCorrected+= 0.2 + (1 / i)
          }
          trueVolume = 100 + excessCorrected

          console.log(excess, excessCorrected, trueVolume)

          height = 5 + Math.round(trueVolume / 30)
          width = 50 + Math.round(trueVolume / 20) - (pitch * 2.5)
          borderRadius = Math.round(pitch * 4) + Math.round(trueVolume / 50)
          eyebrowHeight = 1 + Math.ceil(trueVolume / 50)
          // console.log(borderRadius)

          if (height >= 20) {
            height = 20
          }

          if (width >= 50) {
            width = 50
          } else if (width <= 15) {
            width = 15
          }
        }

        if (!audio.paused) {
          dispatch(action.UPDATE_MOUTH([width, height, borderRadius, eyebrowHeight]))
          requestAnimationFrame(renderFrame)
        } else {
          dispatch(action.UPDATE_MOUTH([40, 5, 50, 0]))
        }
    }

    audio.play();
    renderFrame();
  }

  render() {

    const { animations, audioFile, character, currentFrame } = this.props

    let mouthFrame = animations.toJS().mouth
    let borderRadiusString = mouthFrame[2] + '% ' + mouthFrame[2] + '% 100% 100%'
    // console.log(borderRadiusString)

    let styles = {
      mouth: {
        backgroundColor: 'black',
        width: mouthFrame[0] + 'px',
        height: mouthFrame[1] + 'px',
        borderRadius: borderRadiusString,
        margin: '0 auto',
        WebkitTransition: 'height .05s, width .1s, border-radius .05s',
        transition: 'height .05s, width .1s, border-radius .05s'
      },
      eyebrows: {
        marginBottom: mouthFrame[3] + 'px',
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
