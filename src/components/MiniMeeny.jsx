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
          setTimeout(() => {
            requestAnimationFrame(renderFrame)
          }, 5)
        } else {
          dispatch(action.UPDATE_FACE({
            height: 2,
            width: 40,
            borderRadius: 50,
            eyebrowHeight: 0
          }))
        }
    }

    audio.play()
    renderFrame()
  }

  recordAudio() {

  }

  render() {

    const { animations, audioFile, character, currentFrame } = this.props

    let face = animations.toJS().face
    let borderRadiusString = face.borderRadius + '% ' + face.borderRadius + '% 80% 80%'

    let mouthFill = "url(#mouthTexture)"
    if (face.height <= 4) {
      mouthFill = "black"
    }

    let styles = {
      lips: {
        margin: (face.height / 2) + 'px auto',
        WebkitTransition: 'all .1s',
        transition: 'all .1s',
      },
      mouth: {
        backgroundColor: 'black',
        width: face.width + 'px',
        height: face.height + 'px',
        border: '2px solid #D04054',
        borderRadius: borderRadiusString,
        margin: ((30 - face.height) / 2) + 'px auto',
        WebkitTransition: 'all .1s',
        transition: 'all .1s',
      },
      eyebrows: {

      },
      eyebrow: {
        marginTop: -face.eyebrowHeight + 'px',
        MsTransition: 'margin .1s, transform .1s',
        WebkitTransition: 'margin .1s, transform .1s',
        transition: 'margin .1s, transform .1s'
      },
      eyebrowLeft: {
        MsTransform: 'rotate(-' + (face.eyebrowHeight / 2.2) + 'deg)', /* IE 9 */
        WebkitTransform: 'rotate(-' + (face.eyebrowHeight / 2.2) + 'deg)', /* Chrome, Safari, Opera */
        transform: 'rotate(-' + (face.eyebrowHeight / 2.2) + 'deg)'
      },
      eyebrowRight: {
        MsTransform: 'rotate(' + (face.eyebrowHeight / 2) + 'deg)', /* IE 9 */
        WebkitTransform: 'rotate(' + (face.eyebrowHeight / 2) + 'deg)', /* Chrome, Safari, Opera */
        transform: 'rotate(' + (face.eyebrowHeight / 2) + 'deg)'
      }
    }

    return (
      <div>
        <audio src={audioFile} id={"player"} controls></audio>
        <button onClick={() => this.recordAudio()}>start recording</button>
        <div>
          face of {character.toJS().name}
        </div>
        <div className={"face"}>
          <div className={"eyebrows"} style={styles.eyebrows}>
            <div className={"eyebrow"} style={Object.assign({}, styles.eyebrow, styles.eyebrowLeft)}></div>
            <div className={"eyebrow eyebrow-right"} style={Object.assign({}, styles.eyebrow, styles.eyebrowRight)}></div>
          </div>
          <div className={"eyes"}>
            <div className={"eye"}></div>
            <div className={"eye"}></div>
          </div>
          <div className={"mouthContainer"}>
            <svg height={face.height + 2} width="50" style={styles.lips}>
              <defs>
                <pattern id="mouthTexture" patternUnits="userSpaceOnUse" width="50" height="30">
                  <image xlinkHref="./src/assets/mouth-02.png" x="0" y="-1" width="50" height="30" />
                </pattern>
              </defs>
              <ellipse cx="25" cy={face.height / 2} rx={face.width / 2} ry={face.height / 2} style={styles.mouth} fill={mouthFill} stroke="#D04054" strokeWidth="1" />
            </svg>
          </div>
        </div>
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
