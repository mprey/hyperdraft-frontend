import {
  UPDATE_ONLINE_COUNT
} from '../constants'

export function updateOnlineCount(count) {
  return {
    type: UPDATE_ONLINE_COUNT,
    payload: count
  }
}
