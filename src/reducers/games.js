import {
  COINFLIP_LOAD_HISTORY,
  COINFLIP_LOAD_HISTORY_SUCCESS,
  COINFLIP_LOAD_HISTORY_FAILURE
} from '../constants'

const initialState = {
  coinflip: {
    history: [],
    loaded: false,
    loading: false
  }
}

export default function reducer(state = initialState, {type, payload}) {
  switch(type) {

    case COINFLIP_LOAD_HISTORY:
      return {
        ...state,
        coinflip: {
          ...state.coinflip,
          loading: true
        }
      }
    case COINFLIP_LOAD_HISTORY_SUCCESS:
      return {
        ...state,
        coinflip: {
          history: payload,
          loaded: true,
          loading: false
        }
      }
    case COINFLIP_LOAD_HISTORY_FAILURE:
      return {
        ...state,
        coinflip: {
          ...state.coinflip,
          loaded: false,
          loading: false
        }
      }

    /* Return the state when the type does not match any auth constants */
    default:
      return state
  }
}
