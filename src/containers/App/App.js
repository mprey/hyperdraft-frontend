import React, { Component } from 'react'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'
import classNames from 'classnames'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import client from '../../socket'
import $ from 'jquery'

import {
  loadAuth,
  login,
  logout,
  updateOnlineCount
} from '../../actions'

import {
  NavbarProfile,
  NavbarProfileMobile
} from '../../components'

import loading from '../../static/img/loading.gif'
import bigLogo from '../../static/img/logo.png'
import smallLogo from '../../static/img/logo_small.png'
import gamesImage from '../../static/img/menu/games.png'
import accountImage from '../../static/img/menu/account.png'
import fundsImage from '../../static/img/menu/funds.png'
import statsImage from '../../static/img/menu/stats.png'
import shopImage from '../../static/img/menu/shop.png'
import supportImage from '../../static/img/menu/support.png'

import './App.css'

class App extends Component {

  constructor(props) {
    super(props)

    this.sidebarNavLock = false

    this.state = {
      sidebarNavOpen: false,
      sidebarNavMenuOpen: true
    }

    this.toggleSidebarNav = this.toggleSidebarNav.bind(this)
    this.updateLayout = this.updateLayout.bind(this)
    this.toggleSidebarNavMenu = this.toggleSidebarNavMenu.bind(this)
  }

  componentWillMount() {
    /* Hide the zenDesk support system on App mount */
    window.zE((zE) => {
      window.zE.hide()
    })

    /* Listen to screen resize to adjust sidebar layout */
    window.addEventListener('resize', this.updateLayout)

    /* Load auth data from back-end on initial load */
    if (!this.props.auth.loaded) {
      this.props.loadAuth()
    }

    /* Dispatch the online count to Redux to manage */
    //client.on('onlineUpdate', this.props.updateOnlineCount)
  }

  componentWillUnmount() {
    /* Unregister event listeners on unmount */
    window.removeEventListener('resize', this.updateLayout)

    /* Unregister socket listeners on unmount */
    client.off('onlineUpdate')
  }

  componentDidMount() {
    /* Initially update the layout to adjust to screen sizes */
    this.updateLayout()
  }

  /* Display the full sidebar or the minified version */
  toggleSidebarNav(ignoreLock) {
    this.sidebarNavLocked = (this.state.sidebarNavOpen && !ignoreLock) ? true : false
    this.setState({ sidebarNavOpen: !this.state.sidebarNavOpen })
  }

  /* Pre-existing code */
  toggleSidebarNavChat() {
    if ($('.sidebar-nav .chat-toggle').hasClass('open')) {
      $('.sidebar-nav .chat-toggle').removeClass('open')
      $('.sidebar-nav .chat').finish().slideUp()
    } else {
      $('.sidebar-nav .chat-toggle').addClass('open')
      $('.sidebar-nav .chat').finish().slideDown()
    }
  }

  /* Pre-existing code */
  toggleSidebarNavMenu() {
    if ($('.sidebar-nav .menu .menu-toggle').hasClass('open')) {
  		$('.sidebar-nav .menu .menu-toggle').removeClass('open')
  		$('.sidebar-nav .menu .inner').finish().slideUp(() => {
  			this.updateLayout()
  		})
  	} else {
  		$('.sidebar-nav .menu .menu-toggle').addClass('open')
  		$('.sidebar-nav .menu .inner').finish().slideDown(() => {
  			this.updateLayout()
  		})
  	}
  }

  /* Pre-existing code */
  updateLayout() {
    const winHeight = $(window).height()
  	const winWidth = $(window).width()
    const { sidebarNavOpen } = this.state

  	if (!this.sidebarNavLock && ((winWidth < 600 && sidebarNavOpen) || (winWidth > 600 && !sidebarNavOpen))) {
  		this.toggleSidebarNav(true)
  	}

  	// Sidebar
  	var sidebarHeightInner = 0
  	$('.sidebar-nav').children().not('.chat').each(function() {
  		sidebarHeightInner += $(this).height()
  	})
  	// improve
  	if ($('.sidebar-nav').height() < 580 && $('.sidebar-nav .menu-toggle').hasClass('open')) {
  		$('.sidebar-nav').css('overflow-y', 'scroll').perfectScrollbar()
  		$('.sidebar-nav .chat-messages, .sidebar-nav .chat-input').slideUp()
  		$('.sidebar-nav .chat-mobile-alert').slideDown()
  	} else if ($('.sidebar-nav').height() > 580) {
  		$('.sidebar-nav').css('overflow-y', 'hidden').perfectScrollbar('destroy')
  		$('.sidebar-nav .chat-messages, .sidebar-nav .chat-input').slideDown()
  		$('.sidebar-nav .chat-mobile-alert').slideUp()
  		$('.sidebar-nav .chat-messages .messages').css('height', ($('.sidebar-nav').height() - sidebarHeightInner) - 12)
  	}

  	if ($('body').children('.action-modal').length > 0) {
  		if (winHeight < $('.action-modal .modal').height()) {
  			$('.action-modal').css('display', 'block')
  		} else {
  			$('.action-modal').css('display', 'flex')
  		}
  	}
  }

