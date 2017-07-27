import State from 'statesync'

import {
  UPDATE_ONLINE_COUNT,
  SERVER_UPDATE
} from '../constants'

const initialState = {
  onlineCount: 0,
  state: State()
}

export default function reducer(state = initialState, {type, payload}) {
  switch(type) {

    /* Received when a state change on the server occurs */
    case SERVER_UPDATE:
      state.state.patch(payload)
      return {
        ...state
      }

    /* Received when the server updates the current # of players online */
    case UPDATE_ONLINE_COUNT:
      return {
        ...state,
        onlineCount: payload
      }

    /* Return the state when the type does not match any auth constants */
    default:
      return state
  }
}
