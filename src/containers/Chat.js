import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import {
  loadChat
} from '../actions'

class Chat extends Component {

  constructor(props) {
    super(props)

    this.onKeyPress = this.onKeyPress.bind(this)
  }

  componentDidMount() {
    if (!this.props.chat.loaded) {
      this.props.loadChat()
    }
  }

  onKeyPress(event) {
    if (event.key === 'Enter') {
      this.sendChatMessage(this.refs.chatInput.value)
    }
  }

  sendChatMessage(message) {
    if (!message || message === '') {
      return alert('error', 'Message cannot be empty', 'Chat')
    }
  }

  renderMessages() {
    //TODO
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
        <div className="chat-messages">
          <div className="messages">

          </div>
        </div>
      )
    }
  }

  render() {
    console.log(this.props.chat)
    return (
      <div className="chat">
        <div className="ui mobile-alert chat-mobile-alert" style={{display: 'none'}}>
          <p>{`Your browser's height is too small for chat.`}</p>
        </div>
        { this.renderChatMessages() }
        <div className="chat-input">
          <div className="ui icon fluid input">
            <i className="question link icon"></i>
            <input ref="chatInput" type="text" maxLength="255" id="chatInput" placeholder="type your message here" onKeyPress={this.onKeyPress} />
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    state: state.app.state,
    chat: state.chat
  }
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({
    loadChat
  }, dispatch)
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Chat)
