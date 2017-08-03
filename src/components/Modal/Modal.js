import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'

class Modal extends Component {

  render() { return null }

  componentDidMount() {
    this.portal = document.createElement('div')

    const parent = document.body
    parent.appendChild(this.portal)
    this.componentDidUpdate()
  }

  componentWillUnmount() {
    document.body.removeChild(this.portal)
  }

  componentDidUpdate() {
    ReactDOM.render(
      <ReactCSSTransitionGroup
        transitionName="fade-gif"
        transitionEnterTimeout={300}
        transitionLeaveTimeout={500}
      >
        {this.props.isOpen &&
          <div className="action-modal open">
            <div className="backdrop" />
            <div className="modal">
              <div className="inner">
                {!this.props.loading && this.props.children}
              </div>
              <ReactCSSTransitionGroup
                transitionName="fade-gif"
                transitionEnterTimeout={300}
                transitionLeaveTimeout={500}
              >
                {this.props.loading &&
                  <div className="loading-div">
                    <div className="loader">
                      <i className="huge notched circle loading icon" />
                    </div>
                  </div>
                }
              </ReactCSSTransitionGroup>
            </div>
          </div>
        }
      </ReactCSSTransitionGroup>
    , this.portal)
  }

}

export default Modal
