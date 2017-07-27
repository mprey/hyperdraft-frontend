import {
  USER_LOAD_INVENTORY,
  USER_LOAD_INVENTORY_SUCCESS,
  USER_LOAD_INVENTORY_FAILURE,
  USER_CREATE_AFFILIATE_CODE,
  USER_CREATE_AFFILIATE_CODE_SUCCESS,
  USER_CREATE_AFFILIATE_CODE_FAILURE,
  USER_REDEEM_AFFILIATE_CODE,
  USER_REDEEM_AFFILIATE_CODE_SUCCESS,
  USER_REDEEM_AFFILIATE_CODE_FAILURE,
  USER_LOAD_AFFILIATE_STATS,
  USER_LOAD_AFFILIATE_STATS_SUCCESS,
  USER_LOAD_AFFILIATE_STATS_FAILURE,
  USER_CLAIM_AFFILIATE_BALANCE,
  USER_CLAIM_AFFILIATE_BALANCE_SUCCESS,
  USER_CLAIM_AFFILIATE_BALANCE_FAILURE
} from '../constants'

const initialState = {
  inventory: {
    loaded: false,
    loading: false,
    data: {}
  },
  affiliate: {
    creating: false,
    redeeming: false,
    claiming: false,
    loaded: false,
    loading: false,
    codeDetails: [],
    levelDetails: {}
  }
}

export default function reducer(state = initialState, {type, payload}) {
  switch(type) {

    /* Received when the user attempts to claim their balance */
    case USER_CLAIM_AFFILIATE_BALANCE:
      return {
        ...state,
        affiliate: {
          ...state.affiliate,
          claiming: true
        }
      }
    case USER_CLAIM_AFFILIATE_BALANCE_SUCCESS:
      return {
        ...state,
        affiliate: {
          ...state.affiliate,
          claiming: false
        }
      }
    case USER_CLAIM_AFFILIATE_BALANCE_FAILURE:
      return {
        ...state,
        affiliate: {
          ...state.affiliate,
          claiming: false
        }
      }

    /* Received when the user is initially loading their affiliate stats from the back-end */
    case USER_LOAD_AFFILIATE_STATS:
      return {
        ...state,
        affiliate: {
          ...state.affiliate,
          loading: true
        }
      }
    case USER_LOAD_AFFILIATE_STATS_SUCCESS:
      const { codeDetails, levelDetails } = payload
      return {
        ...state,
        affiliate: {
          ...state.affiliate,
          loaded: true,
          loading: false,
          codeDetails,
          levelDetails
        }
      }
    case USER_LOAD_AFFILIATE_STATS_FAILURE:
      return {
        ...state,
        affiliate: {
          ...state.affiliate,
          loaded: false,
          loading: false
        }
      }

    /* These 3 cases are used to not overflow the back-end with requests on redeeming affiliate codes */
    case USER_REDEEM_AFFILIATE_CODE:
      return {
        ...state,
        affiliate: {
          ...state.affiliate,
          redeeming: true
        }
      }
    case USER_REDEEM_AFFILIATE_CODE_SUCCESS:
      return {
        ...state,
        affiliate: {
          ...state.affiliate,
          redeeming: false
        }
      }
    case USER_REDEEM_AFFILIATE_CODE_FAILURE:
      return {
        ...state,
        affiliate: {
          ...state.affiliate,
          redeeming: false
        }
      }

    /* These 3 cases are used to not overflow the back-end with requests on creating affiliate codes */
    case USER_CREATE_AFFILIATE_CODE:
      return {
        ...state,
        affiliate: {
          ...state.affiliate,
          creating: true
        }
      }
    case USER_CREATE_AFFILIATE_CODE_SUCCESS:
      return {
        ...state,
        affiliate: {
          ...state.affiliate,
          creating: false
        }
      }
    case USER_CREATE_AFFILIATE_CODE_FAILURE:
      return {
        ...state,
        affiliate: {
          ...state.affiliate,
          creating: false
        }
      }

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
