import React, { Component } from 'react'

class NavbarProfile extends Component {
  render() {
    return (
      <div>
        <img src={this.props.user.steam.avatar.large} alt="user" />
        <div className="data">
          <div className="name">{this.props.user.usernme}</div>
          <div className="balance"><span className="acc-balance">0</span> <i className="hc"></i></div>
          <div className="logout" onClick={this.props.logout}>logout</div>
        </div>
      </div>
    )
  }
}

export { NavbarProfile }
