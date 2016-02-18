"use strict"

export const NEXT_ANIMATION_FRAME = (currentFrame) => {
  let newFrame = currentFrame + 1

  return ({
    type: 'NEXT_ANIMATION_FRAME',
    data: {
      currentFrame: newFrame
    }
  })
}
