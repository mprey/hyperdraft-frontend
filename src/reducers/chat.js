import {
  CHAT_LOAD,
  CHAT_LOAD_SUCCESS,
  CHAT_LOAD_FAILURE,
  CHAT_SEND_MESSAGE,
  CHAT_SEND_MESSAGE_SUCCESS,
  CHAT_SEND_MESSAGE_FAILURE,
  CHAT_UPDATE_MESSAGES
} from '../constants'

const initialState = {
  loaded: false,
  loading: false,
  sending: false,
  messages: []
}

export default function reducer(state = initialState, {type, payload}) {
  switch(type) {

    case CHAT_SEND_MESSAGE:
      return {
        ...state,
        sending: true
      }
    case CHAT_SEND_MESSAGE_SUCCESS:
      return {
        ...state,
        sending: false
      }
    case CHAT_SEND_MESSAGE_FAILURE:
      return {
        ...state,
        sending: false
      }

    case CHAT_UPDATE_MESSAGES:
      return {
        ...state,
        messages: payload
      }

    case CHAT_LOAD:
      return {
        ...state,
        loading: true,
        loaded: false
      }
    case CHAT_LOAD_SUCCESS:
      return {
        ...state,
        loaded: true,
        loading: false,
        messages: payload.chat
      }
    case CHAT_LOAD_FAILURE:
      return {
        ...state,
        loading: false,
        loaded: false
      }

    /* Return the state when the type does not match any auth constants */
    default:
      return state
  }
}
