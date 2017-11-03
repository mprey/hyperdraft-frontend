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
  USER_LOAD_AFFILIATE_STATS_FAILURE,
  USER_CLAIM_AFFILIATE_BALANCE,
  USER_CLAIM_AFFILIATE_BALANCE_SUCCESS,
  USER_CLAIM_AFFILIATE_BALANCE_FAILURE,
  USER_LOAD_WALLETS,
  USER_LOAD_WALLETS_SUCCESS,
  USER_LOAD_WALLETS_FAILURE
} from '../constants'

import { alert } from './alert'
import client from '../socket'

export function loadUserWallets() {
  return {
    type: 'socket',
    types: [USER_LOAD_WALLETS, USER_LOAD_WALLETS_SUCCESS, USER_LOAD_WALLETS_FAILURE],
    promise: (socket) => socket.emitAction('getUserWallets').catch(error => {
      alert('error', `Error loading your balance: ${error}`, 'Wallet')
      throw error
    })
  }
}

export function reloadUserWallets() {
  return loadUserWallets()
}

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
  return (dispatch) => {
    dispatch(loadAffiliateStatsRequest())
    client.emitAction('getPartnerDetails', { userid: user.id }).then(codeDetails => {
      client.emitAction('getPartnerLevels').then(levelDetails => {
        dispatch(loadAffiliateStatsSuccess(codeDetails, levelDetails))
      }).catch(error => dispatch(loadAffiliateStatsFailure(error)))
    }).catch(error => dispatch(loadAffiliateStatsFailure(error)))
  }
}

function loadAffiliateStatsRequest() {
  return {
    type: USER_LOAD_AFFILIATE_STATS
  }
}

function loadAffiliateStatsSuccess(codeDetails, levelDetails) {
  return {
    type: USER_LOAD_AFFILIATE_STATS_SUCCESS,
    payload: { codeDetails, levelDetails }
  }
}

function loadAffiliateStatsFailure(error) {
  return {
    type: USER_LOAD_AFFILIATE_STATS_FAILURE,
    payload: error
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

export function claimAffiliateBalance(user, code) {
  return (dispatch) => {
    dispatch({ type: USER_CLAIM_AFFILIATE_BALANCE })
    client.emitAction('claimCodeBalance', { code }).then(data => {
      alert('success', 'Successfully claimed affiliate wallet balance', 'Collect Earnings')
      dispatch({ type: USER_CLAIM_AFFILIATE_BALANCE_SUCCESS })
      dispatch(loadAffiliateStats(user))
    }).catch(error => {
      alert('error', error, 'Collect Earnings')
      dispatch({ type: USER_CLAIM_AFFILIATE_BALANCE_FAILURE })
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
