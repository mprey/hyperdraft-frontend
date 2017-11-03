import React, { Component } from 'react'
import _ from 'lodash'
import { TimelineMax, Power4 } from 'gsap'
import { playSound } from '../../../actions'
import settings from '../../../settings'

import rouletteRoll from '../../../static/sounds/roulette-roll.mp3'

const NUMBERS = [0, 11, 6, 3, 10, 1, 12, 5, 14, 7, 4, 13, 2, 9, 8]
const MAX_TILES = 100
const MIN_THRESHOLD = 60
const ROLL_TIME = 8

class RouletteRoller extends Component {

  constructor(props) {
    super(props)

    this.currentNumbers = NUMBERS
    this.winningIndex = null //redundant but there so I remember :)
  }

  componentDidMount() {
    const tl = new TimelineMax({
      onComplete: this.props.onComplete,
    })

    const winnerX = this.findWinnerX()

    tl.to(this.refs.roller, ROLL_TIME, { x: -winnerX, ease: Power4.easeOut })

    if (!settings.disabledSounds) {
      playSound(rouletteRoll)
    }
  }

  findWinnerX() {
    return this.winningIndex * 80 + 40 + this.getRandomInt(-37, 37)
  }

  getTileColor(number) {
    if (number === 0) { //blue
      return 'blue'
    } else if ((number % 2) === 0) { //even
      return 'red'
    } else { //odd
      return 'black'
    }
  }

  getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  createTileArray() {
    this.tileArray = []

    const winningNumber = this.props.game ? this.props.game.provable.outcome : -1
    var counter = 0
    while (counter < MAX_TILES) {
      if (this.currentNumbers.length === 0) {
        this.currentNumbers = NUMBERS
      }

      var currentNumber = this.currentNumbers[0]
      this.currentNumbers = _.without(this.currentNumbers, currentNumber)

      if (counter > MIN_THRESHOLD && !this.winningIndex && (currentNumber === winningNumber)) {
        this.winningIndex = counter
      }

      this.tileArray.push(currentNumber)
      counter++
    }
  }

  renderTiles() {
    if (!this.tileArray) {
      this.createTileArray()
    }

    return this.tileArray.map((item, index) => (
      <div className={`number ${this.getTileColor(item)}`} key={index}>
        { item }
      </div>
    ))
  }

  render() {
    return (
      <div className="segment roll">
        <div className="list" ref="roller">
          { this.renderTiles() }
        </div>
        <div className="bar" />
      </div>
    )
  }

}

export { RouletteRoller }
