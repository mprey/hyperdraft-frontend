import {
  alert
} from './actions'

const defaults = {
  desktopNotifs: false,
	disableSounds: false,
	soundsVol: 0.5
}

class Settings {

  constructor() {
    if (localStorage.getItem('settings')) {
      this.settings = JSON.parse(localStorage.getItem('settings'))
    } else {
      this.settings = defaults
    }

    this.checkDesktopPermission()
    this.save()
  }

  get disabledSounds() {
    return this.settings.disableSounds
  }

  get soundsVolume() {
    return this.settings.soundsVol
  }

  get desktopNotifs() {
    return this.settings.desktopNotifs
  }

  updateSoundVolume(val) {
    this.settings.soundsVol = val
    this.save()
  }

  toggleDesktopNotifications() {
    this.settings.desktopNotifs = !this.settings.desktopNotifs
    this.save()

    if (this.settings.desktopNotifs) {
      this.checkDesktopPermission()
    }
  }

  toggleDisabledSounds() {
    this.settings.disableSounds = !this.settings.disableSounds
    this.save()
  }

  checkDesktopPermission() {
    if (this.settings.desktopNotifs) {
			if (Notification.permission !== 'granted') {
				Notification.requestPermission().then((result) => {
					if (result !== 'granted') {
						alert('error', 'You have dismissed or denied the browser notifications request.', 'Notifications')
						return
					}
				})
			}
		}
  }

  save() {
    localStorage.setItem('settings', JSON.stringify(this.settings))
  }

}

const instance = new Settings()

export default instance