  renderUserProfile() {
    const { user } = this.props.auth
    if (user) {
      setTimeout(() => {
        $('.sidebar-nav .login').slideUp()
        $('.sidebar-nav .menu-item.account').slideDown()
        $('.sidebar-nav .menu-item.funds').slideDown()
        $('.sidebar-nav .profile-info').slideDown(() => {
          this.updateLayout()
        })
      }, 1500)
      return (
        <div className="profile-info">
          <NavbarProfile user={user} logout={this.props.logout} />
        </div>
      )
    } else {
      return (
        <div className="login">
          <a onClick={this.props.login}>
            <div className="button">
              <i className="steam icon"></i> <span>Login via Steam</span>
            </div>
          </a>
        </div>
      )
    }
  }

  render() {
    const { sidebarNavOpen } = this.state
    return (
      <div className="App">
        <ReactCSSTransitionGroup
          transitionName="fade-gif"
          transitionEnterTimeout={0}
          transitionLeaveTimeout={1000}>
            {this.props.auth.loading &&
              <div className="preloader">
                <img src={loading} alt="loading" />
              </div>
            }
        </ReactCSSTransitionGroup>
        {!this.props.auth.loading &&
          <div>
            <div className="user-profile-modal" id="userProfileModal"></div>
            <ul className="chat-contextmenu" id="chatContextMenu">
              <li className="info"><img src="" alt="empty" /></li>
              <li data-action="pm"><i className="mail icon"></i> Private Message</li>
              <li data-action="transfer"><i className="gift icon"></i> Gift HyperCredits</li>
              <li data-action="mention"><i className="at icon"></i> Mention</li>
            </ul>
            <div className={classNames({ 'sidebar-nav': true, 'collapsed': !sidebarNavOpen })}>
              <div className={classNames({ 'toggle': true, 'toggled': !sidebarNavOpen })} onClick={this.toggleSidebarNav}>
                <i className="material-icons">chevron_left</i>
              </div>
              <div className={classNames({ 'branding': true, 'closed': !sidebarNavOpen })} /*onClick="route.change('games')"*/>
                <img src={bigLogo} className="big-logo" alt="bigLogo" />
                <img src={smallLogo} className="small-logo" alt="smallLogo" />
              </div>
              <div className="ui mobile only mobile-alert">
                <p>You are browsing HyperDraft on a mobile device. Some features have been restricted.</p>
              </div>
              { this.renderUserProfile() }
              <div className="menu">
              {/*<div className="header header-status status-bad">
                  <div className="title"><i className="warning sign icon"></i> GLOBAL ALERT</div>
                    Trades are currently delayed.
                  </div>*/}
                <div className="header">menu <i className="material-icons menu-toggle open" onClick={this.toggleSidebarNavMenu}>keyboard_arrow_down</i></div>
                <div className="inner">
                  <div className="menu-item games" /*onClick="route.change('games')"*/>
                    <span>Games</span>
                    <div className="icon">
                      <img src={gamesImage} alt="games" />
                    </div>
                  </div>
                  <div className="menu-item account" /*onClick="sidebar.toggle('settings')"*/ style={{display: 'none'}}>
                    <span>Account</span>
                    <div className="icon">
                      <img src={accountImage} alt="account" />
                    </div>
                  </div>
                  <div className="menu-item funds" /*onClick="sidebar.toggle('deposit')"*/ style={{display: 'none'}}>
                    <span>Deposit</span>
                    <div className="icon">
                      <img src={fundsImage} alt="funds" />
                    </div>
                  </div>
                  <div className="menu-item stats" /*onClick="route.change('stats')"*/>
                    <span>Statistics</span>
                    <div className="icon">
                      <img src={statsImage} alt="stats" />
                    </div>
                  </div>
                  <div className="menu-item shop" /*onClick="route.change('shop')"*/>
                    <span>Shop</span>
                    <div className="icon">
                      <img src={shopImage} alt="shop" />
                    </div>
                  </div>
                  <div className="menu-item support" /*onClick="modal.open('support')"*/>
                    <span>Support</span>
                    <div className="icon">
                      <img src={supportImage} alt="support" />
                    </div>
                  </div>
                </div>
                <div className="header header-chat">
                  <div className="online-users-div">
                    <i className="circle icon"></i> <span>0</span>
                  </div>
                  Chat
                  <i className="alarm outline icon chat-pm-toggle" title="PM & Mentions only"></i>
                  <i className="material-icons chat-toggle open" onClick={this.toggleSidebarNavChat}>keyboard_arrow_down</i>
                </div>
              </div>
              <div className="chat">
                <div className="ui mobile-alert chat-mobile-alert" style={{display: 'none'}}>
                  <p>{`Your browser's height is too small for chat.`}</p>
                </div>
                <div className="chat-messages">
                  <div className="announcement-bar"></div>
                  <div className="hover-bar">chat paused</div>
                  <div className="faded-bar"></div>
                  <div className="messages"></div>
                </div>
                <div className="chat-input">
                  <div className="ui icon fluid input">
                    <i className="question link icon"></i>
                    <input type="text" maxLength="255" id="chatInput" placeholder="type your message here" />
                  </div>
                </div>
              </div>
              <div className="footer">
                <div className="data">
                  <div className="social">
                    <a href="https://twitter.com/HyperDraft" target="_blank" rel="noopener noreferrer"><i className="twitter icon"></i></a>
                    <a href="https://facebook.com/HyperDraft" target="_blank" rel="noopener noreferrer"><i className="facebook icon"></i></a>
                    <a href="https://www.reddit.com/r/hyperdraft" target="_blank" rel="noopener noreferrer"><i className="reddit alien icon"></i></a>
                    <a href="http://steamcommunity.com/groups/hyperdraft" target="_blank" rel="noopener noreferrer"><i className="steam icon"></i></a>
                    <a href="https://vk.com/hyperdraft" target="_blank" rel="noopener noreferrer"><i className="vk icon"></i></a>
                  </div>
                  <div className="copyright">&copy; HyperDraft 2016</div>
                  <div className="legal">
                    <a href="pages/terms.html" target="_blank" rel="noopener noreferrer">Terms</a>
                    <a href="pages/privacy.html" target="_blank" rel="noopener noreferrer">Privacy</a>
                    <a href="http://www.responsiblegambling.org/" target="_blank" rel="noopener noreferrer">Responsible Gaming</a>
                  </div>
                </div>
              </div>
            </div>
            <div className="sidebar-action">
              <div className="close" /*onClick="sidebar.toggle()"*/>
                <i className="material-icons">close</i>
              </div>
              <div className="ui top attached tabular menu">
                {/*<a className="item" data-tab="sidebar-inventory-soon" data-position="bottom center" data-tooltip="Coming Soon"><i className="material-icons">archive</i></a>*/}
                <a className="item active" data-tab="sidebar-deposit" data-position="bottom center" data-tooltip="Steam Inventory"><i className="material-icons">add_circle</i></a>
                <a className="item" data-tab="sidebar-settings" data-position="bottom center" data-tooltip="Settings"><i className="material-icons">settings</i></a>
                <a className="item" data-tab="sidebar-affiliates" data-position="bottom center" data-tooltip="Affiliates"><i className="material-icons">supervisor_account</i></a>
              </div>

              <div className="ui inner segment tab inventory" data-tab="sidebar-inventory">
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
              <div className="ui inner segment tab deposit active" data-tab="sidebar-deposit">
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

                <div className="daily-reward">
                  <h1 className="ui header">OR</h1>
                  <button className="ui button" id="dailyReward_btn" /*onClick="claimDailyReward()"*/><i className="gift icon"></i> Claim your daily HyperCredits</button>
                </div>
              </div>
              <div className="ui inner segment tab settings" data-tab="sidebar-settings">
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
              <div className="ui inner segment tab affiliates" data-tab="sidebar-affiliates">
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
            <div className="mobile-menu">
              <div className="close-btn">
                <i className="remove icon"></i>
              </div>
              <div className="inner">
                <div className="branding" /*onClick="route.change('games')"*/>
                  <img src={bigLogo} className="logo" alt="logo" />
                </div>
                <div className="profile-info"></div>
                <div className="menu">
                  <a onClick={this.props.login}>
                    <div className="menu-item login">
                      Login / Sign Up
                    </div>
                  </a>
                  <div className="menu-item account" /*onClick="route.change('account')"*/ style={{display: 'none'}}>
                    My Account
                  </div>
                  <div className="menu-item funds" /*onClick="sidebar.toggle()"*/ style={{display: 'none'}}>
                    Wallet
                  </div>
                  <div className="menu-item" /*onClick="route.change('games')"*/>
                    Games
                  </div>
                  <div className="menu-item" /*onClick="route.change('stats')"*/>
                    Statistics
                  </div>
                  <div className="menu-item" /*onClick="route.change('shop')"*/>
                    Shop
                  </div>

                  <div className="menu-item" onClick={null/*window.zE.activate({hideOnClose: true})*/}>
                    Support
                  </div>
                </div>
              </div>
            </div>
            <div className="mobile-menu-btn">
              <i className="bars icon"></i>
            </div>
            <div className={classNames({ 'page-content': true, 'nav-collapsed': !sidebarNavOpen })}></div>
          </div>
        }
      </div>
    )
  }
}

require('perfect-scrollbar/jquery')($)

const mapStateToProps = (state) => {
  return {
    auth: state.auth
  }
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({
    loadAuth,
    login,
    logout,
    updateOnlineCount
  }, dispatch)
}

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(App))
