import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import classNames from 'classnames'
import { state } from '../../state'
import client from '../../socket'

import {
  RouletteHelpModal,
  RouletteRoller
} from '../../components'

import {
  loadRouletteHistory
} from '../../actions'

import rouletteLogo from '../../static/img/games/roulette/logo.png'

const ROULETTE_CONFIG = 'roulette_main'
const HISTORY_MAX = 10

class Roulette extends Component {

  constructor(props) {
    super(props)

    this.state = {
      helpModal: false,
      status: null,
      countdown: 0
    }

    this.updateRouletteState = this.updateRouletteState.bind(this)
  }

  componentDidMount() {
    if (!this.props.roulette.loaded) {
      this.props.loadRouletteHistory(ROULETTE_CONFIG, HISTORY_MAX)
    }

    state.on('roulettes', this.updateRouletteState)

    //TODO check if game is rolling, and wait for the next
  }

  componentWillUnmount() {
    state.removeAllListeners('roulettes')
  }

  updateRouletteState(state, value, key) {
    if (value && value.status) {
      if (value.status !== this.state.status) {
        this.setState({ status: value.status }) //open, running, pick_winner, winner_picked, ended
        if (value.status === 'winner_picked') {
          //TODO roll the roulette shit
        } else if (value.status === 'running') {
          this.countdown()
        }
      }
    }
  }

  get gameState() {
    return state.get('roulettes')
  }

  get currentGame() {
    if (this.gameState) {
      return this.gameState[Object.keys(this.gameState)[0]]
    }
  }

  countdown() {
    console.log(this.currentGame)
  }

  alterInput(alter) {
    const { amount } = this.refs
    if (alter === 'clear') {
      return amount.value = null
    } else if (alter === 'max') {
      //TODO set it equal to max
    }

    const operation = alter.charAt(0)
    var existing = parseInt(amount.value, 10)
    if (!existing) existing = 0

    if (operation === '+') {
      existing += parseInt(alter.substring(1), 10)
    } else if (operation === '*') {
      existing *= parseFloat(alter.substring(1), 10)
    }

    amount.value = `${existing}`
  }

  getOutcomeColor(outcome) {
    if (outcome === 0) { //blue
      return 'blue'
    } else if ((outcome % 2) === 0) { //even
      return 'red'
    } else { //odd
      return 'black'
    }
  }

  renderHistoryGames() {
    return this.props.roulette.history.map((game, index) => (
      <div className={`number ${this.getOutcomeColor(game.provable.outcome)}`} key={index}>
        {game.provable.outcome}
      </div>
    ))
  }

  renderRoller() {
    const { status } = this.state
    var message = null
    if (status === 'winner_picked' || status === 'ended') {
      return <RouletteRoller game={this.currentGame} />
    } else if (status === 'running') {
      message = 'rolling in x seconds...'
    } else if (status === 'pick_winner') {
      message = 'rolling...'
    }
    return (
      <div className="segment roll">
        <div className="overlay on">
          <div className="content">
            { message }
          </div>
        </div>
      </div>
    )
  }

  render() {
    const { currentTab } = this.props
    return (
      <div className={classNames({ 'ui tab inner roulette': true, 'active':  currentTab === 'roulette' })}>
        <RouletteHelpModal isOpen={this.state.helpModal} onClose={() => this.setState({ helpModal: false })} />
        <div className="info-meta">
          <span className="howto" onClick={() => this.setState({ helpModal: true })}><i className="question circle icon"></i> How to Play</span>
          <span className="provably-fair"><i className="lock icon"></i> Provably Fair</span>
        </div>
        <div className="ui container">
          <img src={rouletteLogo} alt="roulette" className="logo" />

          <div className="history">
            Previous Rolls
            <div className="list">
              { this.renderHistoryGames() }
            </div>
          </div>

          { this.renderRoller() }

          <div className="segment wager">
            <div className="ui action input">
              <input type="text" ref="amount" placeholder="Enter an amount.." />
              <button className="ui button" onClick={() => this.alterInput('clear')}>Clear</button>
              <button className="ui button" onClick={() => this.alterInput('+10')}>+10</button>
              <button className="ui button" onClick={() => this.alterInput('+50')}>+50</button>
              <button className="ui button" onClick={() => this.alterInput('+100')}>+100</button>
              <button className="ui button mobile" onClick={() => this.alterInput('*0.5')}>1/2</button>
              <button className="ui button mobile" onClick={() => this.alterInput('*2')}>x2</button>
              <button className="ui button" onClick={() => this.alterInput('max')}>Max</button>
            </div>
          </div>

          <div className="ui stackable three column grid bet-panels">
            <div className="column panel">
              <div className="ui segment red" data-selection="0">
                <div className="header">
                  Red (even)
                  <div className="total"></div>
                </div>
                <table className="entries"></table>
              </div>
            </div>
            <div className="column panel">
              <div className="ui segment blue" data-selection="2">
                <div className="header">
                  Blue (0)
                  <div className="total"></div>
                </div>
                <table className="entries"></table>
              </div>
            </div>
            <div className="column panel">
              <div className="ui segment black" data-selection="1">
                <div className="header">
                  Black (odd)
                  <div className="total"></div>
                </div>
                <table className="entries"></table>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const mapStateToProps = (state) => {
  return {
    roulette: state.games.roulette
  }
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({
    loadRouletteHistory
  }, dispatch)
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Roulette)
