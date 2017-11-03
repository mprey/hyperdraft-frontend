import SocketClient from './util/socketClient'
import config from './config'

const client = new SocketClient(config.socket.url)

export default client
