import {
  UPDATE_ONLINE_COUNT,
  SERVER_UPDATE
} from '../constants'

export function updateClient(diff) {
  return {
    type: SERVER_UPDATE,
    payload: diff
  }
}

export function updateOnlineCount(count) {
  return {
    type: UPDATE_ONLINE_COUNT,
    payload: count
  }
}
