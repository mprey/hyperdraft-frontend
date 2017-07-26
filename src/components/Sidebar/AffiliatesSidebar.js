import React, { Component } from 'react'
import classNames from 'classnames'
import { alert } from '../../actions'

class AffiliatesSidebar extends Component {

  constructor(props) {
    super(props)

    this.createCode = this.createCode.bind(this)
    this.redeemCode = this.redeemCode.bind(this)
    this.hasCreatedCode = this.hasCreatedCode.bind(this)
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.currentTab === 'affiliates' && this.props.currentTab !== 'affiliates') {
      if (!this.props.affiliate.loading && !this.props.affiliate.loaded && this.hasCreatedCode()) {
        //this.props.loadAffiliateStats(this.props.user)
      }
    }
  }

  createCode() {
    const code = this.refs.createCode.value

    if (!code || code === '') {
      return alert('error', 'Code must not be empty', 'Affiliates')
    } else if (this.props.affiliate.creating) {
      return alert('error', 'You are already creating a code', 'Affiliates')
    }

    this.props.createAffiliateCode(code)
  }

  redeemCode() {
    const code = this.refs.redeemCode.value

    if (!code || code === '') {
      return alert('error', 'Code must not be empty', 'Affiliates')
    } else if (this.props.affiliate.redeeming) {
      return alert('error', 'You are already redeeming a code', 'Affiliates')
    }

    this.props.redeemAffiliateCode(code)
  }

  hasCreatedCode() {
    const code = this.props.user ? this.props.user.partnerCode : null
    return code && code.length > 0
  }
  /*
  renderAffiliateData() {
    const hasCode = this.hasCreatedCode()
    if (hasCode) {
      if (!this.props.affiliate.loading) {
        return (
          <div>
          <p className="desc">
            Our affiliate system is simple. Rewards are percentage based on rank, and rank will rise proportional to the amount of claims.
            <span className="hascode">
                  <br />When users use your code, they will receive <span className="claimBonus"></span> <i className="hc"></i>, furthermore they will receive a bonus of <span className="depositBonus"></span> on their first deposit.
            </span>
          </p>

          <div className="affiliate-stats">
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
          </div>
        )
      }
    } else {
      return (
        <div>
        <p className="desc">
          Use a referral code to claim a <b>FREE $5</b> or share your own referral code and earn up to <b>5%</b>!
        </p>

        <div className="affiliate-create">
          <div className="ui action input">
            <input ref="createCode" type="text" placeholder="Enter a code.." />
            <button className="ui button" onClick={this.createCode}>Create Code</button>
          </div>
          <small className="warning">You may only create one code, you cannot change it after it is created.</small>
        </div>
        <div className="redeem-code module">
          <i className="material-icons">card_giftcard</i>
          <h2 className="ui center aligned header">Redeem a Code</h2>
          <div className="ui action input">
            <input ref="redeemCode" type="text" placeholder="Enter a code.." />
            <button className="ui button" onClick={this.redeemCode}>Redeem Code</button>
          </div>
        </div>
        </div>
      )
    }
  } */

  render() {
    const { currentTab } = this.props
    return (
      <div className={classNames({ 'ui': true, 'inner': true, 'segment': true, 'tab': true, 'affiliates': true, 'active': (currentTab === 'affiliates'), 'loading': this.props.affiliate.loading })}>
        <h2 className="ui huge center aligned header">Affiliates Program</h2>
        <p className="desc">
          Use a referral code to claim a <b>FREE $5</b> or share your own referral code and earn up to <b>5%</b>!
          Use the buttons below to get started with our affiliates system.
          <br />
          <span className="warning">You must be verified in order to create referral codes.</span>
        </p>
        <div className="ui grid">
          <div className="two column row">
            <div className="column">
              <div className="redeem-code module">
                <p>Redeem a referral code for a <b>FREE $5</b>:</p>
                <div className="ui action input">
                  <input ref="redeemCode" type="text" placeholder="Enter a code.." />
                  <button className={classNames({'ui': true, 'button': true, 'loading': this.props.affiliate.redeeming})} onClick={this.redeemCode}>Redeem</button>
                </div>
              </div>
            </div>
            <div className="column">
              <div className="redeem-code module">
                <p>Create a referral code and earn up to <b>5%</b> per referral:</p>
                <div className="ui action input">
                  <input ref="createCode" type="text" placeholder="Enter a code.." />
                  <button className={classNames({'ui': true, 'button': true, 'loading': this.props.affiliate.creating})} onClick={this.createCode}>Create</button>
                </div>
              </div>
            </div>
          </div>
          <div className="one column row" style={{paddingBottom: '0'}}>
            <div className="column" style={{textAlign: 'center'}}>
              <h2 className="ui header">How to Redeem</h2>
            </div>
          </div>
          <div className="two column row">
            <div className="column">
              <div className="module module-affiliate">
                <h3 className="affiliate-info-head">On Referall Code Use</h3>
                <div className="ui list affiliate-list">
                  <div className="item">
                    <i className="right triangle icon"></i>
                    <div className="content">
                      <div className="header">Redeem</div>
                      <div className="description">
                        Use a referral code to claim a free $5 <b>non-redeemable</b>.
                      </div>
                    </div>
                  </div>
                  <div className="item">
                    <i className="right triangle icon"></i>
                    <div className="content">
                      <div className="header">Play</div>
                      <div className="description">
                        Use the free $5 to play our jackpot or coinflip gamemode!
                      </div>
                    </div>
                  </div>
                  <div className="item">
                    <i className="right triangle icon"></i>
                    <div className="content">
                      <div className="header">Claim</div>
                      <div className="description">
                        Each win, you can claim 50% ofo the total round rake as <b>redeemable balance</b>. Your claimable redeemable balance is always capped at your total non-redeemable balance.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="column">
              <div className="module module-affiliate">
                <h3 className="affiliate-info-head">On Code Share</h3>
                <div className="ui list affiliate-list">
                  <div className="item">
                    <i className="right triangle icon"></i>
                    <div className="content">
                      <div className="header">Claim</div>
                      <div className="description">
                        Claim the balance earned by all of your referred users.
                      </div>
                    </div>
                  </div>
                  <div className="item">
                    <i className="right triangle icon"></i>
                    <div className="content">
                      <div className="header">Search</div>
                      <div className="description">
                        Check out all of our available items in our shop here!
                      </div>
                    </div>
                  </div>
                  <div className="item">
                    <i className="right triangle icon"></i>
                    <div className="content">
                      <div className="header">Withdraw</div>
                      <div className="description">
                        Withdraw all of your desired items using the balance earned from affiliates.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="one column row" style={{paddingBottom: '0'}}>
            <div className="column" style={{textAlign: 'center'}}>
              <h2 className="ui header">Affiliate Statistics</h2>
            </div>
          </div>
          <div className="one column row">
            <div className="column">
              <div className="module module-affiliate affiliate-info-data">
                <p><i className="add user icon" />You referred <b>{5}</b> users using code <b>{'test'}</b></p>
                <p><i className="add to cart icon" />Number of referrals deposited: <b>{3}/{5}</b></p>
                <p><i className="info circle icon" />Current Rank: <b>{'silver'}</b></p>

                <button className="affiliate-button ui button">
                  <span>
                    Claim <span className="claimable">${0.23}</span>
                  </span>
                </button>
              </div>
              <div className="affiliate-info-table">
                <table className="centered">
                  <thead>
                    <tr>
                      <th>Level</th>
                      <th>Unique Depositors</th>
                      <th>Your Commision (Of User Rake)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{0}</td>
                      <td>{5} - {5}</td>
                      <td>{5 * 100}}%</td>
                    </tr>
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

export { AffiliatesSidebar }
