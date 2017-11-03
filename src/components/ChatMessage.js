import React, { Component } from 'react'
import moment from 'moment'
import classNames from 'classnames'

class ChatMessage extends Component { //props: message, user

  isMessagePersonal() {
    if (this.props.user && this.props.message) {
      const { message } = this.props.message
      return ~message.indexOf(`@${this.props.user.name}`)
    }
    return false
  }

  render() {
    const { message } = this.props
    return (
      <div className={classNames({ 'chat-message': true, 'personal': this.isMessagePersonal() })} data-id={message.id}>
        <img src={message.user.avatar} className="pp" alt="user" />
        <div className="data">
          <span className={`name rank-${message.user.rank}`} data-id={message.user.id} data-steamid={message.user.steamid}>{message.user.steamname}</span>
          <p className="message">{message.message}</p>
        </div>
        <span className="timestamp">{moment(message.time).format('HH:mm')}</span>
	    </div>
    )
  }

}

export { ChatMessage }
