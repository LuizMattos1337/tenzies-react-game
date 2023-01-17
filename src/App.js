import React, { useState, useEffect } from 'react';
import './style.css';
import Die from './components/Die';
import { nanoid } from 'nanoid';
import Confetti from 'react-confetti';

export default function App() {
  /* Setting States */
  const [diceArray, setDiceArray] = useState(allNewDice());
  const [tenzies, setTenzies] = useState(false);

  /* Setting Effect */
  useEffect(() => {
    if (checkIfWon()) {
      setTenzies(true);
    } else {
      setTenzies(false);
    }

    return () => {
      /* Cleanup functions go here */
    };
  }, [diceArray]);

  /**
   * @param {number} [count = 10] - The number of dice to be generated
   * @param {number} [maxValue = 6] - The maximum face value of the dice generated
   */
  function allNewDice(count = 10, maxValue = 6) {
    const randomArray = [];
    for (let i = 0; i < count; i++) {
      randomArray.push(makeNewDie(maxValue));
    }
    return randomArray;
  }

  /**
   * Generates a die object
   * @param {number} [maxValue = 6] - The maximum value of the die generated.
   * @returns {object} A die object with a randomly generated value between 1 and maxValue
   */
  function makeNewDie(maxValue = 6) {
    return {
      value: Math.ceil(Math.random() * maxValue),
      isHeld: false,
      id: nanoid(),
    };
  }

  /**
   * If the Tenzies game is won, will reset the game and dice values
   * If the Tenzies game is not won, will reroll the unheld dice
   * @param {number} [diceCount = 10] The number of dice to be generated when resetting the game
   * @param {maxValue} [maxValue = 6] Maximum value of the die generated when resetting the game
   */
  function rollDice(diceCount = 10, maxValue = 6) {
    if (!tenzies) {
      setDiceArray((oldDiceArray) => {
        return oldDiceArray.map((oldDie) => {
          return oldDie.isHeld ? oldDie : makeNewDie();
        });
      });
    } else {
      setDiceArray(allNewDice());
    }
  }

  /**
   * Toggles the held state of a die component
   * @param {string} dieIdToHold - The id of the die to toggle held state
   */
  function holdDice(dieIdToHold) {
    setDiceArray((prevArray) => {
      return prevArray.map((die) =>
        die.id !== dieIdToHold ? die : { ...die, isHeld: !die.isHeld }
      );
    });
  }

  /**
   * Checks if the Tenzies game has been won
   * @returns {boolean} Boolean value indicating if the game has been won
   */
  function checkIfWon() {
    return checkAllDiceHeld() && checkAllDiceMatch();

    function checkAllDiceHeld() {
      return diceArray.every((die) => die.isHeld);
    }
    function checkAllDiceMatch() {
      const firstDieValue = diceArray[0].value;
      return diceArray.every((die) => die.value === firstDieValue);
    }
  }

  const diceElements = diceArray.map((die) => (
    <Die
      value={die.value}
      isHeld={die.isHeld}
      key={die.id}
      id={die.id}
      holdDice={() => holdDice(die.id)}
    />
  ));

  return (
    <main>
      {tenzies && <Confetti />}
      <h1 className="title">Tenzies</h1>
      <p className="instructions">
        Roll until all dice are the same. Click each die to freeze it at its
        current value between rolls.
      </p>
      <div className="dice-container">{diceElements}</div>
      <button className="button-reroll" onClick={rollDice}>
        {tenzies ? 'New Game' : 'Roll'}
      </button>
    </main>
  );
}
