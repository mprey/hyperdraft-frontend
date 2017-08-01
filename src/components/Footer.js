import React, { Component } from 'react'

class Footer extends Component {

  render() {
    return (
      <div className="footer">
        <div className="data">
          <div className="social">
            <a href="https://twitter.com/HyperDraft" target="_blank" rel="noopener noreferrer"><i className="twitter icon"></i></a>
            <a href="https://facebook.com/HyperDraft" target="_blank" rel="noopener noreferrer"><i className="facebook icon"></i></a>
            <a href="https://www.reddit.com/r/hyperdraft" target="_blank" rel="noopener noreferrer"><i className="reddit alien icon"></i></a>
            <a href="http://steamcommunity.com/groups/hyperdraft" target="_blank" rel="noopener noreferrer"><i className="steam icon"></i></a>
            <a href="https://vk.com/hyperdraft" target="_blank" rel="noopener noreferrer"><i className="vk icon"></i></a>
          </div>
          <div className="copyright">&copy; HyperDraft 2016</div>
          <div className="legal">
            <a href="pages/terms.html" target="_blank" rel="noopener noreferrer">Terms</a>
            <a href="pages/privacy.html" target="_blank" rel="noopener noreferrer">Privacy</a>
            <a href="http://www.responsiblegambling.org/" target="_blank" rel="noopener noreferrer">Responsible Gaming</a>
          </div>
        </div>
      </div>
    )
  }

}

export { Footer }
