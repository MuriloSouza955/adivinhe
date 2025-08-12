import styles from "./app.module.css";
import { WORDS } from "./utils/words";
import type { Challenge } from "./utils/words";
import { useEffect, useState } from "react";

import { Header } from "./components/Header";
import { Letter } from "./components/Letter";
import { Button } from "./components/Button";
import { Input } from "./components/Input";
import { LettersUsed } from "./components/LettersUsed";
import type { LettersUsedProps } from "./components/LettersUsed";
import { Tip } from "./components/Tip";

const ATTEMPTS_MARGIN = 5;

export default function App() {
  const [score, setScore] = useState(0);
  const [letter, setLetter] = useState("");
  const [lettersUsed, setLettersUsed] = useState<LettersUsedProps[]>([]);
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [shake, setShake] = useState(false)

  function handlerRestartGame() {
    const isConfirmed = window.confirm("Você tem certeza que deseja reiniciar?")

    if(isConfirmed){
      startGame()
    }
  }

  function startGame() {
    const index = Math.floor(Math.random() * WORDS.length);
    const randomWord = WORDS[index];

    setChallenge(randomWord);

    setScore(0);
    setLetter("");
    setLettersUsed([]);
  }

  function handlerConfirm() {
    if (!challenge) {
      return;
    }

    if (!letter.trim()) {
      return alert("Digite uma letra!");
    }

    const value = letter.toUpperCase();
    const exist = lettersUsed.find(
      (used) => used.value.toUpperCase() === value
    );

    if (exist) {
      setLetter("");
      return alert("Você já utilizou esta letra " + value);
    }

    const hits = challenge.word
      .toUpperCase()
      .split("")
      .filter((char) => char === value).length;

    const correct = hits > 0;
    const currentScore = score + hits;

    setLettersUsed((prevState) => [...prevState, { value, correct }]);
    setScore(currentScore);
    setLetter("");

    if(!correct){
      setShake(true)
      setTimeout(() => setShake(false), 300)
    }
  }

  function endGame(message: string) {
    alert(message);
    startGame();
  }

  useEffect(() => {
    startGame();
  }, []);

  useEffect(() => {
    if (!challenge) {
      return;
    }
    setTimeout(() => {
      if (score === challenge.word.length) {
        return endGame("Parabéns, você descobriu a palavra!");
      }
      const attemptLimit = challenge.word.length + ATTEMPTS_MARGIN;
      if (lettersUsed.length === attemptLimit) {
        return endGame("Que pena, voce usou todas as tentativas!");
      }
    }, 200);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [score, lettersUsed.length]);

  if (!challenge) {
    return;
  }

  return (
    <div className={styles.container}>
      <main>
        <Header
          current={lettersUsed.length}
          max={challenge.word.length + ATTEMPTS_MARGIN}
          onRestart={handlerRestartGame}
        />
        <Tip tip={challenge.tip} />

        <div className={`${styles.word} ${shake && styles.shake}`}>
          {challenge.word.split("").map((letter, index) => {
            const letterUsed = lettersUsed.find(
              (used) => used.value.toUpperCase() === letter.toUpperCase()
            );
            return (
              <Letter
                key={index}
                value={letterUsed?.value}
                color={letterUsed?.correct ? "correct" : "default"}
              />
            );
            return <Letter key={index} value="" />;
          })}
        </div>

        <h4>Palpite</h4>

        <div className={styles.guess}>
          <Input
            autoFocus
            maxLength={1}
            placeholder="?"
            value={letter}
            onChange={(e) => setLetter(e.target.value)}
          />
          <Button title="Confirmar" onClick={handlerConfirm} />
        </div>

        <LettersUsed data={lettersUsed} />
      </main>
    </div>
  );
}
