"use strict"

export const UPDATE_FACE = (animationFrame) => {

  return ({
    type: 'UPDATE_FACE',
    data: {
      animations: {
        face: animationFrame
      }
    }
  })
}
