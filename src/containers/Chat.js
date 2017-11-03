import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import ReactDOM from 'react-dom'
import { state } from '../state'
import client from '../socket'

import {
  loadChat,
  updateChatMessages,
  removeChatMessage,
  sendChatMessage,
  alert
} from '../actions'

import {
  ChatMessage,
  ChatHelpModal
} from '../components'

class Chat extends Component {

  constructor(props) {
    super(props)

    this.state = {
      chatHelpModal: false
    }

    this.onKeyPress = this.onKeyPress.bind(this)
    this.scrollToBottom = this.scrollToBottom.bind(this)
  }

  componentDidMount() {
    if (!this.props.chat.loaded) {
      this.props.loadChat()
    }

    state.on('chats', (state, value, key) => {
      this.props.updateChatMessages(state.en.chat)
    })
  }

  componentWillUnmount() {
    state.removeAllListeners('chats')
  }

  scrollToBottom() {
    const node = ReactDOM.findDOMNode(this.refs.messagesEnd)
    if (node) {
      node.scrollIntoView({behavior: "smooth"})
    }
  }

  onKeyPress(event) {
    if (event.key === 'Enter') {
      this.sendChatMessage(this.refs.chatInput.value)
    }
  }

  sendChatMessage(message) {
    if (!message || message === '' || !message.replace(/\s/g, '').length) {
      return alert('error', 'Message cannot be empty', 'Chat')
    }

    if (message.indexOf('/') === 0) {
      return this.handleCommand(message)
    }

    this.props.sendChatMessage(message)
    this.refs.chatInput.value = ''
  }

  /* Pre-existing code */
  handleCommandMessage(message) {
    var command = message.split(' ')

    if (command.length !== 3) {
      alert('error', 'Invalid send attributes. Usage: /send steamid amount <br> Ex.: /send 76561198107884582 50', 'Send HyperCredits')
      return
    }

    if (!Number.isInteger(parseInt(command[2], 10))) {
      alert('error', 'Please enter a valid amount of HyperCredits.', 'Send HyperCredits')
      return
    }

    var info = {
      credit_transfer: {
        target: command[1],
        amount: parseInt(command[2], 10)
      }
    }

    //derp modal.open('credit-transfer', info)

    this.refs.chatInput.value = ''
  }

  renderMessages() {
    return this.props.chat.messages.slice().reverse().map((message, index) => (
      <ChatMessage key={index} message={message} user={this.props.user} />
    ))
  }

  renderChatMessages() {
    if (this.props.chat.loading) { // chat is loading from the back-end
      return (
        <div className="chat-messages">
          <div className="hover-bar">chat loading</div>
          <div className="messages"></div>
        </div>
      )
    } else if (!this.props.chat.loading && !this.props.chat.loaded) { // chat failed to load
      return (
        <div className="chat-messages">
          <div className="hover-bar">chat offline</div>
          <div className="messages"></div>
        </div>
      )
    } else if (this.props.chat.loaded) { // chat is loaded and functional
      return (
        <div className="chat-messages" onMouseLeave={this.scrollToBottom}>
          <div className="messages">
            { this.renderMessages() }
            <div style={{float:"left", clear: "both"}} ref="messagesEnd"></div>
          </div>
        </div>
      )
    }
  }

  render() {
    const isDisabled = this.props.isDisabled
    return (
      <div className="chat" ref="chatBox">
        <ChatHelpModal isOpen={this.state.chatHelpModal} onClose={() => this.setState({ chatHelpModal: false })} />
        <div className="ui mobile-alert chat-mobile-alert" style={{display: (isDisabled ? 'block' : 'none')}}>
          <p>{`Your browser's height is too small for chat.`}</p>
        </div>
        { !isDisabled && this.renderChatMessages() }
        { !isDisabled &&
          <div className="chat-input">
            <div className="ui icon fluid input">
              <i className="question link icon" onClick={() => this.setState({ chatHelpModal: true })}></i>
              <input ref="chatInput" type="text" maxLength="255" id="chatInput" placeholder="type your message here" onKeyPress={this.onKeyPress} />
            </div>
          </div>
        }
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    state: state.app.state,
    chat: state.chat,
    user: state.auth.user
  }
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({
    loadChat,
    updateChatMessages,
    removeChatMessage,
    sendChatMessage
  }, dispatch)
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Chat)
