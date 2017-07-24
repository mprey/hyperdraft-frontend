import {
  USER_LOAD_INVENTORY,
  USER_LOAD_INVENTORY_SUCCESS,
  USER_LOAD_INVENTORY_FAILURE
} from '../constants'

const initialState = {
  inventory: {
    loaded: false,
    loading: false,
    data: {}
  }
}

export default function reducer(state = initialState, {type, payload}) {
  switch(type) {

    /* Received when the user requests to load their Steam inventory from the back-end */
    case USER_LOAD_INVENTORY:
      return {
        ...state,
        inventory: {
          ...state.inventory,
          loading: true
        }
      }

    /* Received when a reply from the back-end containing the inventory object is received */
    case USER_LOAD_INVENTORY_SUCCESS:
      return {
        ...state,
        inventory: {
          loaded: true,
          loading: false,
          data: payload
        }
      }

    /* Received when the back-end returns an error on inventory request */
    case USER_LOAD_INVENTORY_FAILURE:
      return {
        ...state,
        inventory: {
          loaded: false,
          loading: false
        }
      }

    /* Return the state when the type does not match any user constants */
    default:
      return state
  }
}
