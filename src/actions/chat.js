import { alert } from './alert'

import {
  CHAT_LOAD,
  CHAT_LOAD_SUCCESS,
  CHAT_LOAD_FAILURE,
  CHAT_SEND_MESSAGE,
  CHAT_SEND_MESSAGE_SUCCESS,
  CHAT_SEND_MESSAGE_FAILURE,
  CHAT_RECEIVE_MESSAGE,
  CHAT_REMOVE_MESSAGE,
  CHAT_REMOVE_MESSAGE_SUCCESS,
  CHAT_REMOVE_MESSAGE_FAILURE
} from '../constants'

const ROOM_ID = 'en'

export function loadChat() {
  return {
    type: 'socket',
    types: [CHAT_LOAD, CHAT_LOAD_SUCCESS, CHAT_LOAD_FAILURE],
    promise: (socket) => socket.emitAction('getChatRoom', { roomid: ROOM_ID }).catch(error => {
      alert('error', `Error while loading chat: ${error}`, 'Chat')
      throw error
    })
  }
}

export function receiveChatMessage(message) {
  return {
    type: CHAT_RECEIVE_MESSAGE,
    payload: message
  }
}

export function removeChatMessage(messageid) {
  return {
    type: 'socket',
    types: [CHAT_REMOVE_MESSAGE, CHAT_REMOVE_MESSAGE_SUCCESS, CHAT_REMOVE_MESSAGE_FAILURE],
    promise: (socket) => socket.emitAction('removeChatMessage', { messageid, roomid: ROOM_ID }).catch(error => {
      alert('error', error, 'Chat')
      throw error
    })
  }
}

export function sendChatMessage(message) {
  return {
    type: 'socket',
    types: [CHAT_SEND_MESSAGE, CHAT_SEND_MESSAGE_SUCCESS, CHAT_SEND_MESSAGE_FAILURE],
    promise: (socket) => socket.emitAction('speak', { message, roomid: ROOM_ID }).catch(error => {
      alert('error', error, 'Chat')
      throw error
    })
  }
}
