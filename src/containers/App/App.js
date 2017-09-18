import React, { Component } from 'react'
import classNames from 'classnames'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import AnimateHeight from 'react-animate-height'
import client from '../../socket'
import Routes from '../../routes'
import ReactDOM from 'react-dom'
import { state } from '../../state'

import {
  loadAuth,
  login,
  logout,
  updateClient,
  loadUserWallets
} from '../../actions'

import {
  NavbarProfile,
  NavbarProfileMobile,
  BannedModal,
  Footer,
  LoadingGif
} from '../../components'

import {
  Sidebar,
  Chat,
  NavMenu
} from '../'

import bigLogo from '../../static/img/logo.png'
import smallLogo from '../../static/img/logo_small.png'

import './App.css'

class App extends Component {

  constructor(props) {
    super(props)

    this.sidebarNavLock = false

    this.state = {
      /* view controllers */
      sidebarNavOpen: false,
      sidebarNavMenuOpen: true,
      sidebarChatOpen: true,
      sidebarOpen: false,

      /* tab for the sidebar */
      currentTab: null,

      /* for sliding up/down */
      sidebarChatHeight: 'auto',
      sidebarNavMenuHeight: 'auto',

      /* Disabled if the screen height is too small */
      sidebarChatDisabled: false,

      /* width and height to update layout */
      width: 0,
      height: 0
    }

    this.toggleSidebarNav = this.toggleSidebarNav.bind(this)
    this.updateLayout = this.updateLayout.bind(this)
    this.toggleSidebarNavMenu = this.toggleSidebarNavMenu.bind(this)
    this.toggleSidebarNavChat = this.toggleSidebarNavChat.bind(this)
    this.setCurrentTab = this.setCurrentTab.bind(this)
    this.updateWindowDimensions = this.updateWindowDimensions.bind(this)
  }

  updateWindowDimensions() {
    this.setState({ width: window.innerWidth, height: window.innerHeight })
    this.updateLayout()
  }

  componentWillReceiveProps(nextProps) {
    if (!nextProps.auth.loading && this.props.auth.loading) {
      /* Bug fix to reorganize the side menu when the loading gif disappears */
      setTimeout(() => this.updateLayout(), 500)

      /* Load the users wallets after auth has finished */
      this.props.loadUserWallets()
    }
  }

  componentWillMount() {
    /* Listen to screen resize to adjust sidebar layout */
    window.addEventListener('resize', this.updateWindowDimensions)

    /* Load auth data from back-end on initial load */
    if (!this.props.auth.loaded) {
      this.props.loadAuth()
    }

    /* Received on a server-side update of the state */
    client.on('diff', state.patch)
  }

  componentWillUnmount() {
    /* Unregister event listeners on unmount */
    window.removeEventListener('resize', this.updateWindowDimensions)

    /* Unregister socket listeners on unmount */
    client.off('diff')
  }

  componentDidMount() {
    /* Update the window dimensions when the component is mounted */
    this.updateWindowDimensions()

    /* Update the main layout when the component is mounted */
    setTimeout(this.updateLayout, 300)
  }

