import React, { Component } from "react";
import "./Die.css";

class Die extends Component {
  static defaultProps = { //use to get dice face assets
    numberWords: ["one", "two", "three", "four", "five", "six"],
    val: 5
  };
  constructor(props) { //bind handler
    super(props);

    this.handleClick = this.handleClick.bind(this);
  }
  handleClick() { //lock the dice using a call to props func passing idx from props as well
    this.props.handleClick(this.props.idx);
  }

  render() { 
    const { numberWords, locked, val, disabled, rolling } = this.props;
    let classes = `Die fas fa-dice-${numberWords[val - 1]} fa-5x `; //use to get dice face assets
    if (locked) classes += "Die-locked";
    if (rolling) classes += "Die-rolling";
    return (
      <i className={classes} onClick={this.handleClick} disabled={disabled} />
    );
  }
}

export default Die;
