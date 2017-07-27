import React, { Component } from 'react'
import classNames from 'classnames'
import { alert } from '../../actions'

class AffiliatesSidebar extends Component {

  constructor(props) {
    super(props)

    this.createCode = this.createCode.bind(this)
    this.redeemCode = this.redeemCode.bind(this)
    this.hasCreatedCode = this.hasCreatedCode.bind(this)
    this.claimBalance = this.claimBalance.bind(this)
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.currentTab === 'affiliates' && this.props.currentTab !== 'affiliates') {
      if (!this.props.affiliate.loading && !this.props.affiliate.loaded) {
        this.props.loadAffiliateStats(this.props.user)
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

  claimBalance() {
    const code = this.getCodeDetails()
    this.props.claimAffiliateBalance(this.props.user, code.id)
  }

  hasCreatedCode() {
    const { user, affiliate } = this.props
    if (user && user.partnerCode) {
      return affiliate.codeDetails[0]
    }
    return false
  }

  getCodeDetails() {
    const { codeDetails } = this.props.affiliate
    return codeDetails[0]
  }

  renderCodeDetails() {
    if (this.hasCreatedCode()) {
      const code = this.getCodeDetails()
      return (
        <div className="module module-affiliate affiliate-info-data">
          <p><i className="add user icon" />You referred <b>{code.slaves}</b> users using code <b>{code.id}</b></p>
          <p><i className="add to cart icon" />Number of referrals deposited: <b>{code.verifiedSlaves}/{code.slaves}</b></p>
          <p><i className="info circle icon" />Current Rank: <b>{code.rank.current}</b></p>

          <button className={classNames({'affiliate-button': true, 'ui': true, 'button': true, 'loading': this.props.affiliate.claiming})} onClick={this.claimBalance}>
            <span>
              Claim <span className="claimable">${code.balance}</span>
            </span>
          </button>
        </div>
      )
    }
    return null
  }

  renderLevelsTable() {
    const { levelDetails } = this.props.affiliate
    return Object.keys(levelDetails).map((key, index) => {
      const level = levelDetails[key]
      return (
        <tr key={index}>
          <td>{key}</td>
          <td>{level.min} - {level.max}</td>
          <td>{level.payout * 100}%</td>
        </tr>
      )
    })
  }

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
              { this.renderCodeDetails() }
              <table className="ui celled table affiliate-table">
                <thead>
                  <tr>
                    <th>Level</th>
                    <th>Unique Depositors</th>
                    <th>Your Commision</th>
                  </tr>
                </thead>
                <tbody>
                  { this.renderLevelsTable() }
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    )
  }

}

export { AffiliatesSidebar }
