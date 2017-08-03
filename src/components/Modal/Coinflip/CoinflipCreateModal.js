import React, { Component } from 'react'
import Modal from '../Modal'
import classNames from 'classnames'
import { alert } from '../../../actions'

import coinflipCT from '../../../static/img/games/coinflip/ct.png'
import coinflipT from '../../../static/img/games/coinflip/t.png'

class CoinflipCreateModal extends Component {

  constructor(props) {
    super(props)

    this.state = {
      selected: null
    }

    this.createCoinflip = this.createCoinflip.bind(this)
  }

  createCoinflip() {
    const amount = this.refs.amount.value
    if (!this.state.selected) {
      return alert('error', 'Please select a side to bet on', 'Coinflip')
    } else if (!amount || !parseFloat(amount)) {
      return alert('error', 'Please enter a valid amount', 'Coinflip')
    }

    this.props.createCoinflip(this.state.selectSide, parseFloat(amount))
  }

  selectSide(side) {
    this.setState({ selected: side })
  }

  render() {
    return (
      <Modal isOpen={this.props.isOpen}>
        <div className="title">Create a Coinflip</div>
      	<div className="content">
      		<p>Choose a side and enter an amount.</p>
      		<div className="ui two column center aligned grid sides">
      			<div className="column">
      				<h1 className={classNames({ 'ui icon header side ct': true, 'selected': this.state.selected === '0' })} data-side="0" onClick={() => this.selectSide('0')}>
      					<img className="ui image" src={coinflipCT} alt="ct" />
      				</h1>
      			</div>
      			<div className="column">
      				<h1 className={classNames({ 'ui icon header side t': true, 'selected': this.state.selected === '1' })} data-side="1" onClick={() => this.selectSide('1')}>
      					<img className="ui image" src={coinflipT} alt="t" />
      				</h1>
      			</div>
      		</div>
      		<div className="ui input fluid amount">
      			<input type="text" ref="amount" className="currency-select" placeholder="Amount..." />
      		</div>
      	</div>
      	<div className="footer">
      		<div className="actions">
      			<button className="ui button action confirm" onClick={this.createCoinflip}>Create</button>
      			<button className="ui button action cancel" onClick={this.props.onClose}>Cancel</button>
      		</div>
      	</div>
      </Modal>
    )
  }

}

export { CoinflipCreateModal }
