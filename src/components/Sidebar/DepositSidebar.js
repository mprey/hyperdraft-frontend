import React, { Component } from 'react'
import classNames from 'classnames'

class DepositSidebar extends Component {

  constructor(props) {
    super(props)

    this.reloadInventory = this.reloadInventory.bind(this)
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.currentTab === 'deposit' && this.props.currentTab !== 'deposit') {
      if (!this.props.inventory.loading && !this.props.inventory.loaded) {
        this.props.loadInventory()
      }
    }
  }

  reloadInventory() {
    if (!this.props.inventory.loading) {
      this.props.loadInventory()
    }
  }

  render() {
    const { currentTab, inventory } = this.props
    return (
      <div className={classNames({ 'ui': true, 'inner': true, 'segment': true, 'tab': true, 'deposit': true, 'active': (currentTab === 'deposit') })}>
        <h2 className="ui huge center aligned header">Your Steam Inventory</h2>
        <p className="desc">Minimum item value is $1.00 <br /> To withdraw, your total account deposits must be over $5.00</p>
        <div className="steam-inventory">
          <div className="sort">
            <div className="ui icon fluid input">
              <i className={classNames({ 'refresh': true, 'link': true, 'icon': true, 'loading': inventory.loading })} onClick={this.reloadInventory}></i>
              <input type="text" placeholder="Search for an item..." />
            </div>
          </div>
          <div className="inventory"></div>
          <div className="stats">
            <div className="ui three column grid">
              <div className="column">
                <div className="ui statistic">
                  <div className="value item-count">
                    0
                  </div>
                  <div className="label">
                    Item(s) Selected
                  </div>
                </div>
              </div>
              <div className="column">
                <div className="ui statistic">
                  <div className="value items-value">
                    0
                  </div>
                  <div className="label">
                    Value (USD)
                  </div>
                </div>
              </div>
              <div className="column">
                <div className="ui statistic">
                  <div className="value items-value-hc">
                    0
                  </div>
                  <div className="label">
                    Value (<i className="hc"></i>)
                  </div>
                </div>
              </div>
            </div>
          </div>
          <button className="ui button fluid send-trade-btn"><i className="send icon"></i> Send Trade Offer</button>
        </div>
      </div>
    )
  }

}

export { DepositSidebar }
