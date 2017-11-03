import React, { Component } from 'react'

class NavbarProfileMobile extends Component {
  render() {
    return (
      <div className="ui two column grid">
        <div className="column">
          <img src={this.props.user.steam.avatar.medium} alt="user" />
        </div>
        <div className="column">
          <div className="data">
            <div className="name">{this.props.user.username}</div>
            <div className="balance"><span className="acc-balance">0</span> <i className="hc"></i></div>
            <div className="logout" onClick={this.props.logout}>logout</div>
          </div>
        </div>
      </div>
    )
  }
}

export { NavbarProfileMobile }
