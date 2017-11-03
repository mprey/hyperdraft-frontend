import React, { Component } from 'react'
import Modal from '../Modal'

class RouletteHelpModal extends Component {

  render() {
    return (
      <Modal isOpen={this.props.isOpen}>
        <div className="title">How to play Roulette</div>
        <div className="content">
          <p>
            There are three colors, each color corresponds with their respective numbers. <br />

            <h3 className="ui header">Colors:</h3>
            Red are Even numbers and payout 2X your bet (2, 4, 6, 8 etc)<br />
            Black are Odd numbers and payout 2X your bet  (1, 3, 5, 7 etc)<br />
            Blue is ZERO, the payout is 14X your bet<br />

            <h3 className="ui header">Betting:</h3>
            To place a bet, select the amount of Hyper Credits you'd like to stake and click on the appropriate Color you'd like to place your bet on. You can only place bets every 2 seconds, you can see all of our onsite notifications through the alert at the bottom of your screen.<br />
          </p>
        </div>
        <div className="footer">
          <div className="actions">
            <button className="ui button action cancel" onClick={this.props.onClose}>Close</button>
          </div>
        </div>
      </Modal>
    )
  }

}

export { RouletteHelpModal }
