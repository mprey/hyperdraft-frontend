import React, { Component } from 'react'
import { connect } from 'react-redux'

import gamesImage from '../static/img/menu/games.png'
import accountImage from '../static/img/menu/account.png'
import fundsImage from '../static/img/menu/funds.png'
import statsImage from '../static/img/menu/stats.png'
import shopImage from '../static/img/menu/shop.png'
import supportImage from '../static/img/menu/support.png'

class NavMenu extends Component {

  render() {
    const { onlineCount, setCurrentTab, toggleSidebarNavMenu, toggleSidebarNavChat } = this.props
    return (
      <div className="menu">
        <div className="header">menu <i className="material-icons menu-toggle open" onClick={toggleSidebarNavMenu}>keyboard_arrow_down</i></div>
        <div className="inner">
          <div className="menu-item games" /*onClick="route.change('games')"*/>
            <span>Games</span>
            <div className="icon">
              <img src={gamesImage} alt="games" />
            </div>
          </div>
          <div className="menu-item account" onClick={() => setCurrentTab('settings')} style={{display: 'none'}}>
            <span>Account</span>
            <div className="icon">
              <img src={accountImage} alt="account" />
            </div>
          </div>
          <div className="menu-item funds" onClick={() => setCurrentTab('deposit')} style={{display: 'none'}}>
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
            <i className="circle icon"></i> <span>{onlineCount}</span>
          </div>
          Chat
          <i className="material-icons chat-toggle open" onClick={toggleSidebarNavChat}>keyboard_arrow_down</i>
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

export default connect(
  mapStateToProps
)(NavMenu)
