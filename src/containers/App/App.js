import React, { Component } from 'react'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'
import classNames from 'classnames'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import client from '../../socket'
import Routes from '../../routes'
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

import {
  Sidebar
} from '../'

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
      sidebarNavMenuOpen: true,
      sidebarOpen: false,
      currentTab: null
    }

    this.toggleSidebarNav = this.toggleSidebarNav.bind(this)
    this.updateLayout = this.updateLayout.bind(this)
    this.toggleSidebarNavMenu = this.toggleSidebarNavMenu.bind(this)
    this.setCurrentTab = this.setCurrentTab.bind(this)
  }

  componentWillMount() {
    /* Listen to screen resize to adjust sidebar layout */
    window.addEventListener('resize', this.updateLayout)

    /* Load auth data from back-end on initial load */
    if (!this.props.auth.loaded) {
      this.props.loadAuth()
    }

    /* Dispatch the online count to Redux to manage */
    client.on('onlineUpdate', this.props.updateOnlineCount)
  }

  componentWillUnmount() {
    /* Unregister event listeners on unmount */
    window.removeEventListener('resize', this.updateLayout)

    /* Unregister socket listeners on unmount */
    client.off('onlineUpdate')
  }

  componentDidMount() {
    /* Update the main layout when the component is mounted */
    this.updateLayout()
  }

  /* Display the full sidebar or the minified version */
  toggleSidebarNav(ignoreLock) {
    this.sidebarNavLock = ignoreLock === false ? false : true
    this.setState({ sidebarNavOpen: !this.state.sidebarNavOpen })
    this.updateLayout()
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

  	if (!this.sidebarNavLock) {
  		if (winWidth < 600 && sidebarNavOpen) {
  			this.toggleSidebarNav(true)
  		} else if (winWidth > 600 && !sidebarNavOpen) {
  			this.toggleSidebarNav(true)
  		}
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
  		$('.sidebar-nav .chat-messages .messages').css('height', ($('.sidebar-nav').height() - sidebarHeightInner) - 62)
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
      }, 1000)
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

  setCurrentTab(tab) {
    if (!tab) {
      return this.setState({ sidebarOpen: false, currentTab: null })
    }
    this.setState({ currentTab: tab, sidebarOpen: true })
  }

  render() {
    const { sidebarNavOpen, currentTab, sidebarOpen } = this.state
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
            <Routes />
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
                <div className="header">menu <i className="material-icons menu-toggle open" onClick={this.toggleSidebarNavMenu}>keyboard_arrow_down</i></div>
                <div className="inner">
                  <div className="menu-item games" /*onClick="route.change('games')"*/>
                    <span>Games</span>
                    <div className="icon">
                      <img src={gamesImage} alt="games" />
                    </div>
                  </div>
                  <div className="menu-item account" onClick={() => this.setCurrentTab('settings')} style={{display: 'none'}}>
                    <span>Account</span>
                    <div className="icon">
                      <img src={accountImage} alt="account" />
                    </div>
                  </div>
                  <div className="menu-item funds" onClick={() => this.setCurrentTab('deposit')} style={{display: 'none'}}>
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
            <Sidebar isOpen={sidebarOpen} currentTab={currentTab} setCurrentTab={this.setCurrentTab} />
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

                  <div className="menu-item" onClick={window.showZE}>
                    Support
                  </div>
                </div>
              </div>
            </div>
            <div className="mobile-menu-btn">
              <i className="bars icon"></i>
            </div>
            <div className={classNames({ 'page-content': true, 'nav-collapsed': !sidebarNavOpen })}>
              <Routes />
            </div>
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
