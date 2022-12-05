import { useEffect, useRef } from 'react'
import { playSound, pauseSound } from '../../utils/sounds'
import styles from './Modals.module.scss'
import mission_success from '../../assets/sounds/mission_success.mp3'
import Filter from '../Filter/Filter'

function WinModal({ title, desc, setPlaying, audioRef }) {
  const soundOfWin = new Audio(mission_success)
  const audioRefWin = useRef(soundOfWin)

  useEffect(() => {
    playSound(audioRefWin)
    pauseSound(audioRef)
    setPlaying(false)
  }, [])

  return (
    <>
      <div className={styles.modal}>
        <Filter />
        <div className={styles.modal_body}>
          <div className={styles.win_modal_content}>
            <h3>{title}</h3>
            <p>{desc}</p>
            <div className={styles.modal_image_win}>
              {' '}
              <img src={require(`../../assets/images/adventures.jpg`)} />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default WinModal
