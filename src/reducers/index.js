import { routerReducer } from 'react-router-redux'
import { combineReducers } from 'redux'

import auth from './auth.js'
import app from './app.js'

export default combineReducers({
  router: routerReducer,
  auth,
  app
})
