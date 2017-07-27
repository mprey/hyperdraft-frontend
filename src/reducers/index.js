import { routerReducer } from 'react-router-redux'
import { combineReducers } from 'redux'

import auth from './auth'
import app from './app'
import user from './user'
import chat from './chat'

export default combineReducers({
  router: routerReducer,
  auth,
  app,
  user,
  chat
})
