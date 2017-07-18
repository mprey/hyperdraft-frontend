import { routerReducer } from 'react-router-redux'
import { combineReducers } from 'redux'
import auth from './auth.js'

export default combineReducers({
  router: routerReducer,
  auth
})
