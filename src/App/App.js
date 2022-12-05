import { useEffect, useState, useRef } from 'react'
import clock from '../assets/sounds/clock.mp3'
import click from '../assets/sounds/click.mp3'
import lost_in_forest from '../assets/sounds/lost_in_forest.mp3'
import { pauseSound, playSound } from '../utils/sounds'
import Card from '../components/Card/Card'
import Modal from '../components/Modals/Modals'
import { images, lore } from '../constants/index'
import LostModal from '../components/Modals/LostModal'
import WinModal from '../components/Modals/WinModal'
import './App.scss'
import Filter from '../components/Filter/Filter'

function App() {
  const [cards, setCards] = useState([])
  const [turns, setTurns] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [playMusic, setPlayMusic] = useState(false)
  //when user clicks on first card it will update first card choice and when he will click next time updated second card choice
  const [choiceOne, setChoiceOne] = useState(null)
  const [choiceTwo, setChoiceTwo] = useState(null)
  const [disabled, setDisabled] = useState(false)
  const [counter, setCounter] = useState(0)
  const [timer, setTimer] = useState('')
  const [firstModal, showFirstModal] = useState(false)
  const [secondModal, showSecondModal] = useState(false)
  const [thirdModal, showThirdModal] = useState(false)
  const [forthModal, showForthModal] = useState(false)

  const soundClock = new Audio(clock)
  soundClock.loop = true
  const audioRefClock = useRef(soundClock)
  const soundClick = new Audio(click)
  const audioRefClick = useRef(soundClick)
  const lostMusic = new Audio(lost_in_forest)
  lostMusic.loop = true
  const audioRefLostMusic = useRef(lostMusic)

  // timer
  const Ref = useRef(null)

  //get seconds
  const getTimeRemaining = (e) => {
    const total = Date.parse(e) - Date.parse(new Date())
    const seconds = Math.floor((total / 1000) % 60)
    return {
      total,
      seconds,
    }
  }

  const startTimer = (e) => {
    let { total, seconds } = getTimeRemaining(e)
    if (total >= 0) {
      // check if less than 10 seconds then we need to
      // add '0' at the beginning of the variable
      setTimer(seconds > 9 ? seconds : '0' + seconds)
    }
  }

  const clearTimer = (e) => {
    setTimer('30')
    // updating of timer every 1 second
    if (Ref.current) clearInterval(Ref.current)
    const id = setInterval(() => {
      startTimer(e)
    }, 1000)
    Ref.current = id
  }

  //limit time for game for 20 seconds
  const getDeadTime = () => {
    let deadline = new Date()
    //add plus 30 seconds to the current time
    deadline.setSeconds(deadline.getSeconds() + 30)
    return deadline
  }

  // Another way to call the clearTimer() to start
  // the countdown is via action event from the
  // button first we create function to be called
  // by the button

  //start game timer
  const startGameTimer = () => {
    clearTimer(getDeadTime())
    playSound(audioRefClock)
    setPlaying(true)
    pauseSound(audioRefLostMusic)
    setPlayMusic(false)
  }

  const playBackgroundMusic = () => {
    if (!playMusic) {
      audioRefLostMusic.loop = true
      playSound(audioRefLostMusic)
    } else {
      pauseSound(audioRefLostMusic)
    }
    setPlayMusic(!playMusic)
  }

  //card board logic
  const cardsImages = [
    { src: images.bag, matched: false },
    { src: images.magic_ball, matched: false },
    { src: images.potion, matched: false },
    { src: images.stone, matched: false },
    { src: images.scroll, matched: false },
    { src: images.snake, matched: false },
  ]

  //shuffle cards to get random result
  const shuffleCards = () => {
    const shuffledCards = [...cardsImages, ...cardsImages]
      .sort(() => Math.random() - 0.5)
      .map((card) => ({ ...card, id: Math.random() }))
    setChoiceOne(null)
    setChoiceTwo(null)
    setCards(shuffledCards)
    setTurns(0)
  }

  //shuffle cards another algorithm
  // function shuffleCards() {
  //   const shuffleCards = [...cardsImages, ...cardsImages]
  //   for (let i = shuffleCards.length - 1; i >= 0; i--) {
  //     let j = Math.floor(Math.random() * (i + 1))
  //     let temp = shuffleCards[i]
  //     shuffleCards[i] = shuffleCards[j]
  //     shuffleCards[j] = temp
  //   }
  //   setCards(shuffleCards)
  //   setTurns(0)
  // }

  //when user selected a card we have a choice
  // if there is no value update choice one if it is update choice two

  const handleChoice = (card) => {
    if (card.id === choiceOne?.id) return
    choiceOne ? setChoiceTwo(card) : setChoiceOne(card)
  }

  //compare selected two cards
  //if user chosen two cards
  // and if it is a pair of same cards
  // updated card state (based on previous card state): matched to true (using map method return new object of cards instead of original cards object)
  //count the number cards pair, if total number of card is 6 user wins
  // reset choices

  useEffect(() => {
    if (choiceOne && choiceTwo) {
      setDisabled(true)
      if (choiceOne.src === choiceTwo.src) {
        setCards((prevCards) => {
          return prevCards.map((card) => {
            if (card.src === choiceOne.src) {
              setCounter((count) => counter + 1)
              return { ...card, matched: true }
            } else {
              return card
            }
          })
        })
        resetTurn()
      } else {
        setTimeout(() => resetTurn(), 1000)
      }
    }
  }, [choiceOne, choiceTwo])

  //reset choices and increase turn
  const resetTurn = () => {
    setChoiceOne(null)
    setChoiceTwo(null)
    setTurns((prevTurns) => prevTurns + 1)
    setDisabled(false)
  }

  // automatically start new game: shuffle cards and start game story
  useEffect(() => {
    shuffleCards()
    showFirstModal(true)
  }, [])

  const closeModalHandler = () => {
    showForthModal(false)
  }

  //switch modal windows to display game story
  const showNextModal = () => {
    if (firstModal) {
      showSecondModal(true)
      showFirstModal(false)
      showThirdModal(false)
    } else if (!firstModal && secondModal) {
      showThirdModal(true)
      showSecondModal(false)
    } else if (!firstModal && !secondModal && thirdModal) {
      showForthModal(true)
      showThirdModal(false)
    }
    playSound(audioRefClick)
  }

  const showPrevModal = () => {
    if (!firstModal && !secondModal && !thirdModal && !forthModal) {
      showSecondModal(true)
      showThirdModal(false)
    } else if (!firstModal && secondModal && !thirdModal && !forthModal) {
      showFirstModal(true)
      showSecondModal(false)
    } else if (!firstModal && !secondModal && thirdModal && !forthModal) {
      showSecondModal(true)
      showThirdModal(false)
    } else if (!firstModal && !secondModal && !thirdModal && forthModal) {
      showForthModal(false)
      showThirdModal(true)
    }
    playSound(audioRefClick)
  }

  return (
    <div className='app_container'>
      <div className='container'>
        <Filter />
        <div className='header'>
          <h1>Magic Memory</h1>
        </div>
        <div className='card_grid'>
          {cards.map((card, index) => (
            <Card
              key={index + 1}
              card={card}
              handleChoice={handleChoice}
              flipped={card === choiceOne || card === choiceTwo || card.matched}
              disable={disabled}
            />
          ))}
        </div>
        <h1>00:{timer}</h1>
      </div>
      {firstModal ? (
        <Modal
          showNextModal={showNextModal}
          title={lore[0].title_1}
          desc={lore[0].desc_1}
          firstModal={firstModal}
          image={lore[0].image}
          playBackgroundMusic={playBackgroundMusic}
          playMusic={playMusic}
        />
      ) : null}
      {secondModal ? (
        <Modal
          title={lore[1].title_2}
          desc={lore[1].desc_2}
          secondModal={secondModal}
          showPrevModal={showPrevModal}
          showNextModal={showNextModal}
          image={lore[1].image}
          playBackgroundMusic={playBackgroundMusic}
          playMusic={playMusic}
        />
      ) : null}
      {thirdModal ? (
        <Modal
          title={lore[2].title_3}
          desc={lore[2].desc_3}
          showPrevModal={showPrevModal}
          showNextModal={showNextModal}
          thirdModal={thirdModal}
          image={lore[2].image}
          playClick={playSound}
          playBackgroundMusic={playBackgroundMusic}
          playMusic={playMusic}
        />
      ) : null}
      {forthModal ? (
        <Modal
          title={lore[3].title_4}
          desc={lore[3].desc_4}
          showPrevModal={showPrevModal}
          forthModal={forthModal}
          closeModalHandler={closeModalHandler}
          startGameTimer={startGameTimer}
          image={lore[3].image}
          playBackgroundMusic={playBackgroundMusic}
          playMusic={playMusic}
        />
      ) : null}
      {timer !== '00' && counter === 6 ? (
        <WinModal
          title={lore[5].title_6}
          desc={lore[5].desc_6}
          setPlaying={setPlaying}
          audioRef={audioRefClock}
        />
      ) : (
        ''
      )}
      {timer === '00' && counter !== 6 ? (
        <LostModal
          title={lore[4].title_5}
          desc={lore[4].desc_5}
          startGameTimer={startGameTimer}
          shuffleCards={shuffleCards}
          setCounter={setCounter}
          timer={timer}
          counter={counter}
          audioRef={audioRefClock}
          setPlaying={setPlaying}
        />
      ) : (
        ''
      )}
    </div>
  )
}

export default App
