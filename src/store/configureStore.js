import { createStore, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk'
import logger from 'redux-logger'
import { routerMiddleware } from 'react-router-redux'

import reducers from '../reducers'
import socketMiddleware from './middleware/socketMiddleware'

const createFinalStore = (history) => {
  const middlewares = [routerMiddleware(history), socketMiddleware(), thunk]

  if (process.env.NODE_ENV === 'development') {
    //middlewares.push(logger)
  }

  return compose(applyMiddleware(...middlewares))(createStore)
}

export default function configureStore(initialState, history) {
  return createFinalStore(history)(reducers, initialState)
}
