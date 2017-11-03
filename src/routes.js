import React from 'react'
import { Route, Switch } from 'react-router-dom'
import { Games } from './containers'

const Routes = () => (
  <Switch>
    <Route exact path="/" component={Games} />
    <Route path="/games" component={Games} />
  </Switch>
)

export default Routes
