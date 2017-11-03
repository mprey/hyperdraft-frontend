import React, { Component } from 'react'

class CoinflipHistoryListing extends Component {

  render() {
    const { game } = this.props
    var winner = game.players[game.winner]
    if (!winner) winner = {}
    return (
      <tr className="listing" data-id={game.id}>
        <td className="pp"><img src={winner.avatar ? winner.avatar.medium : ""} alt="winner" /></td>
        <td className="name" data-id={winner.id}><span>{winner.username}</span></td>
        <td className="wager">{Number(game.value * 100).toFixed(0)} <i className="hc"></i></td>
      </tr>
    )
  }

}

export { CoinflipHistoryListing }
