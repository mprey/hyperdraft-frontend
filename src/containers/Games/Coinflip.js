import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import classNames from 'classnames'
import { state } from '../../state'

import {
  loadCoinflipHistory
} from '../../actions'

import coinflipLogo from '../../static/img/games/coinflip/logo.png'

const CONFIG = 'coinflip'
const HISTORY_LIMIT = 8

class Coinflip extends Component {

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
        value += parseFloat(this.gameState[key].value)
      }
      return Number(value * 100).toFixed(2)
    }
    return 0.00
  }

  createCoinflip() {
    console.log('creating')
  }

  renderCoinflipHistory() {
    console.log(this.props.coinflip)
  }

  renderLiveGames() {

  }

  render() {
    const { currentTab } = this.props
    return (
      <div className={classNames({ 'ui': true, 'tab': true, 'inner': true, 'coinflip': true, 'active':  currentTab === 'coinflip' })}>
        <div className="info-meta">
          <span className="howto"><i className="question circle icon"></i> How to Play</span>
          <span className="provably-fair"><i className="lock icon"></i> Provably Fair</span>
        </div>
        <div className="ui container">

          <img src={coinflipLogo} alt="coinflip" className="logo" />

          <div className="ui stackable grid game">
            <div className="twelve wide column games-container">
              <div className="ui segment">
                <div className="header">
                  <span className="title">Current Coinflips</span>
                  <span className="create" onClick={this.createCoinflip}><i className="pencil icon"></i> Create</span>
                </div>
                <table></table>
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
                  </div>
                  <div className="label">
                    Total Value
                  </div>
                </div>
              </div>
              <div className="ui segment history">
                <h1 className="ui center aligned header">History</h1>
                <table>
                  { this.renderCoinflipHistory() }
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
