import styles from './Modals.module.scss'
import { TbMusic, TbMusicOff } from 'react-icons/tb'
import { playSound } from '../../utils/sounds'
import click from '../../assets/sounds/click.mp3'
import { useRef } from 'react'
import { useState } from 'react'
import Filter from '../Filter/Filter'

function Modal({
  showNextModal,
  showPrevModal,
  title,
  desc,
  image,
  secondModal,
  thirdModal,
  forthModal,
  firstModal,
  closeModalHandler,
  startGameTimer,
  playBackgroundMusic,
  playMusic,
}) {
  const [turnOnCard, setTurnOnCard] = useState(false)

  const soundClick = new Audio(click)
  const audioRefClick = useRef(soundClick)

  const eventHandler = () => {
    closeModalHandler()
    startGameTimer()
    playSound(audioRefClick)
  }

  const handleClick = () => {
    setTurnOnCard(true)
    playSound(audioRefClick)
  }

  return (
    <div className={styles.app_container}>
      {' '}
      <div className={styles.modal}>
        <Filter />{' '}
        <div className={styles.modal_body}>
          <div className={styles.modal_content}>
            <div className={styles.modal_title}>
              <h3>{title}</h3>
              {!playMusic ? (
                <TbMusicOff
                  onClick={playBackgroundMusic}
                  className={styles.sound_button}
                />
              ) : (
                <TbMusic
                  onClick={playBackgroundMusic}
                  className={styles.sound_button}
                />
              )}
            </div>
            <p>{desc}</p>
            <div className={styles.modal_buttons_group}>
              {secondModal && (
                <button className={styles.modal_button} onClick={showPrevModal}>
                  Prev
                </button>
              )}
              {thirdModal && (
                <>
                  {' '}
                  <button
                    className={styles.modal_button}
                    onClick={showPrevModal}
                  >
                    Prev
                  </button>
                  <button className={styles.modal_button} onClick={handleClick}>
                    Open eyes
                  </button>
                </>
              )}
              {forthModal && (
                <>
                  <button
                    className={styles.modal_button}
                    onClick={showPrevModal}
                  >
                    Prev
                  </button>
                  <button
                    onClick={eventHandler}
                    className={styles.modal_button_play}
                  >
                    Play
                  </button>
                </>
              )}
              {firstModal || secondModal || thirdModal ? (
                <button className={styles.modal_button} onClick={showNextModal}>
                  Next
                </button>
              ) : null}
            </div>
          </div>
          <div className={styles.modal_image}>
            {!turnOnCard ? (
              <img
                src={require(`../../assets/images/${image}`)}
                className={styles.image}
                onClick={handleClick}
              />
            ) : (
              <img
                src={require(`../../assets/images/demon.png`)}
                className={styles.image}
                alt={title}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Modal
