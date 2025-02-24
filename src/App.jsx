import { useState } from "react"
import { languages } from "./components/languages"
import Confetti from "react-confetti"
import clsx from "clsx"
import { getFarewellText, getWords } from "./components/utils"


function App() {
  //state variable
  const [currentWord, setCurrentWord] = useState(() => getWords())
  const [guessedLetters, setGuessedLetters] = useState([])

  //derived varaiable
  const wrongGuessCount = guessedLetters.filter(letter => !currentWord.includes(letter)).length
  const isWon = currentWord.split("").every(letter => guessedLetters.includes(letter))
  const isLost = wrongGuessCount >= languages.length - 1
  const isOver = isWon || isLost

  //static variable
  const alphabet = "abcdefghijklmnopqrstuvwxyz"


  function addGuessedLetter(letter) {
    setGuessedLetters(prevLetters => prevLetters.includes(letter) ?
      prevLetters : [...prevLetters, letter]
    )
  }

  const languageElements = languages.map((language, index) => {
    const isLostLanguage = index < wrongGuessCount
    const className = clsx("chip", isLostLanguage && "lost")

    return (
      <span
        key={language.name}
        className={className}
        style={{
          backgroundColor: language.backgroundColor,
          color: language.color
        }}
      >
        {language.name}
      </span>)
  })

  const letterElements = currentWord.split("").map((letter, index) => (
    isLost ?
      <span style={{ color: "#BA2A2A" }} key={index}>{letter.toUpperCase()}</span>
      :
      <span key={index}>
        {guessedLetters.includes(letter) ? letter.toUpperCase() : ""}
      </span>
  ))


  const keyboardElements = alphabet.split("").map(letter => {
    const isGuessed = guessedLetters.includes(letter);
    const isCorrect = isGuessed && currentWord.includes(letter)
    const isWrong = isGuessed && !currentWord.includes(letter)
    const className = clsx({
      correct: isCorrect,
      wrong: isWrong
    })

    return (
      <button
        key={letter}
        onClick={() => addGuessedLetter(letter)}
        className={className}
        disabled={isOver}
      >
        {letter.toUpperCase()}
      </button>
    )

  }

  )

  const statusClass = clsx("game-status", {
    won: isWon,
    lost: isLost,
    farewell: wrongGuessCount > 0 && renderFarewellMessage() !== false && !isOver
  })

  function renderGameStatus() {
    if (!isOver) {
      return <p className="farewell-message">{renderFarewellMessage()}</p>
    }

    if (isWon) {
      return (
        <>
          <h2>You win!</h2>
          <p>Well done! 🎉</p>
        </>
      )
    }

    if (isLost) {
      return (
        <>
          <h2>Game over!</h2>
          <p>You lose! Better start learning Assembly 😭</p>
        </>
      )
    }

    return null
  }


  function renderFarewellMessage() {
    const farewellMessage = languages.map(lang => getFarewellText(lang.name));

    const lastGuessedLetter = guessedLetters[guessedLetters.length - 1];

    return !currentWord.includes(lastGuessedLetter) ? farewellMessage[wrongGuessCount - 1] : false;
  }

  function resetGame() {
    setCurrentWord(() => getWords())
    setGuessedLetters([])
  }

  return (
    <main>
      {isWon && <Confetti recycle={false} numberOfPieces={1000} />}
      <header>
        <h1>Assembly: Endgame</h1>
        <p>Guess the word within 8 attempts to keep the
          programming world safe from Assembly!</p>
      </header>

      <section className={statusClass}>
        {renderGameStatus()}
      </section>

      <section className="language-chips">
        {languageElements}
      </section>

      <section className="word">
        {letterElements}
      </section>

      <section className="keyboard">
        {keyboardElements}
      </section>

      {isOver &&
        <button className="new-game" onClick={resetGame}>
          New Game
        </button>}

    </main>
  )
}

export default App
