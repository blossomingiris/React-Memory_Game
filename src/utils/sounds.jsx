export const playSound = (audioRef) => {
  audioRef.current.play()
}

export const pauseSound = (audioRef) => {
  audioRef.current.pause()
}
