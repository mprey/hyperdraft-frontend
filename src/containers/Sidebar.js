import React, { Component } from 'react'
import classNames from 'classnames'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import client from '../socket'

import {
  SettingsSidebar,
  DepositSidebar,
  AffiliatesSidebar
} from '../components'

import {
  loadInventory,
  createAffiliateCode,
  redeemAffiliateCode,
  loadAffiliateStats,
  claimAffiliateBalance
} from '../actions'

class Sidebar extends Component {

  updateTradeURL(value) {
    return client.emitAction('setTradeURL', { tradeurl: value })
  }

  render() {
    const { claimAffiliateBalance, loadAffiliateStats, redeemAffiliateCode, affiliate, setCurrentTab, currentTab, isOpen, inventory, user, loadInventory, createAffiliateCode } = this.props
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
        <AffiliatesSidebar currentTab={currentTab} claimAffiliateBalance={claimAffiliateBalance} loadAffiliateStats={loadAffiliateStats} user={user} redeemAffiliateCode={redeemAffiliateCode} createAffiliateCode={createAffiliateCode} affiliate={affiliate}/>
      </div>
    )
  }

}

const mapStateToProps = (state) => {
  return {
    user: state.auth.user,
    inventory: state.user.inventory,
    affiliate: state.user.affiliate
  }
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({
    loadInventory,
    createAffiliateCode,
    redeemAffiliateCode,
    loadAffiliateStats,
    claimAffiliateBalance
  }, dispatch)
}


export default connect(mapStateToProps, mapDispatchToProps)(Sidebar)
