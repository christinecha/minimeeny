"use strict"

export const UPDATE_MOUTH = (mouthState) => {

  return ({
    type: 'UPDATE_MOUTH',
    data: {
      animations: {
        mouth: mouthState
      }
    }
  })
}
