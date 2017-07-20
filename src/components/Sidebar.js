import React, { Component } from 'react'
import classNames from 'classnames'
import $ from 'jquery'

class Sidebar extends Component {

  render() {
    const { setCurrentTab, currentTab, isOpen } = this.props
    return (
      <div className={classNames({ 'sidebar-action': true, 'open': isOpen })}>
        <div className="close" onClick={() => this.props.setCurrentTab(null)}>
          <i className="material-icons">close</i>
        </div>
        <div className="ui top attached tabular menu">
          {/*<a className="item" data-tab="sidebar-inventory-soon" data-position="bottom center" data-tooltip="Coming Soon"><i className="material-icons">archive</i></a>*/}
          <a onClick={() => setCurrentTab('deposit')} className={classNames({ 'item': true, 'active': (currentTab === 'deposit') })} data-position="bottom center" data-tooltip="Steam Inventory"><i className="material-icons">add_circle</i></a>
          <a onClick={() => setCurrentTab('settings')} className={classNames({ 'item': true, 'active': (currentTab === 'settings') })} data-position="bottom center" data-tooltip="Settings"><i className="material-icons">settings</i></a>
          <a onClick={() => setCurrentTab('affiliates')} className={classNames({ 'item': true, 'active': (currentTab === 'affiliates') })} data-position="bottom center" data-tooltip="Affiliates"><i className="material-icons">supervisor_account</i></a>
        </div>

        <div className={classNames({ 'ui': true, 'inner': true, 'segment': true, 'tab': true, 'deposit': true, 'active': (currentTab === 'deposit') })}>
          <h2 className="ui huge center aligned header">Your Steam Inventory</h2>
          <p className="desc">Minimum item value is $1.00 <br /> To withdraw, your total account deposits must be over $5.00</p>
          <div className="steam-inventory">
            <div className="sort">
              <div className="ui icon fluid input">
                <i className="refresh link icon"></i>
                <input type="text" placeholder="Search for an item..." />
              </div>
            </div>
            <div className="inventory"></div>
            <div className="stats">
              <div className="ui three column grid">
                <div className="column">
                  <div className="ui statistic">
                    <div className="value item-count">
                      0
                    </div>
                    <div className="label">
                      Item(s) Selected
                    </div>
                  </div>
                </div>
                <div className="column">
                  <div className="ui statistic">
                    <div className="value items-value">
                      0
                    </div>
                    <div className="label">
                      Value (USD)
                    </div>
                  </div>
                </div>
                <div className="column">
                  <div className="ui statistic">
                    <div className="value items-value-hc">
                      0
                    </div>
                    <div className="label">
                      Value (<i className="hc"></i>)
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <button className="ui button fluid send-trade-btn"><i className="send icon"></i> Send Trade Offer</button>
          </div>
        </div>
        <div className={classNames({ 'ui': true, 'inner': true, 'segment': true, 'tab': true, 'settings': true, 'active': (currentTab === 'settings') })}>
          <div className="ui container">
            <h1 className="ui header">Website Settings</h1>
            <div className="ui grid container checkboxes">
              <div className="sixteen wide column">
                <div className="ui toggle checkbox webSettings-confirmations">
                  <input type="checkbox" name="example" />
                  <label>Enable Desktop Notifications</label>
                </div>
              </div>
              <div className="sixteen wide column">
                <div className="ui toggle checkbox webSettings-sounds">
                  <input type="checkbox" name="example" />
                  <label>Disable Sounds</label>
                </div>
              </div>
            </div>
            <div className="webSettings-volume-slider">
              <label>Sounds Volume: <span className="val"></span></label>
              <div className="ui range sounds-volume-slider"></div>
            </div>

            <h1 className="ui header">Account Settings</h1>
            <form className="ui form">
              <div className="field">
                <label>Email</label>
                <div className="ui icon fluid input" data-tooltip="Your email is not confirmed, click on the warning icon to resend a confirmation.">
                  <i className="warning sign link icon"></i>
                  <input type="email" id="email" name="email" placeholder="Your Email" />
                </div>
              </div>
              <div className="field">
                <label>Steam Trade URL</label>
                <input type="url" id="steam_tradeUrl" name="steam-trade-url" placeholder="https://steamcommunity.com/tradeoffer/new/?partner=xxxx&token=xxxx" />
                <small><a href="https://steamcommunity.com/id/me/tradeoffers/privacy#trade_offer_access_url" target="_blank" rel="noopener noreferrer">Click here to retrieve it</a></small>
              </div>
            </form>

            <div className="btn-container">
              <button className="ui big button update-settings-btn">Update</button>
            </div>

            <div className="stats module">
              <i className="material-icons">history</i>
              <h2 className="ui center aligned header">History & Stats</h2>
              <p className="desc">Everything you do is logged so you can see what you did at any time, whenever you want.</p>
              <button className="ui big button" /*onClick="route.change('account')"*/>View Stats</button>
            </div>
          </div>
        </div>
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
        <div className={classNames({ 'ui': true, 'inner': true, 'segment': true, 'tab': true, 'inventory': true, 'active': (currentTab === 'inventory') })}>
          <h1 className="ui huge center aligned header">Your Inventory</h1>
          <div className="site-inventory">
            <div className="sort">
              <div className="ui icon fluid input">
                <i className="refresh link icon"></i>
                <input type="text" placeholder="Search for an item..." />
              </div>
            </div>
            <div className="inventory"></div>
            <div className="stats">
              <div className="ui three column grid">
                <div className="column">
                  <div className="ui statistic">
                    <div className="value item-count">
                      0
                    </div>
                    <div className="label">
                      Item(s) Selected
                    </div>
                  </div>
                </div>
                <div className="column">
                  <div className="ui statistic">
                    <div className="value items-value">
                      0
                    </div>
                    <div className="label">
                      Value (USD)
                    </div>
                  </div>
                </div>
                <div className="column">
                  <div className="ui statistic">
                    <div className="value items-value-hc">
                      0
                    </div>
                    <div className="label">
                      Value (<i className="hc"></i>)
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="ui buttons inventory-actions">
              <div className="ui fluid button">Withdraw</div>
              <div className="ui floating dropdown icon button">
                <i className="dropdown icon"></i>
                <div className="menu">
                  <div className="item"><i className="hc"></i> Convert to HyperCredits</div>
                  <div className="item">die</div>
                  <div className="item">more dying</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

}

export { Sidebar }
