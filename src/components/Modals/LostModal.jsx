import { useEffect, useState, useRef } from 'react'
import laugh from '../../assets/sounds/laugh.mp3'
import click from '../../assets/sounds/click.mp3'
import { playSound, pauseSound } from '../../utils/sounds'
import styles from './Modals.module.scss'
import Filter from '../Filter/Filter'

function LostModal({
  title,
  desc,
  startGameTimer,
  shuffleCards,
  setCounter,
  audioRef,
  setPlaying,
}) {
  const [endOfStory, setEndOfStory] = useState({})

  const soundLaugh = new Audio(laugh)
  const audioRefLaugh = useRef(soundLaugh)
  const soundClick = new Audio(click)
  const audioRefClick = useRef(soundClick)

  // console.log(sound)

  useEffect(() => {
    playSound(audioRefLaugh)
    pauseSound(audioRef)
    setPlaying(false)
    let randomScenario = getRandomScenario(desc)
    setEndOfStory(randomScenario)
  }, [])

  const resetGame = () => {
    shuffleCards()
    startGameTimer()
    setCounter(0)
    playSound(audioRefClick)
  }

  //random scenario for end of story
  function getRandomScenario(obj) {
    const keys = Object.keys(obj)
    const randomIndex = Math.floor(Math.random() * keys.length)
    const randomObject = obj[randomIndex]
    return randomObject
  }

  return (
    <>
      <div className={styles.modal}>
        <Filter />
        <div className={styles.modal_body_lost_game}>
          <div className={styles.modal_content}>
            <div className={styles.modal_title}>
              <h3>{title}</h3>
            </div>
            <p>{endOfStory.scenario && endOfStory.scenario}</p>
            <button className={styles.modal_button_play} onClick={resetGame}>
              Try again
            </button>
          </div>
          {endOfStory.image && (
            <img
              className={styles.image_lost}
              src={require(`../../assets/images/${endOfStory.image}`)}
            />
          )}
        </div>
      </div>
    </>
  )
}

export default LostModal
