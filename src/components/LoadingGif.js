import React, { Component } from 'react'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'

import loading from '../static/img/loading.gif'

class LoadingGif extends Component {

  render() {
    return (
      <ReactCSSTransitionGroup transitionName="fade-gif" transitionLeaveTimeout={0} transitionEnterTimeout={0}>
          {this.props.isLoading &&
            <div className="preloader">
              <img src={loading} alt="loading" />
            </div>
          }
      </ReactCSSTransitionGroup>
    )
  }

}

export { LoadingGif }
