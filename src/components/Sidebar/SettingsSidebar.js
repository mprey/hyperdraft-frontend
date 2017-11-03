import React, { Component } from 'react'
import classNames from 'classnames'
import settings from '../../settings'
import { alert } from '../../actions'
import $ from 'jquery'
import 'jquery-ui/ui/widgets/slider'

class SettingsSidebar extends Component {

  constructor(props) {
    super(props)

    this.updateDesktopNotifications = this.updateDesktopNotifications.bind(this)
    this.updateSounds = this.updateSounds.bind(this)
    this.updateTradeURL = this.updateTradeURL.bind(this)
  }

  componentDidMount() {
    this.refs.desktop.checked = settings.desktopNotifs
    this.refs.sounds.checked = settings.disabledSounds
    this.refs.tradeUrl.value = this.props.user ? this.props.user.tradeurl : null

    $('.sounds-volume-slider').range({
      min: 0,
      max: 1.0,
      start: settings.soundsVolume,
      step: 0.05,
      onChange: (val) => {
        $('.webSettings-volume-slider label span.val').text(`${parseInt(val * 100, 10)}%`)
        settings.updateSoundVolume(val)
      }
    })
  }

  updateDesktopNotifications() {
    settings.toggleDesktopNotifications()
  }

  updateSounds() {
    settings.toggleDisabledSounds()
  }

  updateTradeURL() {
    const button = $('.update-settings-btn')
    const tradeUrl = this.refs.tradeUrl.value

    if (button.hasClass('loading')) return

    button.addClass('loading')

    this.props.updateTradeURL(tradeUrl).then(data => {
      alert('success', 'Your settings have been updated', 'Account Settings')
      button.removeClass('loading')
      setTimeout(() => window.location.reload(), 3000)
    }).catch(err => {
      alert('error', err, 'Account Settings')
      button.removeClass('loading')
    })
  }

  render() {
    const { currentTab } = this.props
    return (
      <div className={classNames({ 'ui': true, 'inner': true, 'segment': true, 'tab': true, 'settings': true, 'active': (currentTab === 'settings') })}>
        <div className="ui container">
          <h1 className="ui header">Website Settings</h1>
          <div className="ui grid container checkboxes">
            <div className="sixteen wide column">
              <div className="ui toggle checkbox webSettings-confirmations">
                <input ref="desktop" type="checkbox" name="desktop" onClick={this.updateDesktopNotifications} />
                <label>Enable Desktop Notifications</label>
              </div>
            </div>
            <div className="sixteen wide column">
              <div className="ui toggle checkbox webSettings-sounds">
                <input ref="sounds" type="checkbox" name="sounds" onClick={this.updateSounds} />
                <label>Disable Sounds</label>
              </div>
            </div>
          </div>
          <div className="webSettings-volume-slider">
            <label>Sounds Volume: <span className="val"></span></label>
            <div className="ui range sounds-volume-slider"></div>
          </div>

          <h1 className="ui header">Account Settings</h1>
          <form className="ui form">
            <div className="field">
              <label>Steam Trade URL</label>
              <input ref="tradeUrl" type="url" id="steam_tradeUrl" name="steam-trade-url" placeholder="https://steamcommunity.com/tradeoffer/new/?partner=xxxx&token=xxxx" />
              <small><a href="https://steamcommunity.com/id/me/tradeoffers/privacy#trade_offer_access_url" target="_blank" rel="noopener noreferrer">Click here to retrieve it</a></small>
            </div>
          </form>

          <div className="btn-container">
            <button className="ui big button update-settings-btn" onClick={this.updateTradeURL}>Update</button>
          </div>

          <div className="stats module">
            <i className="material-icons">history</i>
            <h2 className="ui center aligned header">History & Stats</h2>
            <p className="desc">Everything you do is logged so you can see what you did at any time, whenever you want.</p>
            <button className="ui big button" /*onClick="route.change('account')"*/>View Stats</button>
          </div>
        </div>
      </div>
    )
  }

}

export { SettingsSidebar }
