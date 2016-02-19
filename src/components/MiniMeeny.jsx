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

    var frequencyData = new Uint8Array(analyser.frequencyBinCount);

    let envVolume = 0
    let envSet = false
    let framesRendered = 0

    function renderFrame() {
        // $('#visualizer').empty()
        analyser.getByteFrequencyData(frequencyData);

        let width = 40
        let height = 5

        let volume = 0
        let pitch = 0
        let eyebrowHeight = 0
        let borderRadius = 50

        for (let i = 3; i < 7; i++) {
          // let $box = $('<div>')
          //   .css('height', frequencyData[i]+ 'px')
          //   .attr('data-pitch', i)
          //   .attr('data-volume', frequencyData[i])
          //   .css('display', 'inline-block')
          //   .css('width', '2px')
          //   .css('vertical-align', 'bottom')
          //   .css('backgroundColor', 'black')
          // $('#visualizer').append($box)

          if (envSet == false) {
            if (frequencyData[i] == 0) {
              // ugg not yet
            } else {
              framesRendered+= 1
              envVolume += frequencyData[i]
            }
          }

          volume += frequencyData[i]
          if (i == 2 || frequencyData[i] > frequencyData[i-1]) {
            pitch = i
          }
        }

        if (framesRendered >= 30 && !envSet) {
          envSet = true
          envVolume = envVolume / framesRendered
          // console.log('env', envVolume, envSet)
        }

        // console.log(volume/3, envVolume, pitch)

        if (volume/3 - envVolume > 0) {
          height = 10 + Math.ceil(volume / 20)
          width = 40 + Math.ceil(volume / 40) - (pitch * 3)
          borderRadius = 50 + Math.ceil(pitch * 3)
          eyebrowHeight = 1 + Math.ceil(volume / 100)
        }

        if (!audio.paused) {
          dispatch(action.UPDATE_MOUTH([width, height, borderRadius, eyebrowHeight]))
          setTimeout(() => {
            requestAnimationFrame(renderFrame)
          }, 10)
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
