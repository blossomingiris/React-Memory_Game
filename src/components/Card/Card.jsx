import './Card.scss'
import { useRef } from 'react'
import { playSound } from '../../utils/sounds'
import woosh from '../../assets/sounds/woosh.mp3'
import { images } from '../../constants'

function Card({ card, handleChoice, flipped, disabled }) {
  //function fired when user clicks on back cover of card
  //and update the state of user choiceOne  or user choiceTwo

  //play sound when user clicks on back cover of card

  const soundWoosh = new Audio(woosh)
  const audioRefWoosh = useRef(soundWoosh)

  const handleClick = () => {
    if (!disabled) {
      handleChoice(card)
      playSound(audioRefWoosh)
    }
  }

  return (
    <div className='card'>
      <div className={flipped ? 'flipped' : ''}>
        <img
          src={card.src}
          alt='front side of card'
          className='card_front_side'
        />
        <img
          src={images.cover}
          alt='back side of card'
          className='card_back_side'
          onClick={handleClick}
        />
      </div>
    </div>
  )
}

export default Card
