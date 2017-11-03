import {
  COINFLIP_LOAD_HISTORY,
  COINFLIP_LOAD_HISTORY_SUCCESS,
  COINFLIP_LOAD_HISTORY_FAILURE,
  ROULETTE_LOAD_HISTORY,
  ROULETTE_LOAD_HISTORY_SUCCESS,
  ROULETTE_LOAD_HISTORY_FAILURE,
  ROULETTE_ADD_HISTORY_GAME,
  ROULETTE_JOIN_GAME,
  ROULETTE_JOIN_GAME_SUCCESS,
  ROULETTE_JOIN_GAME_FAILURE
} from '../constants'

const initialState = {
  coinflip: {
    history: [],
    loaded: false,
    loading: false
  },
  roulette: {
    history: [],
    loaded: false,
    loading: false,
    joining: false
  }
}

export default function reducer(state = initialState, {type, payload}) {
  switch(type) {

    case ROULETTE_JOIN_GAME:
      return {
        ...state,
        roulette: {
          ...state.roulette,
          joining: true
        }
      }
    case ROULETTE_JOIN_GAME_SUCCESS:
      return {
        ...state,
        roulette: {
          ...state.roulette,
          joining: false
        }
      }
    case ROULETTE_JOIN_GAME_FAILURE:
      return {
        ...state,
        roulette: {
          ...state.roulette,
          joining: false
        }
      }

    case ROULETTE_ADD_HISTORY_GAME:
      return {
        ...state,
        roulette: {
          ...state.roulette,
          history: [payload, ...state.roulette.history.slice(0, 9)]
        }
      }

    case ROULETTE_LOAD_HISTORY:
      return {
        ...state,
        roulette: {
          ...state.roulette,
          loading: true
        }
      }
    case ROULETTE_LOAD_HISTORY_SUCCESS:
      return {
        ...state,
        roulette: {
          ...state.roulette,
          history: payload,
          loaded: true,
          loading: false
        }
      }
    case ROULETTE_LOAD_HISTORY_FAILURE:
      return {
        ...state,
        roulette: {
          ...state.roulette,
          loaded: false,
          loading: false
        }
      }

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
          ...state.coinflip,
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
