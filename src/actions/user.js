import {
  USER_LOAD_INVENTORY,
  USER_LOAD_INVENTORY_FAILURE,
  USER_LOAD_INVENTORY_SUCCESS,
  USER_CREATE_AFFILIATE_CODE,
  USER_CREATE_AFFILIATE_CODE_SUCCESS,
  USER_CREATE_AFFILIATE_CODE_FAILURE,
  USER_REDEEM_AFFILIATE_CODE,
  USER_REDEEM_AFFILIATE_CODE_SUCCESS,
  USER_REDEEM_AFFILIATE_CODE_FAILURE,
  USER_LOAD_AFFILIATE_STATS,
  USER_LOAD_AFFILIATE_STATS_SUCCESS,
  USER_LOAD_AFFILIATE_STATS_FAILURE
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

export function loadAffiliateStats(user) {
  return {
    type: 'socket',
    types: [USER_LOAD_AFFILIATE_STATS, USER_LOAD_AFFILIATE_STATS_SUCCESS, USER_LOAD_AFFILIATE_STATS_FAILURE],
    promise: (socket) => socket.emitAction('getPartnerDetails', { userid: user.id }).then(data => {
      console.log(data)
    }).catch(error => {
      console.log(error)
    })
  }
}

export function redeemAffiliateCode(code) {
  return {
    type: 'socket',
    types: [USER_REDEEM_AFFILIATE_CODE, USER_REDEEM_AFFILIATE_CODE_SUCCESS, USER_REDEEM_AFFILIATE_CODE_FAILURE],
    promise: (socket) => socket.emitAction('usePartnerCode', { code }).then(data => {
      alert('success', data, 'Redeem Code')
    }).catch(error => {
      alert('error', error, 'Redeem Code')
      throw error
    })
  }
}

export function createAffiliateCode(code) {
  return {
    type: 'socket',
    types: [USER_CREATE_AFFILIATE_CODE, USER_CREATE_AFFILIATE_CODE_SUCCESS, USER_CREATE_AFFILIATE_CODE_FAILURE],
    promise: (socket) => socket.emitAction('createPartnerCode', { code }).then(data => {
      alert('success', `Your code '${code}' has been created.`, 'Affiliates')
      loadAffiliateStats()
    }).catch(error => {
      alert('error', error, 'Affiliates')
      throw error
    })
  }
}
