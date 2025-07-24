import styles from "./app.module.css";

import { Header } from "./components/Header";
import { Letter } from "./components/Letter";
import { Button } from "./components/Button";
import { Input } from "./components/Input";
import { LettersUsed } from "./components/LettersUsed";
import { Tip } from "./components/Tip";

export default function App() {
  function handlerRestartGame() {
    alert("Jogo reiniciado!");
  }

  return (
    <div className={styles.container}>
      <main>
        <Header current={5} max={10} onRestart={handlerRestartGame} />
        <Tip tip="Uma das linguagens de programação mais utilizadas" />

        <div className={styles.word}>
          <Letter value="R" />
          <Letter value="E" />
          <Letter value="A" />
          <Letter value="C" />
          <Letter value="T" />
        </div>

        <h4>Palpite</h4>

        <div className={styles.guess}>
          <Input autoFocus maxLength={1} placeholder="?"/>
          <Button title="Confirmar"/>
        </div>

        <LettersUsed/>
      </main>
    </div>
  );
}
