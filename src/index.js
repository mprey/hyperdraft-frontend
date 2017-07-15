import './static/index.css'

import React from 'react'
import ReactDOM from 'react-dom'
import { ConnectedRouter } from 'react-router-redux'
import createHistory from 'history/createBrowserHistory'
import { Provider } from 'react-redux'

import configureStore from './store/configureStore'
import { App } from './containers'

const initialState = window.__INITIAL_STATE__
const app = document.getElementById('app')
const history = createHistory()
const store = configureStore(initialState, history)

ReactDOM.render(
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <App />
    </ConnectedRouter>
  </Provider>,
  app
)
