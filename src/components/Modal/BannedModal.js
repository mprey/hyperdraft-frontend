import React, { Component } from 'react'
import Modal from './Modal'

class BannedModal extends Component {

  isBanned() {
    return this.props.user && this.props.user.banned
  }

  render() {
    const isBanned = this.isBanned()
    return (
      <Modal
        isOpen={isBanned}
        loading={this.props.loading}
      >
        {isBanned &&
          <div>
          <div className="title">Banned!</div>
          <div className="content">
            <p>This account has been banned for: {this.props.user.banReason}</p>
            <p>Ban expiration: {this.props.user.timeBanned}</p>
          </div>
          <div className="footer">
            <div className="actions">
              <button className="ui button action cancel" onClick={this.props.logout}>:(</button>
            </div>
          </div>
          </div>
        }
      </Modal>
    )
  }
}

export { BannedModal }
