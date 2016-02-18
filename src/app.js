"use strict"

import React from 'react'
import ReactDOM from 'react-dom'
import reducer from './reducer.js'
import { AppContainer } from './components/MiniMeeny.jsx'
import { createStore } from 'redux'
import { Provider } from 'react-redux'
import * as action from './actions.js'

const store = createStore(reducer)

console.log('hi')

let animationFrames = [
  [23.72395833333333,11.274509803921603],
  [30.234375,8.137254901960773],
  [24.298406862745097,6.568627450980387],
  [28.511029411764703,6.568627450980387],
  [27.74509803921569,8.137254901960773],
  [22.766544117647058,8.137254901960773],
  [28.128063725490197,6.568627450980387],
  [33.872549019607845,6.568627450980387],
  [33.872549019607845,6.568627450980387],
  [14.532781862745097,11.274509803921603],
  [15.107230392156868,11.274509803921603],
  [27.745098039215684,5],
  [22.766544117647065,5],
  [32.72365196078431,5],
  [32.72365196078431,5],
  [12.809436274509803,12.84313725490199]
]

store.dispatch({
  type: 'SET_INITIAL_STATE',
  data: {
    animationFrames: {
      mouth: animationFrames
    },
    audioFile: 'src/assets/test3.wav',
    character: {
      name: 'Christine'
    },
    currentFrame: 0
  }
})

ReactDOM.render(
  <Provider store={store}>
    <AppContainer />
  </Provider>,
  document.getElementById('miniMeeny')
)
