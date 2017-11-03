import uuid from 'uuid'
import axios from 'axios'
import client from '../socket'

import {
  AUTH_LOAD_REQUEST,
  AUTH_LOAD_SUCCESS,
  AUTH_LOAD_FAILURE,
  AUTH_LOGOUT
 } from '../constants'

export function loadAuth() {
  return (dispatch) => {
    dispatch(loadAuthRequest())

    if (localStorage.getItem('authToken')) {
      return verifyAuthToken(localStorage.getItem('authToken'), dispatch)
    }

    const clientToken = getClientToken()

    axios.post('https://auth.csgodirect.com/steam/login', {
      clientToken
    }).then(({ data: { id, userid } }) => {
      verifyAuthToken(id, dispatch)
    }).catch(error => dispatch(loadAuthFailure()))
  }
}

export function logout() {
  return (dispatch) => {
    dispatch(logoutRequest())

    localStorage.removeItem('authToken')
    window.location.reload()
  }
}

export function login() {
  return (dispatch) => {
    const clientToken = getClientToken()

    window.location.href = `https://auth.csgodirect.com/steam/auth?clientToken=${clientToken}&onSuccess=${window.location.href}&onFailure=${window.location.href}`
  }
}

function logoutRequest() {
  return {
    type: AUTH_LOGOUT
  }
}

function verifyAuthToken(token, dispatch) {
  client.emit('setToken', token).then(user => {
    localStorage.setItem('authToken', token)
    dispatch(loadAuthSuccess(user))
  }).catch(error => dispatch(loadAuthFailure()))
}

function loadAuthSuccess(user) {
  return {
    type: AUTH_LOAD_SUCCESS,
    payload: user
  }
}

function loadAuthFailure() {
  return {
    type: AUTH_LOAD_FAILURE
  }
}

function loadAuthRequest() {
  return {
    type: AUTH_LOAD_REQUEST
  }
}

function getClientToken() {
  const clientToken = localStorage.getItem('clientToken') || uuid.v4()
  localStorage.setItem('clientToken', clientToken)

  return clientToken
}
