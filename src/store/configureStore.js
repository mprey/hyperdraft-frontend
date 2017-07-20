import { createStore, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk'
import logger from 'redux-logger'
import { routerMiddleware } from 'react-router-redux'

import reducers from '../reducers'
import socketMiddleware from './middleware/socketMiddleware'

const createFinalStore = (history) => {
  return compose(
    applyMiddleware(
      routerMiddleware(history),
      socketMiddleware(),
      thunk,
      //logger
    ),
  )(createStore)
}

export default function configureStore(initialState, history) {
  return createFinalStore(history)(reducers, initialState)
}
