import toastr from 'toastr'
import { playSound } from './sound'
import settings from '../settings'

import notificationImage from '../static/img/notification.png'
import errorSound from '../static/sounds/error.mp3'
import successSound from '../static/sounds/success.mp3'
import infoSound from '../static/sounds/info.mp3'

export function alert(type, text, title, noSound) {
  switch (type) {
		case 'error':
			toastr.error(text, title)
      if (noSound) return
			if (!settings.disabledSounds) {
				playSound(errorSound)
			}
			break

		case 'success':
			toastr.success(text, title)
			if (noSound) return
			if (!settings.disabledSounds) {
				playSound(successSound)
			}
			break

		case 'info':
			toastr.info(text, title)
			if (noSound) return
			if (!settings.disabledSounds) {
				playSound(infoSound)
			}
			break

		default:
			console.error('ERROR: Alert not defined.')
	}
}

export function desktopAlert(title, text, link) {
  if (document.hasFocus()) return
	if (!settings.desktopNotifs) return

	var notification = new Notification(title, {
		icon: notificationImage,
		body: text
	})
	notification.onclick = function() {
		if (link) {
			window.open(link)
		} else {
			window.focus()
		}
		notification.close()
	}
}
