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
    analyser.fftSize = 64;

    var frequencyData = new Uint8Array(analyser.frequencyBinCount);

    function renderFrame() {
        $('#visualizer').empty()
        analyser.getByteFrequencyData(frequencyData);

        let width = 60
        let height = 5

        let volume = 0
        let pitch = 0

        for (let i = 10; i < 30; i ++) {
          // let $box = $('<div>')
          //   .css('height', frequencyData[i]+ 'px')
          //   .attr('data-pitch', i)
          //   .attr('data-volume', frequencyData[i])
          //   .css('display', 'inline-block')
          //   .css('width', '2px')
          //   .css('vertical-align', 'bottom')
          //   .css('backgroundColor', 'black')
          // $('#visualizer').append($box)

          if (frequencyData[i] >= 50) {
            volume += frequencyData[i]
          }

          if (frequencyData[i] > frequencyData[i-1]) {
            pitch = i
          }
        }

        console.log(volume)

        if (volume > 100) {
          height = 10 + Math.ceil(volume / 200)

          if (pitch > 10) {
            width = 80 - (pitch * 2)
          }
        }

        if (!audio.paused) {
          dispatch(action.UPDATE_MOUTH([width, height]))
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

    let styles = {
      mouth: {
        backgroundColor: 'black',
        width: animations.toJS().mouth[0] + 'px',
        height: animations.toJS().mouth[1] + 'px',
        borderRadius: '15px 15px 30px 30px',
        margin: '0 auto',
        WebkitTransition: 'height .05s, width .05s',
        transition: 'height .05s, width .05s'
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
    animations: state.get('animations'),
    audioFile: state.get('audioFile'),
    character: state.get('character'),
    currentFrame: state.get('currentFrame')
  }
}

export const AppContainer = connect(mapStateToProps)(MiniMeeny)
