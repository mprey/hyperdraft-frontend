const steam = require('steam-login'),
    jwt = require('jsonwebtoken'),
    async = require('async'),
    request = require('request');

const op = require('@opskins/api');
const opskins = {
    main: new op('34540f62abe53d962a540f6312f4acf5'),
    bot1: new op('dad6361b6ddc7f751cabd5df985f44'),
    bot2: new op('431c6eb6aaab391e971192e6dce1f6'),
    bot3: new op('14dc2acf0ef6e00f73a1540776ae84')
};

const apiKey = 'e4769d343fed94a53ab360ec1acb67fc';
const apiUrl = 'http://api.csgo.steamlytics.xyz';

const secret = 'joaa2ssd';

module.exports = (router, io, connection, knex) => {

    const setToken = function(steamid){
        return token = jwt.sign({steamid}, secret, {expiresIn: '14d'});
    };

    const getPriceList = function(callback) {
        opskins.main.getLowestPrices(730, function (err, items) {
            callback(items);
        });
        /*request.get(apiUrl+'/v2/pricelist/compact?key='+apiKey, function(err, response, body){
            let data = JSON.parse(body);
            if(data.success === true){
                callback(data);
            } else {
                callback({success: false, message: 'Price List: FAIL - Try again in 10mins'});
            }
        });*/
    };

    const getDescList = function(callback){
        request.get('https://api.steamapi.io/market/items/730?key=817b3d9db4e51f2891f3cc2649db896f', function(err, response, body){
            let data = JSON.parse(body);
            callback(data);
        });
    };

    const buildItemArray = function(prices, desc, callback) {
        let dataArray = [];
        const date = new Date();
        const dateCheck = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + (date.getDate()-3);
        priceList = prices;
        descList = desc;
        async.forEach(descList, function (value, key, callback) {
            if (priceList[value.market_name] !== undefined) {
                let itemData = {
                    name: value.market_name,
                    price: parseFloat(parseInt(priceList[value.market_name].price) / 100).toFixed(2),
                    image: value.icon_url,
                    type: value.type,
                    nameColor: value.name_color,
                };
                connection.beginTransaction((err) => {
                    if (err) {
                        throw err;
                    }
                    connection.query('SELECT * FROM items WHERE name = ' + connection.escape(itemData.name), (err, result) => {
                        if (err) {
                            return connection.rollback(() => {
                                throw err;
                            })
                        }
                        if (result.length <= 0) {
                            connection.query('INSERT INTO items SET ?', itemData, (err, result) => {
                                if (err) {
                                    return connection.rollback(() => {
                                        throw err;
                                    })
                                }
                                connection.commit((err) => {
                                    if (err) {
                                        return connection.rollback(() => {
                                            throw err;
                                        })
                                    }
                                    console.log(value.market_name);
                                });
                            });
                        } else {
                            connection.query('UPDATE items SET price = ' + itemData.price + ' WHERE name = ' + itemData.name, (err, result) => {
                                if (err) {
                                    return connection.rollback(() => {
                                        throw err;
                                    })
                                }
                                connection.commit((err) => {
                                    if (err) {
                                        return connection.rollback(() => {
                                            throw err;
                                        })
                                    }
                                    console.log(value.market_name + ' UPDATED');
                                })
                            })
                        }
                    })
                })
            } else {
                let itemData = {
                    name: value.market_name,
                    price: 0,
                    image: value.icon_url,
                    type: value.type,
                    nameColor: value.name_color
                };
                connection.beginTransaction((err) => {
                    if (err) {
                        throw err;
                    }
                    connection.query('SELECT * FROM items WHERE name = ' + connection.escape(itemData.name), (err, result) => {
                        if (err) {
                            return connection.rollback(() => {
                                throw err;
                            })
                        }
                        if (result.length <= 0) {
                            connection.query('INSERT INTO items SET ?', itemData, (err, result) => {
                                if (err) {
                                    return connection.rollback(() => {
                                        throw err;
                                    })
                                }
                                connection.commit((err) => {
                                    if (err) {
                                        return connection.rollback(() => {
                                            throw err;
                                        })
                                    }
                                    console.log(value.market_name);
                                });
                            });
                        } else {
                            if (result[0].price > 0) {
                                itemData.price = result[0].price;
                            }
                            connection.query('UPDATE items SET price = ' + itemData.price + ' WHERE name = ' + itemData.name, (err, result) => {
                                if (err) {
                                    return connection.rollback(() => {
                                        throw err;
                                    })
                                }
                                connection.commit((err) => {
                                    if (err) {
                                        return connection.rollback(() => {
                                            throw err;
                                        })
                                    }
                                    console.log(value.market_name + ' UPDATED');
                                })
                            })
                        }
                    })
                })
            }
        });
    };

    const updateSkinPrices = function(callback) {
        getPriceList(function (prices) {

            getDescList(function (desc) {
                buildItemArray(prices, desc, function (data) {
                    callback(data);
                });
            });

        });
    };

    router.get('/auth', steam.authenticate(), function(req, res){
        res.redirect('https://nerdom.co');
    });

    router.get('/verify', steam.verify(), function(req, res){
        connection.query('SELECT * FROM users WHERE steamid = '+req.user.steamid, (err, results, fields) => {
            if(results.length <= 0){
                connection.query('INSERT INTO users (steamid, username, avatar) VALUES (?, ?, ?)', [req.user.steamid, req.user.username, req.user.avatar.large], (err, result) => {
                    if(!err){
                        const token = setToken(req.user.steamid);
                        res.cookie('auth', token).redirect('http://localhost:3000');
                    } else {
                        console.log(err);
                        res.json({success: false});
                    }
                })
            } else {
                const token = setToken(req.user.steamid);
                res.cookie('auth', token).redirect('http://localhost:3000');
            }
        });
    });

    router.get('/add-items', (req, res) => {
        updateSkinPrices(function(data){
            res.status(200);
            res.json(data);
        });
    });

    router.use(function(req, res, next){
        const token = req.cookies.auth;
        if(!token) return res.redirect('https://nerdom.co/api/v1/auth');

        jwt.verify(token, secret, function(err, user){
            if(err){
                return res.json({
                    success: false
                });
            } else {
                req.steamid = user.steamid;
                next();
            }
        })
    });

    router.get('/user/backpack', (req, res) => {
        knex('backpack').select('id', 'name').where({steamid: req.steamid, status: 'owned'})
            .then(rows => {
                let items = rows;
                if(rows.length <= 0) {
                    async.eachOf(items, (row, index, callback) => {
                        knex('items').select('image', 'price').where('name', row.name)
                            .then(item => {
                                items[index].image = item[0].image;
                                items[index].price = parseFloat(item[0].price).toFixed(2);
                                callback();
                            })
                            .catch(err => {
                                if (err) {
                                    console.log(err);
                                    callback('Broke');
                                }
                            });
                    }, err => {
                        if (err) {
                            console.log(err);
                        } else {
                            res.json({success: true, data: items});
                        }
                    });
                } else {
                    res.json({success: true, data: []});
                }
            })
            .catch(err => {
                console.log(err);
                res.json({success: false});
            })
    });

    return router;
};