  renderUserProfile() {
    const { user } = this.props.auth
    if (user) {
      return (
        <div className="profile-info">
          <NavbarProfile user={user} userWallet={this.props.userWallet} logout={this.props.logout} />
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
        <LoadingGif isLoading={this.props.auth.loading} />
        {!this.props.auth.loading &&
          <div>
            <BannedModal user={this.props.auth.user} logout={this.props.logout} />

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

              <NavMenu height={this.state.sidebarNavMenuHeight} open={this.state.sidebarNavMenuOpen} chatOpen={this.state.sidebarChatOpen} user={this.props.auth.user} setCurrentTab={this.setCurrentTab} toggleSidebarNavMenu={this.toggleSidebarNavMenu} toggleSidebarNavChat={this.toggleSidebarNavChat} />

              <AnimateHeight height={this.state.sidebarChatHeight} duration={500} contentClassName="force">
                <Chat ref="chat" isDisabled={this.state.sidebarChatDisabled} open={this.state.sidebarChatOpen} height={this.state.sidebarChatHeight} openHelpModal={() => this.setState({ chatHelpModal: true })} user={this.props.auth.user} />
              </AnimateHeight>

              <Footer />
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
                {this.props.user &&
                  <div className="profile-info">
                    <NavbarProfileMobile user={this.props.user} logout={this.props.logout} />
                  </div>
                }
                <div className="menu">
                  {!this.props.user &&
                    <a onClick={this.props.login}>
                      <div className="menu-item login">
                        Login / Sign Up
                      </div>
                    </a>
                  }
                  {this.props.user &&
                    <div className="menu-item account" /*onClick="route.change('account')"*/>
                      My Account
                    </div>
                  }
                  {this.props.user &&
                    <div className="menu-item funds" /*onClick="sidebar.toggle()"*/>
                      Wallet
                    </div>
                  }
                  <div className="menu-item" /*onClick="route.change('games')"*/>
                    Games
                  </div>
                  <div className="menu-item" /*onClick="route.change('stats')"*/>
                    Statistics
                  </div>
                  <div className="menu-item" /*onClick="route.change('shop')"*/>
                    Shop
                  </div>

                  <div className="menu-item" onClick={() => window.zE.activate({ hideOnClose: true })}>
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

  /* Display the full sidebar or the minified version */
  toggleSidebarNav(ignoreLock) {
    this.sidebarNavLock = ignoreLock === false ? false : true
    this.setState({ sidebarNavOpen: !this.state.sidebarNavOpen })
    setTimeout(this.updateLayout, 300)
  }

  /* Toggle the sidebar chat menu */
  toggleSidebarNavChat() {
    if (this.state.sidebarChatOpen) {
      return this.setState({ sidebarChatOpen: false, sidebarChatHeight: 0 })
    }
    this.setState({ sidebarChatOpen: true })
    setTimeout(this.updateLayout, 100)
  }

  /* Toggle the sidebar nav menu */
  toggleSidebarNavMenu() {
    this.setState({ sidebarNavMenuOpen: !this.state.sidebarNavMenuOpen, sidebarNavMenuHeight: (this.state.sidebarNavMenuOpen ? 0 : 'auto') })
    setTimeout(this.updateLayout, 500)
  }

  /* Automatically update the window to format the viewport */
  updateLayout() {
    const { width, height, sidebarNavOpen } = this.state

    const chat = ReactDOM.findDOMNode(this.refs.chat)

    const WIDTH_MIN = 600
    const HEIGHT_MIN_FOR_CHAT = 100
    const FOOTER_LENGTH = 65

    /* Toggle the sidebar navigation if the window width is smaller than 600 pixels */
  	if (!this.sidebarNavLock) {
  		if (width < WIDTH_MIN && sidebarNavOpen) {
  			this.toggleSidebarNav(true)
  		} else if (width > WIDTH_MIN && !sidebarNavOpen) {
  			this.toggleSidebarNav(true)
  		}
  	}

    /* Disable the chat if the window height is smaller than HEIGHT_MIN_FOR_CHAT */
    if (chat && this.state.sidebarChatOpen) {
      const chatHeight = height - FOOTER_LENGTH - chat.offsetTop
      if (chatHeight < HEIGHT_MIN_FOR_CHAT) {
        return this.setState({ sidebarChatHeight: 50, sidebarChatDisabled: true })
      }
      this.setState({ sidebarChatHeight: chatHeight, sidebarChatDisabled: false})
    }
  }

}

const mapStateToProps = (state) => {
  return {
    auth: state.auth,
    userWallet: state.user.wallet
  }
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({
    loadAuth,
    login,
    logout,
    updateClient,
    loadUserWallets
  }, dispatch)
}

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(App))
