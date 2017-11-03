import React, { Component } from 'react'
import Modal from './Modal'

class ChatHelpModal extends Component {

  render() {
    return (
      <Modal isOpen={this.props.isOpen}>
        <div className="title">Chat Rules & Help</div>
        <div className="content">
          <p>
            <h3 className="ui header">Chat Rules:</h3>
            <ul>
              <li>Absolutely no begging/asking/trading in chat.</li>
              <li>Play our games at your own risk, we are not liable for any losses you may incur.</li>
              <li>No trading. If caught item trading without playing games, your account will be banned and credits will be lost.</li>
              <li>Do not ask about support tickets in chat. You can expect a response within 72 hours of sending your ticket.</li>
              <li>Do not attempt to exploit our system. You will be banned and all of your Hyper Credits will be revoked.</li>
              <li>Do not curse, complain, or spam ref codes in chat. This will result in a mute and an eventual ban.</li>
              <li>Do not lie about transactions on support tickets, as this can result in a ban.</li>
              <li>Respect our staff. Any rude remarks or attempts to belittle them will result in a mute.</li>
              <li>Do not post your ref link/codes in the chat, bio, or in your name.</li>
            </ul>

            <h3 className="ui header">Commands:</h3>
            <ul>
              <li>/send name amount - send credits</li>
            </ul>
            You can also right click a message for a quicker shortcut to commands.
          </p>
        </div>
        <div className="footer">
          <div className="actions">
            <button className="ui button action cancel" onClick={this.props.onClose}>Close</button>
          </div>
        </div>
      </Modal>
    )
  }

}

export { ChatHelpModal }
