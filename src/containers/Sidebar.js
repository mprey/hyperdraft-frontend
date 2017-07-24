import React, { Component } from 'react'
import classNames from 'classnames'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import client from '../socket'

import {
  SettingsSidebar,
  DepositSidebar
} from '../components'

import {
  loadInventory
} from '../actions'

class Sidebar extends Component {

  updateTradeURL(value) {
    return client.emitAction('setTradeURL', { tradeurl: value })
  }

  render() {
    const { setCurrentTab, currentTab, isOpen, inventory, user, loadInventory } = this.props
    return (
      <div className={classNames({ 'sidebar-action': true, 'open': isOpen })}>
        <div className="close" onClick={() => this.props.setCurrentTab(null)}>
          <i className="material-icons">close</i>
        </div>
        <div className="ui top attached tabular menu">
          <a onClick={() => setCurrentTab('deposit')} className={classNames({ 'item': true, 'active': (currentTab === 'deposit') })} data-position="bottom center" data-tooltip="Steam Inventory"><i className="material-icons">add_circle</i></a>
          <a onClick={() => setCurrentTab('settings')} className={classNames({ 'item': true, 'active': (currentTab === 'settings') })} data-position="bottom center" data-tooltip="Settings"><i className="material-icons">settings</i></a>
          <a onClick={() => setCurrentTab('affiliates')} className={classNames({ 'item': true, 'active': (currentTab === 'affiliates') })} data-position="bottom center" data-tooltip="Affiliates"><i className="material-icons">supervisor_account</i></a>
        </div>
        <SettingsSidebar currentTab={currentTab} updateTradeURL={this.updateTradeURL} user={user} />
        <DepositSidebar currentTab={currentTab} loadInventory={loadInventory} inventory={inventory} />
        <div className={classNames({ 'ui': true, 'inner': true, 'segment': true, 'tab': true, 'affiliates': true, 'active': (currentTab === 'affiliates') })}>
          <h2 className="ui huge center aligned header">Affiliates Program</h2>
          <p className="desc">
            Our affiliate system is simple. Rewards are percentage based on rank, and rank will rise proportional to the amount of claims.
            <span className="hascode" style={{display: 'none'}}>
                  When users use your code, they will receive <span className="claimBonus"></span> <i className="hc"></i>, furthermore they will receive a bonus of <span className="depositBonus"></span> on their first deposit.
            </span>
          </p>

          <div className="affiliate-create">
            <div className="ui action input">
              <input type="text" placeholder="Enter a code.." />
              <button className="ui button">Create Code</button>
            </div>
            <small className="warning">You may only create one code, you cannot change it after it is created.</small>
          </div>
          <div className="affiliate-stats" style={{display: 'none'}}>
            <h2 className="ui center aligned header">Level <span className="level">1</span> Affiliate</h2>
            <div className="ui progress">
              <div className="bar">
                <div className="progress"></div>
              </div>
              <div className="label">{`400xp till next level`}</div>
            </div>
            <div className="info">
              You currently earn <span className="payoutPercent"></span> <i className="hc"></i> from bets your affiliates make.
            </div>
            <hr className="gradient" />
            <div className="ui three column grid stats">
              <div className="column">
                <div className="ui statistic">
                  <div className="value code">0</div>
                  <div className="label">
                    Your Code
                  </div>
                </div>
              </div>
              <div className="column">
                <div className="ui statistic">
                  <div className="value uses">0</div>
                  <div className="label">
                    Code Uses
                  </div>
                </div>
              </div>
              <div className="column">
                <div className="ui statistic">
                  <div className="value earned">0</div>
                  <div className="label">
                    Earnings (<i className="hc"></i>)
                  </div>
                </div>
              </div>
          {/*  <div className="column">
                <div className="ui statistic">
                  <div className="value deposits">0</div>
                  <div className="label">
                    Deposits
                  </div>
                </div>
              </div> */}
            </div>
            <div className="ui two column grid actions">
              <div className="column">
                <button className="ui button refresh">Refresh Statistics</button>
              </div>
              <div className="column">
                <button className="ui button collect">Collect Earnings</button>
              </div>
            </div>
          </div>

          <div className="redeem-code module">
            <i className="material-icons">card_giftcard</i>
            <h2 className="ui center aligned header">Redeem a Code</h2>
            <div className="ui action input">
              <input type="text" placeholder="Enter a code.." />
              <button className="ui button">Redeem Code</button>
            </div>
          </div>
        </div>
      </div>
    )
  }

}

const mapStateToProps = (state) => {
  return {
    user: state.auth.user,
    inventory: state.user.inventory
  }
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({
    loadInventory
  }, dispatch)
}


export default connect(mapStateToProps, mapDispatchToProps)(Sidebar)
