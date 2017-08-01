import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import AnimateHeight from 'react-animate-height'
import classNames from 'classnames'
import client from '../socket'
import { Link } from 'react-router-dom'

import { updateOnlineCount } from '../actions'

import gamesImage from '../static/img/menu/games.png'
import accountImage from '../static/img/menu/account.png'
import fundsImage from '../static/img/menu/funds.png'
import statsImage from '../static/img/menu/stats.png'
import shopImage from '../static/img/menu/shop.png'
import supportImage from '../static/img/menu/support.png'

class NavMenu extends Component {

  componentWillMount() {
    /* Dispatch the online count to Redux to manage */
    client.on('onlineUpdate', this.props.updateOnlineCount)
  }

  componentWillUnmount() {
    client.off('onlineUpdate')
  }

  render() {
    const { onlineCount, setCurrentTab, toggleSidebarNavMenu, toggleSidebarNavChat } = this.props
    return (
      <div className="menu">
        <div className="header">
          Menu
          <i className={classNames({ 'material-icons': true, 'menu-toggle': true, 'open': this.props.open })} onClick={toggleSidebarNavMenu}>keyboard_arrow_down</i>
        </div>
        <AnimateHeight height={this.props.height} duration={500}>
          <div className="inner">
            <Link to="games">
              <div className="menu-item games">
                <span>Games</span>
                <div className="icon">
                  <img src={gamesImage} alt="games" />
                </div>
              </div>
            </Link>
            {this.props.user &&
              <div className="menu-item account" onClick={() => setCurrentTab('settings')}>
                <span>Account</span>
                <div className="icon">
                  <img src={accountImage} alt="account" />
                </div>
              </div>
            }
            {this.props.user &&
              <div className="menu-item funds" onClick={() => setCurrentTab('deposit')}>
                <span>Deposit</span>
                <div className="icon">
                  <img src={fundsImage} alt="funds" />
                </div>
              </div>
            }
            <Link to="stats">
              <div className="menu-item stats" /*onClick="route.change('stats')"*/>
                <span>Statistics</span>
                <div className="icon">
                  <img src={statsImage} alt="stats" />
                </div>
              </div>
            </Link>
            <Link to="shop">
              <div className="menu-item shop" /*onClick="route.change('shop')"*/>
                <span>Shop</span>
                <div className="icon">
                  <img src={shopImage} alt="shop" />
                </div>
              </div>
            </Link>
            <div className="menu-item support" /*onClick="modal.open('support')"*/>
              <span>Support</span>
              <div className="icon">
                <img src={supportImage} alt="support" />
              </div>
            </div>
          </div>
        </AnimateHeight>
        <div className="header header-chat">
          <div className="online-users-div">
            <i className="circle icon"></i> <span>{onlineCount}</span>
          </div>
          Chat
          <i className={classNames({ 'material-icons': true, 'chat-toggle': true, 'open': this.props.chatOpen })} onClick={toggleSidebarNavChat}>keyboard_arrow_down</i>
        </div>
      </div>
    )
  }

}

const mapStateToProps = (state) => {
  return {
    onlineCount: state.app.onlineCount
  }
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({
    updateOnlineCount
  }, dispatch)
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(NavMenu)
