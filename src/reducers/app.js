import {
  UPDATE_ONLINE_COUNT
} from '../constants'

const initialState = {
  onlineCount: 0
}

export default function reducer(state = initialState, {type, payload}) {
  switch(type) {

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
