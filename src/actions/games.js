import { alert } from './alert'
import _ from 'lodash'

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

export function joinRoulette(gameid, value, selection) {
  return {
    type: 'socket',
    types: [ROULETTE_JOIN_GAME, ROULETTE_JOIN_GAME_SUCCESS, ROULETTE_JOIN_GAME_FAILURE],
    promise: (socket) => socket.emitAction('joinRoulette', { gameid, value, selection }).catch(error => {
      alert('error', `Error joining roulette: ${error}`, 'Roulette')
      throw error
    })
  }
}

export function loadCoinflipHistory(name, count) {
  return {
    type: 'socket',
    types: [COINFLIP_LOAD_HISTORY, COINFLIP_LOAD_HISTORY_SUCCESS, COINFLIP_LOAD_HISTORY_FAILURE],
    promise: (socket) => socket.emitAction('getRecentHistoricalCoinflips', { name, count }).then(data => {
      const array = _.map(data)
      if (array.length > count) {
        array.length = count
      }
      return array
    }).catch(error => {
      alert('error', `Error loading coinflip history: ${error}`, 'Coinflip')
      throw error
    })
  }
}

export function loadRouletteHistory(name, count) {
  return {
    type: 'socket',
    types: [ROULETTE_LOAD_HISTORY, ROULETTE_LOAD_HISTORY_SUCCESS, ROULETTE_LOAD_HISTORY_FAILURE],
    promise: (socket) => socket.emitAction('getRecentRouletteHistory', { name }).then(data => {
      const array = _.map(data)
      if (array.length > count) {
        array.length = count
      }
      return array
    }).catch(error => {
      alert('error', `Error loading roulette history: ${error}`, 'Roulette')
      throw error
    })
  }
}

export function addRouletteHistoryGame(payload) {
  return {
    type: ROULETTE_ADD_HISTORY_GAME,
    payload
  }
}
