import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import classNames from 'classnames'
import _ from 'lodash'
import { state } from '../../state'

import {
  loadCoinflipHistory
} from '../../actions'

import {
  CoinflipListing,
  CoinflipHistoryListing,
  CoinflipCreateModal,
  CoinflipWatchModal,
  CoinflipJoinModal,
  CoinflipHelpModal
} from '../../components'

import coinflipLogo from '../../static/img/games/coinflip/logo.png'

const CONFIG = 'coinflip'
const HISTORY_LIMIT = 8

class Coinflip extends Component {

  constructor(props) {
    super(props)

    this.state = {
      createModal: false,
      helpModal: false
    }
  }

  componentDidMount() {
    if (!this.props.coinflip.loaded) {
      this.props.loadCoinflipHistory(CONFIG, HISTORY_LIMIT)
    }
  }

  get currentCoinflips() {
    if (this.gameState) {
      return Object.keys(this.gameState).length
    }
    return 0
  }

  get gameState() {
    return state.get('coinflips')
  }

  get totalValue() {
    if (this.gameState) {
      var value = 0.00
      for (const key in this.gameState) {
        value += parseFloat(this.gameState[key].value) * 100
      }
      return Number(value).toFixed(0)
    }
    return 0.00
  }

  createCoinflip(side, amount) {
    console.log('creating')
  }

  updateStatus() {
    if (this.props.status) {
      this.props.status.innerHTML = this.totalValue
    }
  }

  renderHistoryGames() {
    return this.props.coinflip.history.map((game, index) => (
      <CoinflipHistoryListing game={game} key={index} />
    ))
  }

  renderLiveGames() {
    const games = _.sortBy(this.gameState, 'value').reverse()
    return games.map((game, index) => (
      <CoinflipListing game={game} key={index} />
    ))
  }

  render() {
    const { currentTab } = this.props
    return (
      <div className={classNames({ 'ui': true, 'tab': true, 'inner': true, 'coinflip': true, 'active':  currentTab === 'coinflip' })}>

        {/* Modals */}
        <CoinflipCreateModal
          isOpen={this.state.createModal}
          createCoinflip={this.createCoinflip}
          onClose={() => this.setState({ createModal: false })}
        />
        <CoinflipHelpModal
          isOpen={this.state.helpModal}
          onClose={() => this.setState({ helpModal: false })}
        />

        <div className="info-meta">
          <span className="howto" onClick={() => this.setState({ helpModal: true })}><i className="question circle icon"></i> How to Play</span>
          <span className="provably-fair"><i className="lock icon"></i> Provably Fair</span>
        </div>
        <div className="ui container">

          <img src={coinflipLogo} alt="coinflip" className="logo" />

          <div className="ui stackable grid game">
            <div className="twelve wide column games-container">
              <div className="ui segment">
                <div className="header">
                  <span className="title">Current Coinflips</span>
                  <span className="create" onClick={() => this.setState({ createModal: true })}><i className="pencil icon"></i> Create</span>
                </div>
                <table>
                  <tbody>
                    { this.renderLiveGames() }
                  </tbody>
                </table>
              </div>

            </div>
            <div className="four wide column info">
              <div className="ui segment stats">
                <h1 className="ui center aligned header">Stats</h1>
                <div className="ui statistic">
                  <div className="value total-count">
                    { this.currentCoinflips }
                  </div>
                  <div className="label">
                    Current Coinflips
                  </div>
                </div>
                <div className="ui statistic">
                  <div className="value total-value">
                    { this.totalValue }
                    { this.updateStatus() }
                  </div>
                  <div className="label">
                    Total Value
                  </div>
                </div>
              </div>
              <div className="ui segment history">
                <h1 className="ui center aligned header">History</h1>
                <table>
                  <tbody>
                    { this.renderHistoryGames() }
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
    coinflip: state.games.coinflip
  }
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({
    loadCoinflipHistory
  }, dispatch)
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Coinflip)
