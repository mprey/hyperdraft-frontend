import State from 'statesync'
import client from './socket'
import _ from 'lodash'

const state = new State()

export default function() {
  client.emitAction('getAppState').then(data => {
    _.each(data, (value, key) => state.set(key, value))
  }).catch(error => {
    console.log(`Error while loading the app state: ${error}`)
  })
}

export { state }
