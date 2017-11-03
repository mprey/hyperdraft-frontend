import {
  AUTH_LOAD_REQUEST,
  AUTH_LOAD_SUCCESS,
  AUTH_LOAD_FAILURE
} from '../constants'

const initialState = {
  loaded: false,
  loading: false,
  user: null
}

export default function reducer(state = initialState, {type, payload}) {
  switch(type) {

    /* Received when the user fails to load auth (usually caused by not being logged in) */
    case AUTH_LOAD_FAILURE:
      /* Return loaded set to false and loading also set to false */
      return {
        ...state,
        loaded: false,
        loading: false
      }

    /* Received when the user successfully loads their profile from the back-end */
    case AUTH_LOAD_SUCCESS:
      /* Set the current user equal to the payload from the back-end, and set loading to false and loaded to true */
      return {
        ...state,
        loading: false,
        loaded: true,
        user: payload
      }

    /* Received when the user attempts to load authentication from the back-end */
    case AUTH_LOAD_REQUEST:
      /* Return a new state with loading auth set to true (used for the loading gif on the home screen) */
      return {
        ...state,
        loading: true
      }

    /* Return the state when the type does not match any auth constants */
    default:
      return state
  }
}
