import React, { Component } from 'react'

import coinflipCT from '../../../static/img/games/coinflip/ct.png'
import coinflipT from '../../../static/img/games/coinflip/t.png'

class CoinflipListing extends Component {

  render() {
    const { game } = this.props
    const playerID = Object.keys(game.players)[0]
    return (
      <tr className="listing" data-id={game.id} data-user-id={playerID} data-timestamp-end="null" data-expire="{{expire}}">
        <td className="side"><img src={game.selections.heads ? coinflipCT : coinflipT} alt="side" /></td>
        <td className="pp"><img src={game.players[playerID].avatar.medium} alt="user" /></td>
        <td className="name"><span>{game.players[playerID].username}</span></td>
        <td className="wager">{Number(game.value * 100).toFixed(0)} <i className="hc"></i></td>
        <td className="status">
          <span className="joinable">Joinable</span>
        </td>
      </tr>
    )
  }

}

export { CoinflipListing }
