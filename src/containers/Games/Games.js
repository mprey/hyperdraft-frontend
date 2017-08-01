import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import classNames from 'classnames'

import Coinflip from './Coinflip'
import Jackpot from './Jackpot'
import Roulette from './Roulette'

import rouletteMenu from '../../static/img/games/roulette/menu.png'
import rouletteLogo from '../../static/img/games/roulette/logo.png'
import jackpotMenu from '../../static/img/games/jackpot/menu.png'
import jackpotLogo from '../../static/img/games/jackpot/logo.png'
import coinflipMenu from '../../static/img/games/coinflip/menu.png'

class Games extends Component {

  constructor(props) {
    super(props)

    this.state = {
      currentTab: 'roulette'
    }
  }

  render() {
    const { currentTab } = this.state
    return (
      <div className="inner-content games">
        <div className="section section-menu">
          <div className="ui secondary stackable pointing menu games-menu">
            <a className={classNames({ 'item': true, 'active':  currentTab === 'roulette' })} onClick={() => this.setState({ currentTab: 'roulette' })}>
              <img src={rouletteMenu} alt="roulette" /> Roulette
              <span className="status"><i className="hc"></i> 0</span>
            </a>
            <a className={classNames({ 'item': true, 'active':  currentTab === 'jackpot' })} onClick={() => this.setState({ currentTab: 'jackpot' })}>
              <img src={jackpotMenu} alt="jackpot" /> Jackpot
            </a>
            <a className={classNames({ 'item': true, 'active':  currentTab === 'coinflip' })} onClick={() => this.setState({ currentTab: 'coinflip' })}>
              <img src={coinflipMenu} alt="coinflip" /> Coinflip
              <span className="status"><i className="hc"></i> 0</span>
            </a>
          </div>
        </div>
        <div className="section section-content">
          <Coinflip currentTab={currentTab} />
          <div className={classNames({ 'ui': true, 'tab': true, 'inner': true, 'roulette': true, 'active':  currentTab === 'roulette' })}>
            <div className="info-meta">
              <span className="howto"><i className="question circle icon"></i> How to Play</span>
              <span className="provably-fair"><i className="lock icon"></i> Provably Fair</span>
            </div>
            <div className="ui container">
              <img src={rouletteLogo} alt="roulette" className="logo" />

              <div className="history">
                Previous Rolls
                <div className="list"></div>
              </div>

              <div className="segment roll">
                <div className="overlay on">
                  <div className="content"></div>
                </div>
                <div className="list"></div>
                <div className="bar"></div>
              </div>

              <div className="segment wager">
                <div className="ui action input">
                  <input type="text" placeholder="Enter an amount.." />
                  <button className="ui button" data-value="clear">Clear</button>
                  <button className="ui button" data-value="+ 10">+10</button>
                  <button className="ui button" data-value="+ 50">+50</button>
                  <button className="ui button" data-value="+ 100">+100</button>
                  <button className="ui button mobile" data-value="half">1/2</button>
                  <button className="ui button mobile" data-value="* 2">x2</button>
                  <button className="ui button" data-value="max">Max</button>
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
          <div className={classNames({ 'ui': true, 'tab': true, 'inner': true, 'coinflip': true, 'active':  currentTab === 'jackpot' })}>
            <div className="info-meta">
              <span className="howto"><i className="question circle icon"></i> How to Play</span>
              <span className="provably-fair"><i className="lock icon"></i> Provably Fair</span>
            </div>
            <div className="ui container">

              <img src={jackpotLogo} alt="jackpot" className="logo" />

              <div className="ui stackable grid game">
                <div className="sixteen wide mobile  sixteen wide tablet  twelve wide computer  twelve wide widescreen  column">
                  <div className="ui segment status">
                    <div className="ui top attached tabular menu">
                      <a className="item active" data-tab="jackpot-small">Small</a>
                      <a className="item" data-tab="jackpot-mid">Medium</a>
                      <a className="item" data-tab="jackpot-large">Large</a>
                    </div>
                    <div className="ui three column divided grid">
                      <div className="row">
                        <div className="ui three statistics">
                          <div className="ui mini statistic">
                            <div className="value timer">
                              0
                            </div>
                            <div className="label">
                              Timer
                            </div>
                          </div>
                          <div className="ui tiny statistic">
                            <div className="value item-count">
                              <span>0</span><small>/0</small>
                            </div>
                            <div className="label">
                              Items This Round
                            </div>
                          </div>
                          <div className="ui tiny statistic">
                            <div className="value pot-worth">
                              0 <i className="hc"></i>
                            </div>
                            <div className="label">
                              Pot Total
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="ui bottom attached progress indicating timer-progress">
                      <div className="bar"></div>
                    </div>
                  </div>
                  <div className="pot-roll" style={{display: 'none'}}>
                    <div className="line"></div>
                    <div className="entrylist"></div>
                  </div>
                  <div className="pot-items"></div>
                </div>
                <div className="sixteen wide mobile  sixteen wide tablet  four wide computer  four wide widescreen  column">
                  <button className="ui fluid button enter-btn">
                    Enter Jackpot
                  </button>
                  <div className="items pot-entries"></div>
                </div>
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

  }
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({

  }, dispatch)
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Games)
