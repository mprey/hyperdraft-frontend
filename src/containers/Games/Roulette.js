import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import classNames from 'classnames'
import { state } from '../../state'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'
import _ from 'lodash'
import CountUp from 'react-countup'

import {
  RouletteHelpModal,
  RouletteRoller
} from '../../components'

import {
  loadRouletteHistory,
  addRouletteHistoryGame,
  alert,
  joinRoulette
} from '../../actions'

import rouletteLogo from '../../static/img/games/roulette/logo.png'

const ROULETTE_CONFIG = 'roulette_main'
const HISTORY_MAX = 10

const selections = {
  '0': 'red',
  '1': 'black',
  '2': 'green'
}

class Roulette extends Component {

  constructor(props) {
    super(props)

    this.state = {
      helpModal: false,
      status: null,
      countdown: 0
    }

    this.totalSelectionsOld = {
      'black': 0,
      'red': 0,
      'green': 0
    }

    this.updateRouletteState = this.updateRouletteState.bind(this)
  }

  componentDidMount() {
    if (!this.props.roulette.loaded) {
      this.props.loadRouletteHistory(ROULETTE_CONFIG, HISTORY_MAX)
    }

    state.on('roulettes', this.updateRouletteState)
  }

  componentWillUnmount() {
    state.removeAllListeners('roulettes')
  }

  canBet() {
    return this.currentGame && this.state.status === 'running'
  }

  updateRouletteState(state, value, key) {
    const { status } = this.state
    if (value && value.status) {
      if (value.status !== status) {
        /* if there's no state status (the page just rendered, wait for the next game if the current game is rolling) */
        if (!status && value.status !== 'running') {
          return this.setState({ status: 'waiting' })
        }

        /* if the status is waiting, wait until the game is ended to set the status again */
        if (status === 'waiting' && value.status !== 'ended') return

        /* update the countdown and status if the current game is running */
        if (value.status === 'running') {
          return this.setState({ status: value.status, countdown: value.countdown })
        }

        this.setState({ status: value.status }) //open, running, pick_winner, winner_picked, ended

        /* add the game to the history once ended */
        if (value.status === 'ended') {
          this.props.addRouletteHistoryGame(value)
        }
      } else if (value.status === 'running') {
        this.setState({ countdown: value.countdown })
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

  alterInput(alter) {
    const { amount } = this.refs
    if (alter === 'clear') {
      return amount.value = null
    } else if (alter === 'max') {
      return amount.value = this.props.userWallet.redeemable
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

  joinRoulette(selection) {
    const currentGame = this.currentGame
    if (!currentGame) {
      return alert('error', 'Please refresh your page', 'Roulette')
    }

    if (this.props.roulette.joining) {
      return alert('error', 'You are already joining roulette', 'Roulette')
    }

    const amount = this.refs.amount.value
    if (!amount || !parseInt(amount, 10)) {
      return alert('error', 'Please enter a valid integer', 'Roulette')
    }

    this.refs.amount.value = ''
    this.props.joinRoulette(currentGame.id, parseInt(amount), selection)
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
    if (status === 'waiting') {
      message = 'Waiting for next game...'
    } else if (status === 'winner_picked') {
      return <RouletteRoller game={this.currentGame} onComplete={this.showWinner} />
    } else if (status === 'running') {
      message = `Rolling in ${this.state.countdown} seconds...`
    } else if (status === 'pick_winner') {
      message = 'Rolling...'
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

  showWinner() {
    console.log('show winner')
  }

  getUserDetailsFromBet(userid) {
    return this.currentGame.players[userid]
  }

  getTotalSelection(selection) {
    if (!this.currentGame) {
      return
    }

    const color = selections[selection]

    const bets = _.filter(this.currentGame.bets, (bet) => bet.selection === color)

    var total = 0.00
    for (var i = 0; i < bets.length; i++) {
      total += bets[i].value
    }

    const start = this.totalSelectionsOld[color] + 0
    this.totalSelectionsOld[color] = total

    return <CountUp end={total} start={start} duration={2} />
  }

  renderSelection(selection) {
    if (!this.currentGame) {
      return
    }

    const color = selections[selection]

    const bets = _.sortBy(_.filter(this.currentGame.bets, (bet) => bet.selection === color), 'value').reverse()

    return bets.map((bet, index) => {
      const betUser = this.getUserDetailsFromBet(bet.userid)
      const { user } = this.props
      return (
        <tr className={classNames({ 'listing': true, 'highest': index === 0 })} data-amount={bet.value} key={index}>
          <td className="pp"><img src={betUser.avatar.medium} /></td>
            <td className={classNames({ 'name': true, 'own': (bet.userid === (user ? user.id : null)) })} data-id={betUser.id}><span>{betUser.username}</span></td>
          <td className="wager">{bet.value} <i className="hc"></i></td>
        </tr>
      )
    })
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
              <ReactCSSTransitionGroup
                transitionName="slide"
                transitionLeaveTimeout={0}
                transitionEnterTimeout={500}
              >
                { this.renderHistoryGames() }
              </ReactCSSTransitionGroup>
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
                <div className="header" onClick={() => this.joinRoulette('red')}>
                  Red (even)
                  <div className="total">
                    { this.getTotalSelection('0') }
                  </div>
                </div>
                <table className="entries">
                  <tbody>
                    { this.renderSelection('0') }
                  </tbody>
                </table>
              </div>
            </div>
            <div className="column panel">
              <div className="ui segment blue"/*disabled*/ data-selection="2">
                <div className="header" onClick={() => this.joinRoulette('green')}>
                  Blue (0)
                  <div className="total">
                    { this.getTotalSelection('2') }
                  </div>
                </div>
                <table className="entries">
                  <tbody>
                    { this.renderSelection('2') }
                  </tbody>
                </table>
              </div>
            </div>
            <div className="column panel">
              <div className="ui segment black" data-selection="1">
                <div className="header" onClick={() => this.joinRoulette('black')}>
                  Black (odd)
                  <div className="total">
                    { this.getTotalSelection('1') }
                  </div>
                </div>
                <table className="entries">
                  <tbody>
                    { this.renderSelection('1') }
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

}

const mapStateToProps = (state) => {
  return {
    roulette: state.games.roulette,
    userWallet: state.user.wallet,
    user: state.auth.user
  }
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({
    loadRouletteHistory,
    addRouletteHistoryGame,
    joinRoulette
  }, dispatch)
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Roulette)
