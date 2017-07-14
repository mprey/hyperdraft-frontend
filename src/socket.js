import io from 'socket.io-client'
import { socket } from '../config'

const socket = io(socket.url)

socket.on('connected', () => console.log('connected'))

export default socket
