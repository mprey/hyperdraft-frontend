import {
  USER_LOAD_INVENTORY,
  USER_LOAD_INVENTORY_FAILURE,
  USER_LOAD_INVENTORY_SUCCESS
} from '../constants'

import { alert } from './alert'

export function loadInventory() {
  return {
    type: 'socket',
    types: [USER_LOAD_INVENTORY, USER_LOAD_INVENTORY_SUCCESS, USER_LOAD_INVENTORY_FAILURE],
    promise: (socket) => socket.emitAction('steamInventory').then(data => {
      if (Object.keys(data).length === 0) {
        alert('error', 'No items that match our criteria were found.', 'Steam Inventory')
      }
    }).catch(error => {
      alert('error', error, 'Steam Inventory')
      throw error
    })
  }
}
