"use strict"

export const foundEnvironmentVolume = (framesRendered) => {
  if (framesRendered >= 3) {
    return true
  } else {
    return false
  }
}

export const getEnvironmentVolume = (frequencyData) => {
  let envVolume = 0

  for (let i = 6; i < 18; i++) {
    envVolume += frequencyData[i]
  }

  if (envVolume <= 0) {
    return false
  } else {
    return envVolume
  }
}

export const getAnimationFrame = (frequencyData, envVolume) => {
  let width = 30
  let height = 2
  let eyebrowHeight = 0
  let borderRadius = 50
  let volume = 0
  let pitch = 0
  let purity = 0

  for (let i = 12; i < 36; i++) {
    volume += frequencyData[i]
    if (i == 12 || frequencyData[i] > frequencyData[i-1]) {
      pitch = i
    }
  }

  purity = frequencyData[pitch] / volume

  let trueVolume = volume - envVolume

  if (trueVolume > 500) {

    let excess = trueVolume - 500
    let excessCorrected = 0
    for (let i = 1; i <= excess; i++) {
      excessCorrected+= 0.25 + (1 / i)
    }
    trueVolume = 500 + excessCorrected
    // console.log(Math.round(envVolume), Math.round(trueVolume), pitch, purity)

    height = 2 + Math.round(trueVolume / 100) + (pitch / 20)
    width = 10 + Math.round(trueVolume / 200) + (pitch / 5) - (purity * 50)
    borderRadius = Math.round(pitch * 2) + Math.round(trueVolume / 300) - (purity * 50)
    eyebrowHeight = 1 + Math.ceil(trueVolume / 50)
    // console.log(height, width)

    if (height >= 30) {
      height = 30
    } else if (height <= 8) {
      height = 4
      width = 30
    }

    if (width >= 30) {
      width = 30
    } else if (width <= 18) {
      width = 18
    }
  }

  return ({
    height: height,
    width: width,
    borderRadius: borderRadius,
    eyebrowHeight: eyebrowHeight
  })

}
