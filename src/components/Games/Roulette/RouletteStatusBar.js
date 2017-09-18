import React, { Component } from 'react'
import { RouletteRoller } from './RouletteRoller'

const COUNTDOWN = 20

class RouletteStatusBar extends Component {

  constructor(props) {
    super(props)

    this.state = {
      countdown: 0
    }
  }

  startCountdown() {
    this.setState({ countdown: COUNTDOWN })
    this.interval = setInterval(() => {
      this.setState({ countdown: this.state.countdown - 1 })
      if (this.state.countdown === 1) {
        this.endCountdown()
      }
    }, 1000)
  }

  endCountdown() {
    clearInterval(this.interval)
  }

  isRolling() {
    return this.props.status === 'winner_picked'
  }

  renderStatusBar() {
    const { status, currentGame, onComplete } = this.props
    if (status === 'winner_picked') {
      return <RouletteRoller game={currentGame} onComplete={onComplete} />
    }

    var message = null
    if (status === 'running') {
      this.startCountdown()
      message = ''
    } else if (status === 'open') {
      message = 'creating new game...'
    }
  }

  render() {
    return (

    )
  }

}

export { RouletteStatusBar }
