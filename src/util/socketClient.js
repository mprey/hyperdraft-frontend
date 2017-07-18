import io from 'socket.io-client'

export default class SocketClient {

  constructor(url) {
    this.url = url

    this.connect()
  }

  connect() {
    if (this.socket) {
      this.disconnect()
    }

    this.socket = io(this.url)
  }

  disconnect() {
    return new Promise((resolve) => {
      this.socket.disconnect(() => {
        this.socket = null;
        resolve()
      })
    })
  }

  /* Async socket events for redux */
  emit(event, data) {
    return new Promise((resolve, reject) => {
      if (!this.socket) return reject('No socket connection.')

      return this.socket.emit(event, data, (error, response) => {
        if (error) {
          return reject(error)
        }
        return resolve(response)
      })
    })
  }

  on(event, handle) {
    if (this.socket) {
      this.socket.on(event, handle)
    }
  }

  off(event) {
    if (this.socket) {
      this.socket.off(event)
    }
  }

}
