const Promise = require('bluebird');
const async = require('async');
const _ = require('underscore');

module.exports = (connection, knex, io) => {
    let module = {};

    module.hexdec = function(hexString) {
        hexString = (hexString + '').replace(/[^a-f0-9]/gi, '');
        return parseInt(hexString, 16)
    };

    module.processRouletteWinner = (player, winnings, callback) => {
        knex('users').select('balance').where({steamid: player.steamid})
            .then(row => {
                const balance = parseFloat(row[0].balance);
                const newBalance = balance + parseFloat(winnings);
                knex.transaction(tx => {
                    console.log(winnings);
                    knex('users').where('steamid', '=', player.steamid).update({balance: newBalance}).transacting(tx)
                        .then((res) => {
                            console.log(res);
                            const data = {steamid: player.steamid, name: player.item};
                            knex('backpack').insert(data).transacting(tx)
                                .then(tx.commit)
                                .catch(tx.rollback)
                        })
                        .catch(tx.rollback)
                })
                    .then(() => {
                        callback({success: true});
                    })
                    .catch(err => {
                        console.log(err);
                        callback({success: false});
                    })
            })
            .catch(err => {
                console.log(err);
                callback({success: false});
            })

    };

    module.addItemToBackpack = (itemName, steamid, callback) => {
        const data = {steamid, name: itemName};
        knex('backpack').insert(data)
            .then(() => {
                callback({success: true});
            })
            .catch(() => {
                callback({success: false});
            })
    };

    module.roulleteTransaction = (roulette, user, steamid, balance, totalBet, itemNames, amount, side, itemWon, callback) => {
        if(amount > 0 && itemNames.length > 0){
            const newBalance = balance - amount;
            let data = null;
            if(roulette.timeLeft < 3000){
                data = {rouletteId: roulette.id + 1, steamid: steamid, name: user.username, avatar: user.avatar, amount: amount, side: side, totalBet, itemsBet: JSON.stringify(itemNames), item: itemWon.name, itemPrice: itemWon.price};
            } else {
                data = {rouletteId: roulette.id, steamid: steamid, name: user.username, avatar: user.avatar, amount: amount, side: side, totalBet, itemsBet: JSON.stringify(itemNames), item: itemWon.name, itemPrice: itemWon.price};
            }
            knex.transaction(tx => {
                knex('roulettePlayers').transacting(tx).insert(data)
                    .then(() => {
                        knex('users').where({steamid}).update({balance: newBalance}).transacting(tx)
                            .then(() => {
                                Promise.each(itemNames, item => {
                                    return knex('backpack').transacting(tx).where({steamid, name: item, status: 'owned'}).limit(1).update({status: 'roulette'});
                                })
                                    .then(tx.commit)
                                    .catch(tx.rollback);
                            })
                            .catch(tx.rollback);
                    })
                    .catch(tx.rollback);
            })
                .then(inserts => {
                    callback({success: true});
                })
                .catch(err => {
                    console.log(err);
                    callback({success: false});
                });
        } else if(itemNames.length > 0 && amount === 0){
            let data = null;
            if(roulette.timeLeft < 3000){
                data = {rouletteId: roulette.id + 1, steamid: steamid, name: user.username, avatar: user.avatar, amount: amount, side: side, totalBet, itemsBet: JSON.stringify(itemNames), item: itemWon.name, itemPrice: itemWon.price};
            } else {
                data = {rouletteId: roulette.id, steamid: steamid, name: user.username, avatar: user.avatar, amount: amount, side: side, totalBet, itemsBet: JSON.stringify(itemNames), item: itemWon.name, itemPrice: itemWon.price};
            }

            knex.transaction(tx => {
                knex('roulettePlayers').transacting(tx).insert(data)
                    .then(row => {
                        Promise.each(itemNames, item => {
                            return knex('backpack').transacting(tx).where({steamid, name: item, status: 'owned'}).limit(1).update({status: 'roulette'});
                        })
                            .then(tx.commit)
                            .catch(tx.rollback);
                    })
                    .catch(tx.rollback);
            })
                .then(() => {
                    callback({success: true});
                })
                .catch(err => {
                    console.log(err);
                })
        } else if(itemNames.length <= 0 && amount > 0){
            let data = null;
            if(roulette.timeLeft < 3000){
                data = {rouletteId: roulette.id + 1, steamid: steamid, name: user.username, avatar: user.avatar, amount: amount, side: side, totalBet, itemsBet: JSON.stringify(itemNames), item: itemWon.name, itemPrice: itemWon.price};
            } else {
                data = {rouletteId: roulette.id, steamid: steamid, name: user.username, avatar: user.avatar, amount: amount, side: side, totalBet, itemsBet: JSON.stringify(itemNames), item: itemWon.name, itemPrice: itemWon.price};
            }

            const newBalance = balance - amount;

            knex.transaction(tx => {
                knex('roulettePlayers').transacting(tx).insert(data)
                    .then(row => {
                        console.log(row);
                        knex('users').where({steamid}).update({balance: newBalance}).transacting(tx)
                            .then(tx.commit)
                            .catch(tx.rollback);
                    })
                    .catch(tx.rollback);
            })
                .then(inserts => {
                    callback({success: true});
                })
                .catch(err => {
                    console.log(err);
                    callback({success: false});
                });
        }
    };

    module.sellItems = (steamid, itemNames) => {
        console.log(itemNames);
        knex('backpack').select('name').where({steamid, status: 'owned'}).whereIn('name', itemNames)
            .then(rows => {
                console.log(rows);
                let hasItems = true;
                const backpackItems = _.pluck(rows, 'name');
                console.log(backpackItems);
                async.each(itemNames, (item, callback) => {
                    const index = backpackItems.indexOf(item);
                    if (index === -1) {
                        hasItems = false;
                    }
                    callback();
                }, err => {
                    if (!hasItems) {
                        io.sockets.in(steamid).emit('event', {
                            action: 'error',
                            data: {title: 'Sell Error', message: 'Skins not available!'}
                        });
                    } else {
                        let totalItemsSoldValue = 0;

                        knex('items').select().whereIn('name', itemNames)
                            .then(rows => {
                                Promise.each(rows, row => {
                                    totalItemsSoldValue += parseFloat(row.price);
                                })
                                    .then(() => {
                                        knex('users').select('balance').where({steamid})
                                            .then(row => {
                                                const balance = parseFloat(row[0].balance);
                                                const newBalance = balance + totalItemsSoldValue;
                                                knex.transaction(tx => {
                                                    knex('users').where({steamid}).update({balance: newBalance}).transacting(tx)
                                                        .then(() => {
                                                            Promise.each(itemNames, item => {
                                                                return knex('backpack').where({
                                                                    steamid,
                                                                    name: item,
                                                                    status: 'owned'
                                                                }).limit(1).update({status: 'sold'});
                                                            })
                                                                .then(tx.commit)
                                                                .catch(tx.rollback);
                                                        })
                                                        .catch(tx.rollback)
                                                })
                                                    .then(inserts => {
                                                        io.sockets.in(steamid).emit('event', {action: 'success', data: {title: 'Sold Success', message: 'Your item(s) were sold for $'+totalItemsSoldValue.toFixed(2)}});
                                                        io.sockets.in(steamid).emit('event', {action: 'balanceUpdate', data: {balance: newBalance.toFixed(2)}});
                                                    })
                                                    .catch(err => {
                                                        console.log(err);
                                                        io.sockets.in(steamid).emit('event', {
                                                            action: 'error',
                                                            data: {title: 'Sell Error', message: 'Something went wrong, please try again in a few minutes'}
                                                        });
                                                    });
                                            })
                                    })
                            })
                    }
                })
            })
    };

    return module;
};
