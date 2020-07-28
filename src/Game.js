import React, { Component } from "react";
import Dice from "./Dice";
import ScoreTable from "./ScoreTable";
import "./Game.css";

/**
 * Constants
 */
const NUM_DICE = 5;
const NUM_ROLLS = 3;

class Game extends Component {
  constructor(props) { //init state here
    super(props);
    this.state = {
      dice: Array.from({ length: NUM_DICE }), //length from const
      locked: Array(NUM_DICE).fill(false), //no dice locked
      rollsLeft: NUM_ROLLS, //const
      rolling: false, //not rolling
      scores: { //init
        ones: undefined,
        twos: undefined,
        threes: undefined,
        fours: undefined,
        fives: undefined,
        sixes: undefined,
        threeOfKind: undefined,
        fourOfKind: undefined,
        fullHouse: undefined,
        smallStraight: undefined,
        largeStraight: undefined,
        yahtzee: undefined,
        chance: undefined
      }
    };
    /**
     * Function bindings for handler methods
     */
    console.log(this.state);
    this.roll = this.roll.bind(this);
    this.doScore = this.doScore.bind(this);
    this.toggleLocked = this.toggleLocked.bind(this);
    this.animateRoll = this.animateRoll.bind(this);
  }
  componentDidMount() { //set up animation when the componenetn mounts successfully
    this.animateRoll();
  }

  animateRoll() {
    this.setState({ rolling: true }, () => { //set state to be rolling
      setTimeout(this.roll, 1000); //roll duration = 1 sec
    });
  }

  roll(evt) {
    // roll dice whose indexes are in reroll
    this.setState(st => ({
      dice: st.dice.map((d, i) =>
        st.locked[i] ? d : Math.ceil(Math.random() * 6) //roll dice if not locked
      ),
      locked: st.rollsLeft > 1 ? st.locked : Array(NUM_DICE).fill(true), //lock all dice if no rolls left
      rollsLeft: st.rollsLeft - 1, //decrement on roll
      rolling: false //no longer rolling
    }));
  }

  toggleLocked(idx) {
    // toggle whether idx is in locked or not
    if (this.state.rollsLeft > 0 && !this.state.rolling) {
      this.setState(st => ({
        locked: [
          ...st.locked.slice(0, idx), //preserve array in front
          !st.locked[idx], //toggle the index we want
          ...st.locked.slice(idx + 1) //preserve array in back
        ]
      }));
    }
  }

  doScore(rulename, ruleFn) {
    // evaluate this ruleFn with the dice and score this rulename
    this.setState(st => ({
      scores: { ...st.scores, [rulename]: ruleFn(this.state.dice) }, //add in prev scores, passing the current func and rule name to the last index
      rollsLeft: NUM_ROLLS, //set rolls
      locked: Array(NUM_DICE).fill(false) //unlock all dice
    }));
    this.animateRoll(); //rolling animation
  }

  displayRollInfo() {
    const messages = [ //messages to show on the rolling button (reversed to get by index)
      "No Rolls Left!",
      "1 Roll Left",
      "2 Rolls Left",
      "Starting Round..."
    ];
    return messages[this.state.rollsLeft]; //return the text needed
  }

  render() {
    const { dice, locked, rollsLeft, rolling, scores } = this.state; //pull vars from state for easy access down below
    return (
      <div className='Game'>
        <header className='Game-header'>
          <h1 className='App-title'>Yahtzee!</h1>
          <section className='Game-dice-section'>
            <Dice
              dice={dice} //get from state.dice
              locked={locked} //get from state.locked
              handleClick={this.toggleLocked} //call toggle handler method
              disabled={rollsLeft === 0} //disabld when no rolls are remaining
              rolling={rolling} //set from state.rolling
            />
            <div className='Game-button-wrapper'>
              <button
                className='Game-reroll'
                disabled={locked.every(x => x) || rollsLeft === 0 || rolling} //disable if currently rolling
                onClick={this.animateRoll} //call animate method
              >
                {this.displayRollInfo()}
              </button>
            </div>
          </section>
        </header>
        <ScoreTable doScore={this.doScore} scores={scores} />
      </div>
    );
  }
}

export default Game;
