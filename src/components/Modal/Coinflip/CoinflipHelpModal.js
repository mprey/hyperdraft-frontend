import React, { Component } from 'react'
import Modal from '../Modal'

class CoinflipHelpModal extends Component {

  render() {
    return (
      <Modal isOpen={this.props.isOpen}>
        <div className="title">How to play Coinflip</div>
        <div className="content">
          <p>
            The concept behind Coinflip is a generational tradition, the classic 50/50.<br />

            <h3 className="ui header">Create:</h3>
            To place a bet, you must stake 2.5 Hyper Credits by clicking "Create Coinflip" and entering your Hyper Credit Amount.

            <h3 className="ui header">Join:</h3>
            To enter a bet, you must have the exact equivalent of Hyper Credits available in your wallet to duel versus another player - once you have acquired Hyper Credits, simply press the "Joinable" button and you will be entered automatically.

            <h3 className="ui header">Transparency:</h3>
            Odds are entirely 50/50, round hash for each game is displayed in the Coinflip round. <br />

            The house cut on Coinflip is 5% of the total Hyper Credit value, we will never take more than 5% guaranteed.
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

export { CoinflipHelpModal }
