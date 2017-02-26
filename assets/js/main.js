var socket = io.connect(document.location.origin, {
	reconnect: true,
	transports: ['websocket'],
	upgrade: false
})
// var socket = io.connect('https://hyperdraft.com/', {
// 	reconnect: true,
// 	transports: ['websocket'],
// 	upgrade: false
// })

// Settings
var localSettings = {
	notifications: false,
	noSounds: false,
	soundsVol: 0.5
}

var user = {
	id: null
}

const VERSION = '1.1.5'

// Sidebar
var sidebarNavToggled = false
var sidebarNavLock = false

$(function() {
	console.log('MAIN.JS VERSION', VERSION)

	// Load modules
	$.Mustache.load('/assets/components/components.html')
	$.Mustache.load('/assets/components/modals.html')

	// Alert Settings
	toastr.options.positionClass = 'toast-bottom-center'
	toastr.options.closeButton = true
	toastr.options.closeDuration = 300
	toastr.options.closeEasing = 'swing'
	toastr.options.showEasing = 'swing'
	toastr.options.showMethod = 'slideDown'
	toastr.options.hideMethod = 'fadeOut'
	toastr.options.closeMethod = 'fadeOut'
	toastr.options.preventDuplicates = true
	toastr.options.timeOut = 4000
	toastr.options.extendedTimeOut = 800
	toastr.options.progressBar = true
	toastr.options.onclick = function() {
		if ($('body').find('#coinflipNotification').length > 0) {
			coinflip.watch($('#coinflipNotification').attr('data-id'))
		}
		if ($('body').find('#tradeNotification').length > 0) {
			window.open('https://steamcommunity.com/tradeoffer/' + $('#tradeNotification').attr('data-id'))
		}
	}

	$.extend({
		playSound: function(file) {
			var audiofile = $(
				'<audio autoplay="autoplay" style="display:none;">' +
				'<source src="' + file + '.mp3" />' +
				'<source src="' + file + '.ogg" />' +
				'<embed src="' + file + '.mp3" hidden="true" autostart="true" loop="false" class="playSound" />' +
				'</audio>'
			).appendTo('body').on('ended', () => $(audiofile).remove());
			return audiofile
		}
	})

	// local storage
	if (!localStorage.getItem('localSettings')) {
		localStorage.setItem('localSettings', JSON.stringify(localSettings))
	} else {
		var settings = JSON.parse(localStorage.getItem('localSettings'))

		if (settings.notifications) {
			if (Notification.permission !== 'granted') {
				Notification.requestPermission().then(function(result) {
					if (result !== 'granted') {
						tAlert('error', 'You have dismissed or denied the browser notifications request.', 'Notifications')
						return
					}
				})
			}
			localSettings.notifications = true
		}
		localSettings.noSounds = settings.noSounds
		localSettings.soundsVol = settings.soundsVol
	}

	// Hide Support
	zE(function() {
		zE.hide()
	})

	// Link Redirect
	var urlPath = $(location).attr('hash')
	if (urlPath) {
		var cID = urlPath.split('#/').join('')
		route.change(cID)
	} else {
		route.change('games')
	}

	// Socket
	socket.emit('app.onlineCount', function(err, data) {
		$('.online-users-div span').text(data)
	})
	socket.on('app.onlineCountUpdate', function(data) {
		$('.online-users-div span').text(data)
	})
	socket.on('user.creditBalance', function(data) {
		if ($('body').find('.nocreditupdate').length > 0) return

		if (route.getPage() === 'games') {
			if (currentGamesTab === 'roulette' && roulette.inGame()) return
		}

		$('.acc-balance').text(data.toLocaleString())
		user.balance = data
	})
	socket.on('blockchain.update', function(data) {
		tAlert('info', 'Status Update: ' + data.confirmations + '/3 for id: ' + data.address, 'Bitcoin Transaction Update')
	})

	// Steam
	socket.on('market.offer.sent', function(data) {
		if (user.steam) {
			if (user.steam.tradeURL === data.requestData.tradeURL) {
				tAlert('info', '<c id="tradeNotification" data-id="' + data.offerID + '"></c> A trade offer has been sent to you. Please accept it within the next 5 minutes. You can open the trade offer by clicking this notification. <br> OFFER CODE: ' + data.offerCode, 'Steam Trading')
				tNotify('Steam Trading', 'New trade offer from HyperDraft')
			}
		}
	})
	socket.on('market.offer.accepted', function(data) {
		if (user.steam) {
			if (user.steam.tradeURL === data.requestData.tradeURL) {
				tAlert('success', 'Your trade offer was accepted, transaction complete.', 'Steam Trading')
			}
		}
	})
	socket.on('market.offer.declined', function(data) {
		if (user.steam) {
			if (user.steam.tradeURL === data.requestData.tradeURL) {
				tAlert('error', 'You have declined the trade offer.', 'Steam Trading')
			}
		}
	})
	socket.on('market.offer.error', function(data) {
		if (user.steam) {
			if (user.steam.tradeURL === data.requestData.tradeURL) {
				tAlert('error', 'An error has occured with your trade offer. ' + data.requestData.error, 'Steam Trading')
			}
		}
	})

	$('.mobile-menu-btn').click(function() {
		$('.mobile-menu').addClass('open')
	})
	$('.mobile-menu .close-btn, .mobile-menu .menu .menu-item').click(function() {
		$('.mobile-menu').removeClass('open')
	})

	$('.preloader img').fadeIn(500)

	$('.sidebar-action .funds-submenu .item').tab()
	$('.sidebar-action .funds-submenu .item').click(function() {
		updateLayout()
	})
})

$(window).on('load', function() {
	updateLayout()
	news.init()
	setTimeout(() => {
		$('.preloader').fadeOut()
	}, 1000)
})

$(window).on('resize', updateLayout)

function updateLayout() {
	var winHeight = $(window).height()
	var winWidth = $(window).width()

	if (!sidebarNavLock) {
		if (winWidth < 600 && !sidebarNavToggled) {
			toggleSidebarNav()
			sidebarNavToggled = true
		} else if (winWidth > 600 && sidebarNavToggled) {
			toggleSidebarNav()
			sidebarNavToggled = false
		}
	}

	// Sidebar
	var sidebarHeightInner = 0
	$('.sidebar-nav').children().not('.chat').each(function() {
		sidebarHeightInner += $(this).height()
	})
	// improve
	if ($('.sidebar-nav').height() < 580 && $('.sidebar-nav .menu-toggle').hasClass('open')) {
		$('.sidebar-nav').css('overflow-y', 'scroll').perfectScrollbar()
		$('.sidebar-nav .chat-messages, .sidebar-nav .chat-input').slideUp()
		$('.sidebar-nav .chat-mobile-alert').slideDown()
	} else if ($('.sidebar-nav').height() > 580) {
		$('.sidebar-nav').css('overflow-y', 'hidden').perfectScrollbar('destroy')
		$('.sidebar-nav .chat-messages, .sidebar-nav .chat-input').slideDown()
		$('.sidebar-nav .chat-mobile-alert').slideUp()
		$('.sidebar-nav .chat-messages .messages').css('height', ($('.sidebar-nav').height() - sidebarHeightInner) - 12)
	}

	if ($('body').children('.action-modal').length > 0) {
		if (winHeight < $('.action-modal .modal').height()) {
			$('.action-modal').css('display', 'block')
		} else {
			$('.action-modal').css('display', 'flex')
		}
	}
}

// Toggles
function toggleSidebarNav(action) {
	if (!sidebarNavToggled) { // if open
		$('.sidebar-nav').addClass('collapsed')
		$('.sidebar-nav .toggle').addClass('toggled')
		$('.sidebar-nav .branding').addClass('closed')
		$('.page-content').addClass('nav-collapsed')
		sidebarNavToggled = true
	} else {
		$('.sidebar-nav').removeClass('collapsed')
		$('.sidebar-nav .toggle').removeClass('toggled')
		$('.sidebar-nav .branding').removeClass('closed')
		$('.page-content').removeClass('nav-collapsed')
		sidebarNavToggled = false
	}
	if (action === 'click') {
		sidebarNavLock = true
	}
	updateLayout()
}

function toggleSidebarNavMenu() {
	if ($('.sidebar-nav .menu .menu-toggle').hasClass('open')) {
		$('.sidebar-nav .menu .menu-toggle').removeClass('open')
		$('.sidebar-nav .menu .inner').finish().slideUp(function() {
			updateLayout()
		})
	} else {
		$('.sidebar-nav .menu .menu-toggle').addClass('open')
		$('.sidebar-nav .menu .inner').finish().slideDown(function() {
			updateLayout()
		})
	}
}

// Funds
function buyFunds(amount) {
	tAlert('error', 'Bitcoin deposits are currently disabled, please check back at a later time.', 'Bitcoin')
	// var info = {
	//   payment: {
	//     amount: amount
	//   }
	// }
	// modal.open('payment', info)
}

function claimDailyReward() {
	$('#dailyReward_btn').addClass('loading')

	socket.emit('user.claimReward', function(err, data) {
		if (err) {
			tAlert('error', err, 'Daily Reward')
			$('#dailyReward_btn').removeClass('loading')
			return
		}

		if (data) {
			tAlert('success', data, 'Daily Reward')
			if (route.getPage() !== 'games') return
			updateUserBalance()
		}
		$('#dailyReward_btn').removeClass('loading')
	})
}

/* Modules */

var auth = (function() {
	init()

	function init(callback) {
		socket.emit('user.get', function(err, data) {
			if (err) tAlert('error', err, 'Authentication')
			if (data) {
				user = {
					id: data.id,
					name: data.username,
					balance: data.credits,
					avatar: data.avatarURL,
					bans: {
						site: {
							banned: data.banned,
							expiration: data.timeBanned
						},
						chat: {
							banned: data.muted,
							expiration: data.timeMuted
						}
					},
					steam: null,
					emailConfirmed: data.confirmed,
					admin: data.admin,
					settings: {
						games: data.defaultGame
					},
					affiliateCode: data.affiliate.code
				}

				if (data.hasOwnProperty('steam')) {
					user.steam = data.steam
				}

				var info = {
					name: user.name,
					balance: user.balance.toLocaleString(),
					auth: user.auth,
					avatar: user.avatar
				}

				$.Mustache.load('/assets/components/components.html', function() {
					$('.sidebar-nav .profile-info').mustache('user-navbar', info, {
						method: 'html'
					})
					$('.mobile-menu .profile-info').mustache('mobile-navbar', info, {
						method: 'html'
					})
				})

				$('.sidebar-nav .login').slideUp()
				$('.sidebar-nav .menu-item.account').slideDown()
				$('.sidebar-nav .menu-item.funds').slideDown()
				$('.sidebar-nav .profile-info').slideDown(function() {
					updateLayout()
				})

				// mobile
				$('.mobile-menu .menu .menu-item.login').hide()
				$('.mobile-menu .menu .menu-item.account').show()
				$('.mobile-menu .menu .menu-item.funds').show()

				if (data.banned) {
					showModal('banned')
				}

				sidebar.init()
			}

			if (callback && typeof(callback) === 'function') {
				callback(data)
			}
		})
	}

	function logout() {
		$.ajax({
			type: 'GET',
			url: 'https://hyperdraft.com/auth/logout',
			success: function() {
				window.location.reload()
			}
		})
	}

	return {
		logout: logout,
		init: init
	}
})()

var modal = (function() {
	var modalOpen = false
	init()

	function init() {
		if ($('body').children('.action-modal').length > 0) {
			modalOpen = true
			return
		} else {
			$.Mustache.load('/assets/components/components.html')
			$.Mustache.load('/assets/components/modals.html')
		}
	}

	function open(type, addData) {
		if (modalOpen) return

		$('body').mustache('action-modal')

		switch (type) {
			case 'auth':
				$('.action-modal .modal .inner').mustache('auth', {
					method: 'html'
				})
				$('.action-modal .modal .inner .tabs.menu .item').tab({
					'onVisible': function(tabPath) {
						switch (tabPath) {
							case 'login':
								$('.action-modal .modal .inner .actions button.confirm').attr('onclick', 'auth.login()').text('Log in')
								break

							case 'signup':
								$('.action-modal .modal .inner .actions button.confirm').attr('onclick', 'auth.signup()').text('Sign up')
								break

							case 'password':
								$('.action-modal .modal .inner .actions button.confirm').attr('onclick', 'passwordReset()').text('Reset')
								break

							default:
								return
						}
					}
				})
				bind(type)
				break

			case 'bet-submit':
				var info = {
					matchid: addData.bet.matchid,
					teams: [{
							id: addData.bet.teams[0].id,
							logo: addData.bet.teams[0].logo,
							name: addData.bet.teams[0].name,
							odds: addData.bet.teams[0].odds
						},
						{
							id: addData.bet.teams[1].id,
							logo: addData.bet.teams[1].logo,
							name: addData.bet.teams[1].name,
							odds: addData.bet.teams[1].odds
						}
					]
				}
				$('.action-modal .modal .inner').mustache('bet-submit', info, {
					method: 'html'
				})
				bind(type)
				break

			case 'banned':
				$('.action-modal .modal .inner').mustache('banned', {
					method: 'html'
				})
				bind(type)
				break

			case 'profile':
				socket.emit('profile.info', addData.profile.userID, function(err, data) {
					var info = {
						name: data.name,
						etc: 'etc'
					}
					$('.action-modal .modal .inner').mustache('profile', info, {
						method: 'html'
					})
				})
				bind(type)
				break

			case 'payment':
				var info = {
					amount: addData.payment.amount,
					amountHC: addData.payment.amount * 100
				}
				$('.action-modal .modal .inner').mustache('payment', info, {
					method: 'html'
				})
				bind(type)
				break

			case 'jackpot-enter':
				$('.action-modal .modal').addClass('large')
				$('.action-modal .modal .inner').mustache('jackpot-enter', info, {
					method: 'html'
				})
				bind(type)
				break

				//! -- Coinflip
			case 'coinflip-create':
				$('.action-modal .modal .inner').mustache('coinflip-create', {
					method: 'html'
				})
				bind(type)
				break

			case 'coinflip-join':
				socket.emit('coinflip.get', addData.coinflip.id, function(err, data) {
					if (err) {
						tAlert('error', err, 'Coinflip - Join')
						return
					}

					const sides = ['ct', 't']
					const rSides = ['t', 'ct']

					var templateData = {
						id: data.id,
						hash: data.hash,
						userid: data.userData[0].id,
						name: data.userData[0].username,
						side: sides[data.team],
						amount: data.wager.toLocaleString(),
						leftover_side: rSides[data.team]
					}

					$('.action-modal .modal .inner').mustache('coinflip-join', templateData, {
						method: 'html'
					})
					bind(type)
				})
				break

			case 'coinflip-watch':
				socket.emit('coinflip.get', addData.coinflip.id, function(err, data) {
					if (err) {
						tAlert('error', err, 'Coinflip - Watch')
						return
					}

					if (data.userData.length < 2) {
						tAlert('error', 'This game is not finshed', 'Coinflip - Watch')
						return
					}

					var sides = ['ct', 't']

					var templateData = {
						id: data.id,
						hash: data.hash,
						users: [{
								id: data.userData[0].id,
								name: data.userData[0].username,
								side: function() {
									if (data.userData[0].id == data.creator) {
										return sides[data.team]
									} else {
										var rSides = [sides[1], sides[0]]
										return rSides[data.team]
									}
								}
							},
							{
								id: data.userData[1].id,
								name: data.userData[1].username,
								side: function() {
									if (data.userData[1].id == data.creator) {
										return sides[data.team]
									} else {
										var rSides = [sides[1], sides[0]]
										return rSides[data.team]
									}
								}
							}
						],
						amount: parseInt(data.wager * 2).toLocaleString(),
						timestamp: function() {
							var $el = $('.inner-content.games .inner.coinflip .games-container table').find('.listing[data-id="' + data.id + '"]')
							return $el.attr('data-timestamp-end')
						},
						winner: data.winner,
						winningSide: function() {
							if (data.creator == data.winner) {
								return sides[data.team]
							} else {
								var rSides = [sides[1], sides[0]]
								return rSides[data.team]
							}
						}
					}

					$('.action-modal .modal .inner').mustache('coinflip-watch', templateData, {
						method: 'html'
					})
					bind(type)
				})
				break

				//! -- misc

			case 'credit-transfer':
				var info = {
					target: addData.credit_transfer.target,
					amount: addData.credit_transfer.amount
				}
				$('.action-modal .modal .inner').mustache('credit-transfer', info, {
					method: 'html'
				})
				bind(type)
				break

			case 'news':
				var info = {
					title: addData.news.title,
					content: addData.news.content
				}
				$('.action-modal .modal .inner').mustache('news', info, {
					method: 'html'
				})
				bind(type)
				break

			case 'support':
				$('.action-modal .modal .inner').mustache('support', {
					method: 'html'
				})
				bind(type)
				break

				// help
			case 'help-jackpot':
				$('.action-modal .modal .inner').mustache('help-jackpot', {
					method: 'html'
				})
				bind(type)
				break
			case 'help-coinflip':
				$('.action-modal .modal .inner').mustache('help-coinflip', {
					method: 'html'
				})
				bind(type)
				break
			case 'help-roulette':
				$('.action-modal .modal .inner').mustache('help-roulette', {
					method: 'html'
				})
				bind(type)
				break
			case 'help-chat':
				$('.action-modal .modal .inner').mustache('help-chat', {
					method: 'html'
				})
				bind(type)
				break
			case 'help-betting':
				$('.action-modal .modal .inner').mustache('help-betting', {
					method: 'html'
				})
				bind(type)
				break
			case 'provably-fair':
				$('.action-modal .modal .inner').mustache('provably-fair', {
					method: 'html'
				})
				bind(type)
				break

			default:
				return
		}
		$('.action-modal').show().toggleClass('open')
		var loadCheck = setInterval(function() {
			if ($('.action-modal .modal .inner').css('display') === 'block') {
				clearInterval(loadCheck)
				if (type == 'jackpot-enter') return
				setTimeout(function() {
					$('.action-modal .modal .loading-div').fadeOut()
				}, 500)
			}
		}, 50)
		modalOpen = true
	}

	function bind(type) {
		var $el = $('.action-modal .modal')
		var $confirmButton = $el.find('.actions .button.confirm')
		var $cancelButton = $el.find('.actions .button.cancel')

		$cancelButton.click(close)

		switch (type) {
			case 'payment':
				$('.payment-gateways .gateway').click(function() {
					var gateway = $(this).attr('data-gateway')
					var amount = $(this).parent().attr('data-amount')

					$('.action-modal .modal .loading-div').fadeIn()

					if (gateway == 'bitcoin') {
						socket.emit('blockchain.getUSDValue', amount, function(err, data) {
							if (err) tAlert('error', err, 'Bitcoin Conversion')
							var amountConverted = data

							socket.emit('blockchain.newAddress', amountConverted, function(err, data) {
								if (err) {
									tAlert('error', err, 'Bitcoin Payment')
									$('.action-modal .modal .loading-div').fadeOut()
									return
								}

								var address = data

								$('.action-modal .modal .content .qr-code').qrcode({
									render: 'image',
									minVersion: 1,
									maxVersion: 40,
									ecLevel: 'H',
									size: 500,
									fill: '#000',
									background: 'white',
									text: address,
									radius: 0,
									quiet: 1,
									mode: 2,
									mSize: 0.1,
									mPosX: 0.5,
									mPosY: 0.5,
									label: amountConverted,
									fontname: 'Montserrat',
									fontcolor: '#000'
								})

								$('.action-modal .modal .content .desc').html('Please pay the <b>exact</b> amount of <br><span class="code">' + amountConverted + '</span> bitcoins to <br><span class="address">' + address + '</span><br> <p class="qr">You can also scan the QR code below with your favourite bitcoin mobile app.</p>')
								$('.action-modal .modal .footer .actions .button.cancel').text('Cancel')
								$('.action-modal .modal .content .warning').fadeIn()
								$('.action-modal .modal .content .payment-gateways').slideUp()
								$('.action-modal .modal .loading-div').fadeOut()

								socket.on('blockchain.update', function(data) {
									$('.action-modal .modal .loading-div').fadeIn()
									if (data.address === address) {
										$('.action-modal .modal .content .desc').html('Your payment has been received. Your transaction is being confirmed 3 times before we credit your account to avoid any issues.<br/> We will notify you once the confirmations have been completed, you may also check on them in your Pending Transactions on the My Account page.<br/>Thank you for your payment.')
										$('.action-modal .modal .content .warning').html('Confirmations usually take around 20-30 minutes depending on the time of day, but please do allow up to 24 hours.')
										$('.action-modal .modal .footer .actions .button.cancel').removeClass('cancel').addClass('confirm').text('Close')
										$('.action-modal .modal .content .qr-code').slideUp()
									} else {
										tAlert('error', 'Please contact support.', 'Bitcoin Transaction')
									}
									$('.action-modal .modal .loading-div').fadeOut()
								})
							})
						})
					}
				})
				break

				//! -- Bets
			case 'bet-submit':
				$('.action-modal .content .teams .team').click(function() {
					if ($(this).hasClass('selected')) return
					else {
						$('.action-modal .content .teams .team').removeClass('selected')
						$(this).addClass('selected')

						var value = parseInt($('.action-modal .currency-select').val())
						if (value.length < 1) return
						if (!isInt(value)) return
						var multiplier = parseFloat($('.action-modal .content .teams .selected.team .odds').text().replace('x', ''))
						var er = value * multiplier
						$('.action-modal .estimated-return .tilde').text('~' + parseInt(er))
					}
				})

				$('.currency-select').blur(function() {
					$(this).val(function(i, oldval) {
						if (oldval.length < 1) return
						return parseInt(oldval)
					})
				})

				$('.currency-select').on('input', function() {
					var value = parseInt($(this).val())

					if (value.length < 1) return
					if (!isInt(value)) return

					var multiplier = parseFloat($('.action-modal .content .teams .selected.team .odds').text().replace('x', ''))
					if (!multiplier) return
					var er = value * multiplier

					$('.action-modal .estimated-return .tilde').text('~' + parseInt(er))
				})

				$confirmButton.click(function() {
					var teamid = $('.action-modal .content .teams .team.selected').attr('data-id')
					var matchid = $('.action-modal .content').attr('data-match-id')
					var amount = parseInt($('.action-modal .content .currency-select').val())

					if (!teamid) {
						tAlert('error', 'Please select a team to bet on.', 'Betting')
						return
					}
					if (!matchid) {
						tAlert('error', 'You are not on a match page.', 'Betting')
						return
					}
					if (!isInt(amount)) {
						tAlert('error', 'Please enter a valid amount of HyperCredits.', 'Betting')
						return
					}
					if (amount < 25) {
						tAlert('error', 'Please bet more than 25 HyperCredits', 'Betting')
						return
					}
					socket.emit('matches.createBet', matchid, teamid, amount, function(err, data) {
						if (err) {
							tAlert('error', err, 'Betting')
							return
						}

						if (data.amount === amount) {
							tAlert('success', 'You have successfully placed your bet.', 'Betting')
							modal.close()
						}
					})
				})
				break

			case 'news':
				$confirmButton.click(close)
				break

				//! -- Steam
			case 'jackpot-enter':

				var cart = []

				socket.emit('market.userInventory', function(err, data) {
					$('.action-modal .modal .loading-div').fadeOut()
					if (!data) {
						// no items
						tAlert('error', 'No items matching our criterea were found.', 'Steam Inventory')
						return
					}

					data = _.sortBy(data, function(item) {
						return parseFloat(item.price)
					}).reverse()

					$.each(data, function(i, item) {
						var skin = /(★ )?(StatTrak™ )?(.+) \| (.+) \((.+)\)/.exec(item.id)
						var skin_name

						if (!$.isBlank(/\((.+)\)/.exec(item.id))) {
							skin_name = item.id.replace(/\((.+)\)/.exec(item.id)[0], '')
						} else {
							skin_name = item.id
						}

						// if (skin_name.indexOf('Case') !== -1 && skin_name.indexOf('Key') === -1) return
						// if (skin_name.indexOf('Tool') !== -1) return
						// if (skin_name.indexOf('Sticker') !== -1) return
						// if (skin_name.indexOf('Souvenir') !== -1) return
						// if (skin_name.indexOf('Kit') !== -1) return
						// if (skin_name.indexOf('Pin') !== -1) return
						// if (skin_name.indexOf('Graffiti') !== -1) return

						var templateData = {
							assetid: item.assetid,
							price: item.price,
							icon: item.icon_url,
							name: skin_name,
							stattrak: function() {
								if (skin) {
									return skin[2]
								}
							},
							condition: function() {
								if (skin) {
									return skin[5]
								}
							},
							color: item.quality_color
						}

						$('.action-modal .modal .content .inventory').mustache('modal-deposit-item', templateData, {
							method: 'append'
						})
					})

					$el.find('.inventory .item').click(function() {
						var id = $(this).attr('data-id')
						if ($.inArray(id, cart) !== -1) {
							$(this).removeClass('selected')
							cart.splice($.inArray(id, cart), 1)
						} else {
							cart.push(id)
							$(this).addClass('selected')
						}

						$el.find('.stats .item-count').text(cart.length)

						var totalVal = 0
						$.each($el.find('.inventory .item.selected'), function(i, item) {
							totalVal += parseFloat($(item).attr('data-price'))
						})

						$el.find('.stats .items-value').text(totalVal.toFixed(2).toLocaleString())
						$el.find('.stats .items-value-hc').text(parseInt(totalVal * 100).toLocaleString())
					})
				})

				$el.find('.sort input').on('input', function() {
					var searchTerm = $(this).val().toLowerCase()

					$.each($el.find('.inventory .item'), function(i, item) {
						if ($(item).find('.meta .inner').text().toLowerCase().indexOf(searchTerm) !== -1) {
							$(item).show()
						} else {
							$(item).hide()
						}
					})
				})

				$confirmButton.click(function() {
					if (cart.length < 1) {
						tAlert('error', 'No items selected.', 'Jackpot - Enter')
						return
					}

					socket.emit('jackpot.joinQueue', cart, function(err, data) {
						console.log(err, data)
						if (err) {
							tAlert('error', err, 'Jackpot - Enter')
						}
						if (data) {
							tAlert('success', 'Your trade request has been received, you will receive a trade offer soon.', 'Jackpot - Enter')
							close()
						}
					})
				})

				break

				//! -- Coinflip
			case 'coinflip-create':
				$('.action-modal .content .sides .side').click(function() {
					if ($(this).hasClass('selected')) return
					else {
						$('.action-modal .content .sides .side').removeClass('selected')
						$(this).addClass('selected')
					}
				})

				$('.currency-select').blur(function() {
					$(this).val(function(i, oldval) {
						if (oldval.length < 1) return
						return parseInt(oldval)
					})
				})

				$confirmButton.click(function() {
					var selected = $('.action-modal .content .sides .side.selected').attr('data-side')
					var amount = parseInt($('.action-modal .content .currency-select').val())

					if (!selected) {
						tAlert('error', 'Please select a side to bet on.', 'Coinflip')
						return
					}
					if (!isInt(amount)) {
						tAlert('error', 'Please enter a valid amount of HyperCredits.', 'Coinflip')
						return
					}
					if (amount < 10) {
						tAlert('error', 'Please enter more than 10 HyperCredits', 'Coinflip')
						return
					}

					socket.emit('coinflip.create', amount, parseInt(selected), function(err, data) {
						if (err) {
							tAlert('error', err, 'Coinflip')
							return
						}
						if (data) {
							updateUserBalance()
							tAlert('success', 'Your game has been created.', 'Coinflip')
							close()
						}
					})
				})
				break

			case 'coinflip-join':
				$confirmButton.click(function() {
					var id = $el.find('.content').attr('data-id')

					socket.emit('coinflip.join', id, function(err, data) {
						if (err) {
							tAlert('error', err, 'Coinflip - Join')
							return
						}

						if (data) {
							modal.close(function() {
								setTimeout(function() {
									var info = {
										coinflip: {
											id: id
										}
									}
									open('coinflip-watch', info)
								}, 500)
							})
						}
					})
				})
				break

			case 'coinflip-watch':
				var $el = $('.action-modal .modal .content')
				var timerVal = 9
				var sides = ['ct', 't']

				$('.acc-balance').hide()

				var timestamp = parseInt($el.attr('data-timestamp'))
				var winner = $el.attr('data-winner-id')
				var winningSide = $el.attr('data-winning-side')

				timerVal -= parseInt((Date.now() - timestamp) / 1000)

				var timer = setInterval(function() {
					if (timerVal < 1 || !timerVal) {
						clearInterval(timer)
						$el.find('.animation-container .counter').slideUp()

						var $coinCtn = $el.find('.animation-container .coin-container')
						$coinCtn.children('.coin').addClass(winningSide)
						$el.find('.animation-container .coin-container').fadeIn()

						setTimeout(function() {
							$el.find('.sides .side.' + winningSide).addClass('winner')
						}, 3000)
						return
					}
					$el.find('.animation-container .counter .value').text(timerVal)
					timerVal--
				}, 1000)

				$cancelButton.click(function() {
					clearInterval(timer)
					$('.acc-balance').show()
				})
				break

			case 'credit-transfer':
				var timerVal = 3
				var timer = setInterval(function() {
					if (timerVal < 0) {
						clearInterval(timer)
						$confirmButton.removeAttr('disabled').text('Send').click(function() {
							var target = $el.find('.content').attr('data-target')
							var amount = parseInt($el.find('.content').attr('data-amount'))

							socket.emit('user.credits.transfer', target, amount, function(err, data) {
								if (err) {
									tAlert('error', err, 'Credit Transfer')
									return
								}

								if (data) {
									tAlert('success', data, 'Credit Transfer')
									close()
								}
							})
						})
						return
					}
					$confirmButton.text(timerVal)
					timerVal--
				}, 1000)
				break

				//! -- Support
			case 'support':
				$el.find('.ticket').click(function() {
					$el.find('.content').slideUp(function() {
						$(this).find('.grid').remove()
						$(this).find('span.center.aligned').html('Please copy the following code before opening a ticket:')

						if (user.id) {
							$(this).find('span.center.aligned').append('<div class="code"><pre>' + JSON.stringify(user, null, 2) + '</pre></div>')
						} else {
							$(this).find('span.center.aligned').append('<div class="code">You are not logged in.</div>')
						}

						$(this).slideDown()

						$cancelButton.off().removeClass('cancel').addClass('confirm').text('Next Step').click(function() {
							zE.activate({
								hideOnClose: true
							})
							close()
						})
					})
				})

				$el.find('.faq').click(function() {
					var win = window.open('https://hyperdraft.zendesk.com/hc/en-us', '_blank')
					win.focus()
					close()
				})
				break

			default:
				return
		}
	}

	function close(callback) {
		if (!modalOpen) return

		$('.action-modal').toggleClass('open').on('transitionend webkitTransitionEnd oTransitionEnd', function() {
			setTimeout(function() {
				$('.action-modal').remove()
				modalOpen = false
				if (callback && typeof(callback) === 'function') {
					callback()
				}
			}, 350) // waiting for the background to fade *completely*
		})
	}

	return {
		open: open,
		close: close,
		getState: function() {
			return modalOpen
		}
	}
})()

var chat = (function() {
	var pmMode = false
	var emotes = []

	init()

	function init() {
		loadEmotes(function() {
			bind('start')
			history()
		})

		$.Mustache.load('/assets/components/components.html')

		socket.on('chat.update', function(data) {
			receive(data)
		})

		socket.on('chat.delete', function(data) {
			remove(data.id)
		})

		socket.on('chat.clear', function(data) {
			clear()
		})
	}

	function loadEmotes(callback) {
		$.ajax({
			type: 'GET',
			url: 'https://twitchemotes.com/api_cache/v2/global.json',
			dataType: 'json',
			success: function(json) {
				$.each(json.emotes, function(i, item) {
					emotes.push({
						name: i,
						id: item.image_id
					})
				})
			}
		}).done(function() {
			if (callback && typeof(callback) === 'function') {
				callback()
			}
		})
	}

	function bind(type) {
		if (type == 'start') {
			$('#chatInput').keypress(function(e) {
				if (e.which == 13) {
					send($('#chatInput').val())
				}
			})

			$('.chat-input i.question.icon').click(function() {
				modal.open('help-chat')
			})

			$(document).off().bind('mouseup', function(e) {
				$('#chatContextMenu').hide(100)
			})

			$('.sidebar-nav .chat-toggle').click(function() {
				if ($(this).hasClass('open')) {
					$(this).removeClass('open')
					$('.sidebar-nav .chat').finish().slideUp()
				} else {
					$(this).addClass('open')
					$('.sidebar-nav .chat').finish().slideDown()
				}
			})

			$('.sidebar-nav .chat-pm-toggle').click(function() {
				if (pmMode) {
					$(this).removeClass('on')
					pmMode = false
				} else {
					$(this).addClass('on')
					pmMode = true
				}
			})

			$('.chat-messages').mouseleave(function() {
				var msgCount = $('.chat-messages .messages').children().length
				var messages = $('.chat-messages .messages').children().get().reverse()

				if (msgCount < 1) return

				$.each(messages, function(i, item) {
					if (i < msgCount && i > 50) {
						$(item).remove()
					}
				})
				$('.sidebar-nav .chat-messages .messages').scrollTo($('.chat-messages .messages').children().last())
			})
		} else if (type === 'message') {
			$('.chat-messages .messages').find('.chat-message').off().contextmenu(function(e) {
				e.preventDefault()

				var userid = $(e.currentTarget).find('.data .name').attr('data-id')
				var steamid = $(e.currentTarget).find('.data .name').attr('data-steamid')
				var username = $(e.currentTarget).find('.data .name').text()
				var avatar = $(e.currentTarget).find('.pp').attr('src')
				var msgID = $(e.currentTarget).data('id')

				if (steamid === null || steamid === '') return

				$('#chatContextMenu').find('.info').html('<img src="' + avatar + '"/> ' + username)

				if (user.admin > 0 && $('#chatContextMenu').children('[data-action]').length < 4) {
					$('#chatContextMenu').append('<li class="admin" data-action="removemsg"><i class="comment icon"></i> Remove Message</li>')
					$('#chatContextMenu').append('<li class="admin" data-action="timeout"><i class="comment icon"></i> Timeout</li>')
					$('#chatContextMenu').append('<li class="admin" data-action="mute"><i class="mute icon"></i> Mute/Unmute</li>')
					if (user.admin > 1) {
						$('#chatContextMenu').append('<li class="admin" data-action="ban"><i class="ban icon"></i> Ban/Unban</li>')
					}
				}

				$('#chatContextMenu').finish().css({
					top: e.pageY + 'px',
					left: (e.pageX + 20) + 'px'
				}).toggle(0, function() {
					if (!isElementInViewport($(this))) {
						$(this).css('top', parseInt($(this).css('top')) - $(this).height())
					}
				})

				$('#chatContextMenu li').off().click(function() {
					switch ($(this).attr('data-action')) {
						case 'pm':
							$('#chatInput').val('/pm ' + username + ' ').focus();
							break
						case 'transfer':
							$('#chatInput').val('/send ' + steamid + ' ').focus();
							break
						case 'mention':
							$('#chatInput').val('@' + username + ', ').focus();
							break
						case 'removemsg':
							socket.emit('chat.deleteMessage', msgID, (err) => {
								if (err) tAlert('error', err, 'Chat')
							});
							break
						case 'timeout':
							socket.emit('chat.message', '/timeout ' + steamid, (err) => {
								if (err) tAlert('error', err, 'Chat')
							});
							break
						case 'mute':
							socket.emit('chat.message', '/mute ' + steamid, (err) => {
								if (err) tAlert('error', err, 'Chat')
							});
							break
						case 'ban':
							socket.emit('chat.message', '/ban ' + steamid, (err) => {
								if (err) tAlert('error', err, 'Chat')
							});
							break
					}
					$('#chatContextMenu').hide(100)
				})
			})

			$('.chat-messages .messages').find('.chat-message .name').off().click((e) => userprofiles.show(e))
		}
	}

	function history() {
		socket.emit('chat.getHistory', function(err, data) {
			data = data.reverse()
			for (var i = 0; i < data.length; i++) {
				receive(data[i])
			}
		})
	}

	function send(message) {
		if (message.length === 0 || !message.replace(/\s/g, '').length) {
			return
		} else {
			if (message.indexOf('/send') == 0) {
				var command = message.split(' ')
				if (command.length != 3) {
					tAlert('error', 'Invalid send attributes. Usage: /send steamid amount <br> Ex.: /send 76561198107884582 50', 'Send HyperCredits')
					return
				}
				if (!isInt(parseInt(command[2]))) {
					tAlert('error', 'Please enter a valid amount of HyperCredits.', 'Send HyperCredits')
					return
				}

				var info = {
					credit_transfer: {
						target: command[1],
						amount: parseInt(command[2])
					}
				}

				modal.open('credit-transfer', info)

				$('#chatInput').val('')
				return
			}
			// send chat
			socket.emit('chat.message', message, function(err, data) {
				if (err) {
					tAlert('error', err, 'Chat')
					$('#chatInput').val('')
					return
				}
				if (data.user.username === 'SYSTEM' && data.user.admin === 9001) {
					receive(data)
				}
				$('#chatInput').val('')
			})
		}
	}

	function replaceEmote(msg) {
		$.each(emotes, function(i, item) {
			var regex = new RegExp(item.name, 'g')
			msg = msg.replace(regex, '<img src="https://static-cdn.jtvnw.net/emoticons/v1/' + item.id + '/1.0" title="' + item.name + '">')
		})
		return msg
	}

	function receive(data) {
		var oddeven
		if ($('.chat-messages .messages').children().length > 0) {
			if ($('.chat-messages .messages').children().last().attr('class').indexOf('odd') != -1) {
				oddeven = 'even'
			} else {
				oddeven = 'odd'
			}
		} else {
			oddeven = 'even'
		}

		var personalMessage = data.hidden

		if (user.id) {
			if (data.message.indexOf('@' + user.name) != -1) {
				personalMessage = true
			}
		}

		var info = {
			oddeven: oddeven,
			id: data.id,
			personal: personalMessage,
			rank: data.user.admin,
			userid: data.user.id,
			steamid: function() {
				if (data.user.steam) {
					return data.user.steam.steamid
				}
			},
			name: data.user.username,
			message: replaceEmote(data.message),
			avatar: data.user.avatarURL,
			timestamp: moment(data.time).format('HH:mm')
		}

		if (personalMessage && data.userID != user.id) {
			if (data.hidden) {
				tNotify('Private Message', 'You have received a new private message in chat!')
			} else {
				tNotify('Chat Mention', 'You have been mentioned in chat.')
			}

			if (!localSettings.noSounds) {
				$.playSound('/assets/sounds/chat-mention')
			}
		}

		if (!personalMessage && pmMode && data.userID != user.id && !data.announce) return

		if (data.announce) {
			$('.sidebar-nav .chat-messages .messages').mustache('chat-alert', info, {
				method: 'append'
			})
		} else {
			$('.sidebar-nav .chat-messages .messages').mustache('chat-message', info, {
				method: 'append'
			})
		}

		if (!$('.sidebar-nav .chat-messages').is(':hover') || data.userID == user.id) {
			$('.sidebar-nav .chat-messages .messages').scrollTo($('.chat-messages .messages').children().last())
			if ($('.sidebar-nav .chat-messages .messages').children().length > 50) {
				$('.chat-messages .messages').children().first().remove()
			}
		}

		bind('message')
	}

	// add hide toggle

	function remove(id) {
		if (!id) return
		$('.sidebar-nav .chat-messages .messages').find('[data-id="' + id + '"]').remove()
	}

	function clear() {
		$('.sidebar-nav .chat-messages .messages .chat-message').each(function(i, item) {
			if ($(item).hasClass('personal')) return
			$(item).remove()
		})
	}
})()

var route = (function() {
	var currentPage = null

	function change(page, id, callback) {
		if (page == currentPage) return
		if (currentPage == 'games') {
			roulette.reset()
		}

		$('.page-content').fadeOut(function() {
			$('.page-content').empty()
			$('.sidebar-nav .menu .inner').children('.menu-item').removeClass('active')
			switch (page) {

				case 'about':
					$('.page-content').load('pages/home.html')
					currentPage = 'about'
					window.location.hash = '#/about'
					break

				case 'games': // up
					$('.page-content').load('pages/games.html')
					currentPage = 'games'
					window.location.hash = ''
					$('.sidebar-nav .menu .inner .games').addClass('active')
					break

				case 'stats':
					$('.page-content').load('pages/stats.html')
					currentPage = 'stats'
					window.location.hash = '#/stats'
					$('.sidebar-nav .menu .inner .stats').addClass('active')
					break

				case 'account': // up
					currentPage = 'account'

					if (!user.id) {
						auth.init(function(data) {
							if (!data) {
								tAlert('error', 'Please login to access this page.', 'Account Page')
								route.change('games')
								return
							} else {
								$('.page-content').load('pages/account.html', function() {
									bind()
								})
								window.location.hash = '#/account'
								$('.sidebar-nav .menu .inner .account').addClass('active')
							}
						})
					} else {
						$('.page-content').load('pages/account.html', function() {
							bind()
						})
						window.location.hash = '#/account'
						$('.sidebar-nav .menu .inner .account').addClass('active')
					}
					break

				case 'matches': // up
					$('.page-content').load('pages/betting.html')
					currentPage = 'matches'
					window.location.hash = '#/matches'
					$('.sidebar-nav .menu .inner .betting').addClass('active')
					break



				case 'shop': // up
					$('.page-content').load('pages/market.html')
					currentPage = 'shop'
					window.location.hash = '#/shop'
					$('.sidebar-nav .menu .inner .shop').addClass('active')
					break

				case 'match': // up
					$('.page-content').load('pages/match.html')
					currentPage = 'match'
					window.location.hash = '#/match/' + id
					$('.sidebar-nav .menu .inner .betting').addClass('active')
					match.load(id)
					break

				case 'admin':
					currentPage = 'admin'
					if (!user.id || !user.admin < 2) {
						auth.init(function(data) {
							if (!data || data.admin < 2) {
								change('games')
								return
							} else {
								$('.page-content').load('pages/admin.html')
								window.location.hash = '#/admin'
							}
						})
					} else {
						$('.page-content').load('pages/admin.html')
						window.location.hash = '#/admin'
					}

					break

				default:
					return
			}
			$('.page-content').fadeIn(function() {
				updateLayout()
				if (page != 'account') bind()
				updateUserBalance()

				if (callback && typeof(callback) === 'function') {
					callback()
				}
			})
		})
	}

	function bind() {
		if (currentPage == 'account') account.init()
		else if (currentPage == 'admin') admin.init()
		else if (currentPage == 'stats') stats.init()
	}

	function set(page) {
		currentPage = page
	}

	return {
		change: change,
		getPage: function() {
			return currentPage
		},
		setPage: set
	}
})()

var news = (function() {
	var currentNews,
		currentNewsObject

	function init() {
		if (!localStorage.getItem('currentNews')) {
			localStorage.setItem('currentNews', 0)
		}

		$.ajax({
			type: 'GET',
			url: '/assets/components/news.json',
			dataType: 'json',
			success: function(json) {
				currentNews = json.length
				currentNewsObject = json[currentNews - 1]
				if (currentNews > parseInt(localStorage.getItem('currentNews'))) {
					show()
					localStorage.setItem('currentNews', currentNews)
				}
			}
		})
	}

	function show() { // add support for id
		var data = {
			news: {
				title: currentNewsObject.title,
				content: currentNewsObject.content
			}
		}
		modal.open('news', data)
	}

	return {
		init: init,
		current: function() {
			return currentNews
		}
	}
})()

var shop = (function() {
	var // item types
		itemtypePistol = [
			'CZ75-Auto',
			'Desert Eagle',
			'Dual Berettas',
			'Five-SeveN',
			'Glock-18',
			'P2000',
			'P250',
			'R8 Revolver',
			'Tec-9',
			'USP-S'
		],
		itemtypeRifle = [
			'AK-47',
			'AUG',
			'AWP',
			'FAMAS',
			'G3SG1',
			'Galil AR',
			'M4A1-S',
			'M4A4',
			'SSG 08',
			'SCAR-20',
			'SG 553'
		],
		itemtypeSMG = [
			'MAC-10',
			'MP7',
			'MP9',
			'PP-Bizon',
			'P90',
			'UMP-45'
		],
		itemtypeHeavy = [
			'MAG-7',
			'Nova',
			'Sawed-Off',
			'XM1014',
			'M249',
			'Negev'
		],
		itemtypeKnife = [
			'★ Bayonet',
			'★ Bowie Knife',
			'★ Butterfly Knife',
			'★ Falchion Knife',
			'★ Flip Knife',
			'★ Gut Knife',
			'★ Huntsman Knife',
			'★ Karambit',
			'★ M9 Bayonet',
			'★ Shadow Daggers'
		]
	var cart = []
	var iteration = 0

	var items = []

	function load() {
		socket.emit('market.inventory', function(err, data) {
			if (err) {
				tAlert('error', err, 'Shop')
				return
			}

			// clear/reset
			$('.inner-content.market .section-content .inner-container').empty()
			cart = []
			items = []
			iteration = 0
			$elcart = $('.inner-content.market .cart')
			$elcart.find('.item-count').text('0')
			$elcart.find('.item-value').text('0')
			$elcart.find('.acc-balance').text('0')
			$elcart.removeClass('open')

			// sort data by price, desc
			data = _.sortBy(data, 'price').reverse()

			$elSort = $('.inner-content.market .section-sort')

			$.each(data, function(i, item) {
				var skin = /(★ )?(StatTrak™ )?(.+) \| (.+) \((.+)\)/.exec(item.name)
				var skin_name

				if (!$.isBlank(/\((.+)\)/.exec(item.name))) {
					skin_name = item.name.replace(/\((.+)\)/.exec(item.name)[0], '').replace('StatTrak™ ', '')
				} else {
					skin_name = item.name
				}

				var templateData = {
					id: item.id,
					assetid: item.assetid,
					icon_url: item.icon_url,
					item_info: {
						name: skin_name,

						// Filter
						type: null,
						stattrak: function() {
							if (skin) {
								return skin[2]
							}
						},
						condition: function() {
							if (skin) {
								return skin[5]
							}
						}
					},
					color: item.quality_color,
					colorRGB: hexToRgb(item.quality_color),
					price: item.price,
					priceLocale: item.price.toLocaleString()
				}

				var itemT = skin_name.split(' | ')[0]
				if ($.inArray(itemT, itemtypePistol) != -1) {
					templateData.item_info.type = 'pistol'
				}
				if ($.inArray(itemT, itemtypeRifle) != -1) {
					templateData.item_info.type = 'rifle'
				}
				if ($.inArray(itemT, itemtypeSMG) != -1) {
					templateData.item_info.type = 'smg'
				}
				if ($.inArray(itemT, itemtypeHeavy) != -1) {
					templateData.item_info.type = 'heavy'
				}
				if ($.inArray(itemT, itemtypeKnife) != -1) {
					templateData.item_info.type = 'knife'
				}

				// skin[0] is full match
				// skin[1] for knife
				// skin[2] for stattrack
				// skin[3] for weapon name
				// skin[4] for skin name
				// skin[5] for condition

				// Filters bois
				var filter = {
					type: $elSort.find('.sort-type span.text').text().toLowerCase(),
					condition: $elSort.find('.sort-condition span.text').text().toLowerCase(),
					min: parseInt($elSort.find('.sort-min input').val()),
					max: parseInt($elSort.find('.sort-max input').val()),
					search: $elSort.find('.sort-search input').val().toLowerCase()
				}

				if (filter.type != 'type' && filter.type != 'all') {
					if (!templateData.item_info.type) return
					if (templateData.item_info.type.toLowerCase().indexOf(filter.type) == -1) return
				}

				if (filter.condition != 'condition' && filter.condition != 'all') {
					if (!templateData.item_info.condition()) return
					if (templateData.item_info.condition().toLowerCase().indexOf(filter.condition) == -1) return
				}

				if (isInt(filter.min)) {
					if (parseInt(templateData.price) < filter.min) return
				}

				if (isInt(filter.max)) {
					if (parseInt(templateData.price) > filter.max) return
				}

				if (filter.search) {
					if (templateData.item_info.name.toLowerCase().indexOf(filter.search) == -1) return
				}

				items.push(templateData)
			})

			_.some(items, function(value) {
				iteration++
				if (iteration > 50) return true
				$('.inner-content.market .section-content .inner-container').mustache('shop-csgo-item', value, {
					method: 'append'
				})
			})

			bind()
		})
	}

	function bind() {
		$el = $('.inner-content.market .section-content .inner-container')

		$('img.lazy').not('[src*="//steamcommunity-a.akamaihd.net"]').lazyload({
			effect: 'fadeIn',
			failure_limit: 5
		})

		$el.find('.item .buy.button').off().click(function() {
			var parent = $(this).parents('.item')
			var id = $(parent).attr('data-id')
			itemToFromCart(parent, id)
		})

		$('.page-content').off().scroll(function(e) {
			$('body').trigger('scroll')

			var elem = $(e.currentTarget)
			if (elem[0].scrollHeight - elem.scrollTop() == elem.outerHeight()) {
				appendItems(25)
			}
		})
	}

	function appendItems(count) {
		count = iteration + count
		_.some(items, function(value, i) {
			if (i < iteration) return
			if (iteration == count) return true
			iteration++
			$('.inner-content.market .section-content .inner-container').mustache('shop-csgo-item', value, {
				method: 'append'
			})
		})
		bind()
	}

	function itemToFromCart(parent, id) {
		$el = $('.inner-content.market')

		if ($.inArray(id, cart) != -1) {
			$(parent).find('.card-content').removeClass('selected')
			cart.splice($.inArray(id, cart), 1)
		} else {
			cart.push(id)
			$(parent).find('.card-content').addClass('selected')
		}

		if (cart.length > 0) {
			$el.find('.cart').addClass('open')
			$el.find('.inner-container').css('margin-bottom', $el.find('.cart').height() + 20)
		} else {
			$el.find('.cart').removeClass('open')
			$el.find('.inner-container').removeAttr('style')
		}

		var totalVal = 0
		$.each($el.find('.item').find('.selected'), function(i, item) {
			totalVal += parseFloat($(item).parents('.item').attr('data-price'))
		})
		$el.find('.cart .item-count').text(cart.length)
		$el.find('.cart .item-value').text(totalVal.toLocaleString())
		$el.find('.cart .acc-balance').text(user.balance.toLocaleString())
	}

	function checkout() {
		socket.emit('market.request', 1, cart, function(err, data) {
			if (err) {
				tAlert('error', err, 'Market Checkout')
				return
			}

			if (data) {
				tAlert('success', 'Your request has been received, you will receive a trade offer shortly.', 'Market Checkout')
				$.each($el.find('.item').find('.selected'), function(i, item) {
					$(item).parents('.item').remove()
				})
				cart = []
				$el.find('.cart').removeClass('open')
			}
		})
	}

	return {
		load: load,
		getFilter: function() {
			return filter
		},
		checkout: checkout
	}
})()

var sidebar = (function() {
	var initialized = false,
		$globalScope = $('.sidebar-action')
	var currentTab

	function init() {
		if (initialized) return
		initialized = true
		bind()

		$globalScope.find('.tabular.menu .item').tab({
			onLoad: function(tab) {
				switch (tab) {
					case 'sidebar-inventory':
						account.loadInventory()
						break

					case 'sidebar-deposit':
						account.loadSteamInventory()
						break

					case 'sidebar-settings':
						var $el = $globalScope.find('.inner.tab.settings')
						$el.addClass('loading')
						settingsGetLocal()

						auth.init(function() {
							if (!user.emailConfirmed) {
								$el.find('#email').parent().children('.icon').click(function() {
									socket.emit('email.confirmation', function(err, data) {
										if (err) {
											tAlert('error', err, 'Email Confirmation')
											return
										}
										tAlert('success', data, 'Email Confirmation')
									})
								})
							} else {
								$el.find('#email').parent().children('.icon').removeClass('warning sign link').addClass('checkmark').parent().removeAttr('data-tooltip')
							}

							$('#steam_tradeUrl').val(user.steam.tradeURL)

							if (!$el.find('#email').val()) {
								socket.emit('user.get', function(err, data) {
									$el.find('#email').val(data.email)
									$el.removeClass('loading')
								})
							} else {
								$el.removeClass('loading')
							}
							setTimeout(function() {
								$('.sounds-volume-slider').range({
									min: 0,
									max: 1.0,
									start: localSettings.soundsVol,
									step: 0.05,
									onChange: function(val) {
										$('.webSettings-volume-slider label span.val').text(parseInt(val * 100) + '%')
										localSettings.soundsVol = val
										localStorage.setItem('localSettings', JSON.stringify(localSettings))
									}
								})
							}, 100)
						})
						break

					case 'sidebar-affiliates':
						var $el = $globalScope.find('.inner.tab.affiliates')
						$el.addClass('loading')
						if (user.affiliateCode) {
							affiliatesStats(function() {
								$el.find('.affiliate-create').hide()
								$el.find('.affiliate-stats').show()
								$el.removeClass('loading')
							})

							var $refreshButton = $el.find('.affiliate-stats .actions .refresh.button')
							var $collectButton = $el.find('.affiliate-stats .actions .collect.button')

							$refreshButton.off().click(function() {
								$(this).addClass('loading')
								affiliatesStats(function() {
									$refreshButton.removeClass('loading')
								})
							})
							$collectButton.off().click(affiliatesCollect)
						} else {
							$el.find('.affiliate-create .input button').click(function() {
								var code = $(this).parent().find('input').val()
								affiliatesCreate(code)
							})
							$el.removeClass('loading')
						}

						$el.find('.module.redeem-code .input .button').off().click(function() {
							var code = $(this).parent().find('input').val()
							affiliatesRedeem(code)
						})
						break

					default:
						return
				}
			}
		})

		$globalScope.find('.ui.dropdown').dropdown()
	}

	function bind() {
		var $settings = $globalScope.find('.inner.tab.settings')

		$settings.find('.ui.checkbox.webSettings-confirmations').checkbox({
			onChecked: function() {
				localSettings.notifications = true
				localStorage.setItem('localSettings', JSON.stringify(localSettings))

				if (!Notification) {
					tAlert('error', 'Your browser does not support Desktop Notifications', 'Settings')
					$('.inner-content.account .tab.settings .checkboxes .webSettings-confirmations').checkbox('uncheck')
				} else {
					if (Notification.permission !== "granted") Notification.requestPermission().then(function(result) {
						if (result != "granted") {
							tAlert('error', 'You have dismissed or denied the browser notifications request.', 'Notifications')
							$('.inner-content.account .tab.settings .checkboxes .webSettings-confirmations').checkbox('uncheck')
							return
						}
					});
				}
			},
			onUnchecked: function() {
				localSettings.notifications = false
				localStorage.setItem('localSettings', JSON.stringify(localSettings))
			}
		})

		$settings.find('.ui.checkbox.webSettings-sounds').checkbox({
			onChecked: function() {
				localSettings.noSounds = true;
				localStorage.setItem('localSettings', JSON.stringify(localSettings));
			},
			onUnchecked: function() {
				localSettings.noSounds = false;
				localStorage.setItem('localSettings', JSON.stringify(localSettings));
			}
		})

		$settings.find('.update-settings-btn').click(function() {
			const self = this
			if ($(self).hasClass('loading')) return
			$(self).addClass('loading')

			var settings = {
				email: $('#email').val(),
				steam: {
					tradeURL: $('#steam_tradeUrl').val()
				}
			}

			socket.emit('user.updateSettings', settings, function(err, data) {
				$(self).removeClass('loading')
				if (err) {
					tAlert('error', err, 'Account Settings')
					return
				}

				if (data) {
					tAlert('success', 'Your settings have been updated', 'Account Settings')
				} else {
					tAlert('error', 'An unknown error has occured. Please use the contact form on the support button.', 'Account Settings')
				}
			})
		})

	}

	// affiliates

	function affiliatesStats(callback) {
		if (user.affiliateCode) {
			var $el = $globalScope.find('.inner.tab.affiliates')

			socket.emit('affiliate.getStats', function(err, data) {
				if (err) {
					tAlert('error', err, 'Affiliates Stats')
					if (callback && typeof(callback) === 'function') callback()
					return
				}

				if (data) {
					var $elements = {
						level: $el.find('.header .level'),
						code: $el.find('.stats .statistic .value.code'),
						uses: $el.find('.stats .statistic .value.uses'),
						earned: $el.find('.stats .statistic .value.earned'),
						earnedTotal: $el.find('.stats .statistic .value.earned-total'),
						deposits: $el.find('.stats .statistic .value.deposits'),
						depositsEarned: $el.find('.stats .statistic .value.deposits-earned')
					}

					$el.find('.hascode span.claimBonus').text(data.claimBonus)
					$el.find('.hascode span.depositBonus').text(data.depositBonus + '%')
					$el.find('.hascode').show()

					$el.find('.info span.payoutPercent').html(data.payoutPercent)

					$elements.level.text(data.rank)
					$elements.code.text(data.id)
					$elements.uses.text(data.claims)
					$elements.earned.text(data.payoutPool)

					$el.find('.progress').progress({
						percent: parseInt((data.claims / data.claimsNeeded) * 100)
					})

					$el.find('.progress .label').text(data.claimsNeeded - data.claims + ' claims needed for next level')

					if (callback && typeof(callback) === 'function') callback()
				}
			})
		}
	}

	function affiliatesCreate(code) {
		if (code == '') return

		var $el = $globalScope.find('.inner.tab.affiliates')

		socket.emit('affiliate.create', code, function(err, data) {
			if (err) {
				tAlert('error', err, 'Affiliates')
				return
			}

			if (data) {
				user.affiliateCode = code
				tAlert('success', 'Your code "' + code + '" has been created.', 'Affiliates')
				affiliatesStats(function() {
					$el.find('.affiliate-create').slideUp()
					$el.find('.affiliate-stats').fadeIn()
					var $refreshButton = $el.find('.affiliate-stats .actions .refresh.button')
					var $collectButton = $el.find('.affiliate-stats .actions .collect.button')

					$refreshButton.off().click(function() {
						$(this).addClass('loading')
						affiliatesStats(function() {
							$refreshButton.removeClass('loading')
						})
					})
				})
			}
		})
	}

	function affiliatesRedeem(code) {
		if (code == '') return

		socket.emit('affiliate.claim', code, function(err, data) {
			if (err) {
				tAlert('error', err, 'Redeem Code')
				return
			}

			if (data) {
				tAlert('success', data, 'Redeem Code')
			}
		})
	}

	function affiliatesCollect() {
		socket.emit('affiliate.claimPayout', function(err, data) {
			if (err) {
				tAlert('error', err, 'Collect Earnings')
				return
			}
			if (data) {
				tAlert('success', 'Successfully claimed ' + $('.affiliates .stats .statistic .value.earned').text() + ' <i class="hc"></i>', 'Collect Earnings')
				$('.affiliates .stats .statistic .value.earned').text(0)
			}
		})
	}

	// settings

	function settingsGetLocal() {
		var $el = $globalScope.find('.inner.tab.settings')

		if (localSettings.notifications) $el.find('.checkboxes .webSettings-confirmations').checkbox('check')
		else $el.find('.checkboxes .webSettings-confirmations').checkbox('uncheck')

		if (localSettings.noSounds) $el.find('.checkboxes .webSettings-sounds').checkbox('check')
		else $el.find('.checkboxes .webSettings-sounds').checkbox('uncheck')

		if (!localSettings.soundsVol) $el.find('.sounds-volume-slider').range('set value', localSettings.soundsVol)
	}

	// misc

	function toggle(tab) {
		if (!tab) {
			$('.sidebar-action').toggleClass('open')
		} else {
			if (tab !== currentTab) {
				if (!$('.sidebar-action').hasClass('open')) $('.sidebar-action').addClass('open')
				currentTab = tab
				$('.sidebar-action .menu').find('.item').tab('change tab', 'sidebar-' + tab)
			} else $('.sidebar-action').toggleClass('open')
		}
	}

	return {
		init,
		toggle
	}
})()

var account = (function() {
	var $stats,
		$settings

	function init() {
		// show basic user info
		var templateData = {
			avatar: user.avatar,
			id: user.id,
			name: user.name,
			balance: user.balance.toLocaleString()
		}

		$.Mustache.load('/assets/components/components.html', function() {
			$('.page-content .inner-content.account .section-info').mustache('account-info', templateData, {
				method: 'html'
			})
		})

		$('.inner-content.account .account-menu .item').tab({
			onLoad: function(tab) {
				switch (tab) {
					case 'stats':
						$el = $('.inner-content.account .section-content .tab.stats')
						// $el.addClass('loading')
						// $el.removeClass('loading')
						break

					case 'settings':
						var $el = $('.inner-content.account .tab.settings')
						$el.addClass('loading')

						// refresh user before logic
						auth.init(function() {
							if (!user.emailConfirmed) {
								$el.find('#email').parent().children('.icon').click(function() {
									socket.emit('email.confirmation', function(err, data) {
										if (err) {
											tAlert('error', err, 'Email Confirmation')
											return
										}
										tAlert('success', data, 'Email Confirmation')
									})
								})
							} else {
								$el.find('#email').parent().children('.icon').removeClass('warning sign link').addClass('checkmark').parent().removeAttr('data-tooltip')
							}

							$('#steam_tradeUrl').val(user.steam.tradeURL)

							if (!$el.find('#email').val()) {
								socket.emit('user.get', function(err, data) {
									$el.find('#email').val(data.email)
									$el.removeClass('loading')
								})
							} else {
								$el.removeClass('loading')
							}
							setTimeout(function() {
								$('.sounds-volume-slider').range({
									min: 0,
									max: 1.0,
									start: localSettings.soundsVol,
									step: 0.05,
									onChange: function(val) {
										$('.webSettings-volume-slider label span.val').text(parseInt(val * 100) + '%')
										localSettings.soundsVol = val
										localStorage.setItem('localSettings', JSON.stringify(localSettings))
									}
								})
							}, 100)
						})

						break

					case 'affiliates':
						var $el = $('.inner-content.account .tab.affiliates')
						$el.addClass('loading')
						if (user.affiliateCode) {
							affiliatesStats(function() {
								$el.find('.affiliate-create').hide()
								$el.find('.affiliate-stats').show()
								$el.removeClass('loading')
							})

							var $refreshButton = $el.find('.affiliate-stats .actions .refresh.button')
							var $collectButton = $el.find('.affiliate-stats .actions .collect.button')

							$refreshButton.off().click(function() {
								$(this).addClass('loading')
								affiliatesStats(function() {
									$refreshButton.removeClass('loading')
								})
							})
							// $collectButton.click(affiliatesCollect)
						} else {
							$el.find('.affiliate-create .input button').click(function() {
								var code = $(this).parent().find('input').val()
								createAffiliate(code)
							})
							$el.removeClass('loading')
						}
						break

					default:
						return
				}
			}
		})

		$stats = $('.inner-content.account .section-content .tab.stats')
		$('.inner-content.account .tab.stats .download-btn').click(function() {
			$(this).parent().find('table').TableCSVExport({
				delivery: 'download',
				filename: 'HyperDraft Data Export.csv'
			})
		})

		socket.emit('coinflip.user.getHistory', function(err, data) {
			if (!data) return
			var countWon = 0
			$.each(data, function(i, item) {
				if (item.winner == user.id) countWon++
			})
			$stats.find('.quick-stats .cf-won').html(countWon + '<small>/' + data.length + '</small>')
		})

		socket.emit('bet.getHistory', function(err, data) {
			if (!data) return
			var countWon = 0
			$.each(data, function(i, item) {
				if (item.teamID == item.matchData.winner) countWon++
			})
			$stats.find('.quick-stats .bets').html(countWon + '<small>/' + data.length + '</small>')
		})

		socket.emit('market.getTradeHistory', function(err, data) {
			$stats.removeClass('loading')
			if (!data) return
			$stats.find('.quick-stats .trades').html(data.length)
		})
	}

	function loadStats(id) {
		$('.ui.accordion').find('.content[data-id="' + id + '"] tbody').empty()

		switch (id) {
			case 'transactions':
				socket.emit('blockchain.getLast', function(err, data) {
					if (err) {
						tAlert('error', err, 'Transactions History')
						return
					}

					if (data.length > 20)
						data.length = 20

					$.each(data, function(i, item) {
						if (item.status == 0) return

						var templateData = {
							id: item.id,
							gateway: 'Bitcoin',
							amountUSD: item.valueUSD.toFixed(2),
							time: null,
							time_completed: null,
							confirmations: item.confirmations,
							status: null
						}

						if (!$.isBlank(item.time)) {
							var time = new Date(item.time)
							templateData.time = moment(item.time).format('YYYY-MM-DD HH:mm:ss')
						}

						if (!$.isBlank(item.time_completed)) {
							var time = new Date(item.time_completed)
							templateData.time_completed = moment(item.time_completed).format('YYYY-MM-DD HH:mm:ss')
						} else {
							templateData.time_completed = '-'
						}

						if (item.status !== null) {
							var states = ['error', 'pending', 'completed']
							templateData.status = states[item.status]
						}

						if (item.status == 1) {
							$stats.find('.content.pending-transactions-container table tbody').mustache('account-stats-pending-transactions', templateData, {
								method: 'append'
							})
						}

						$stats.find('.content.recent-transactions-container table tbody').mustache('account-stats-recent-transactions', templateData, {
							method: 'append'
						})
					})

					bind(id)
				})
				break
			case 'bets':
				socket.emit('matches.user.getBetHistory', function(err, data) {
					if (err) {
						tAlert('error', err, 'Transaction History')
						return
					}

					if (data.length > 20)
						data.length = 20

					const BET_STATUS = {
						'0': 'pending',
						'1': 'lost',
						'2': 'won',
						'3': 'refunded',
					}

					$.each(data, function(i, item) {
						var templateData = {
							game_icon: null,
							id: item.id,
							match_id: item.matchID,
							teams: {
								selected: {
									name: function() {
										var name
										$.each(item.matchData.opponents, function(o, otem) {
											if (otem.participant.id == item.teamID) {
												name = otem.participant.name
											}
										})
										return name
									},
									id: function() {
										var name
										$.each(item.matchData.opponents, function(o, otem) {
											if (otem.participant.id == item.teamID) {
												name = otem.participant.id
											}
										})
										return name
									},
									odd: null,
									er: null
								},
								other: {
									name: function() {
										var name
										$.each(item.matchData.opponents, function(o, otem) {
											if (otem.participant.id != item.teamID) {
												name = otem.participant.name
											}
										})
										return name
									},
									id: function() {
										var name
										$.each(item.matchData.opponents, function(o, otem) {
											if (otem.participant.id != item.teamID) {
												name = otem.participant.id
											}
										})
										return name
									}
								}
							},
							time: null,
							amount: item.amount,
							status: BET_STATUS[item.status]
						}

						if (!$.isBlank(item.matchData.discipline)) {
							switch (item.matchData.discipline) {
								case 'counterstrike_go':
									templateData.game_icon = '/assets/img/games/csgo-icon.png'
									break

								case 'dota2':
									templateData.game_icon = '/assets/img/games/dota-icon.png'
									break

								case 'leagueoflegends':
									templateData.game_icon = '/assets/img/games/lol-icon.png'
									break

								case 'overwatch':
									templateData.game_icon = '/assets/img/games/ow-icon.png'
									break

								default:
									return
							}
						}

						if (!$.isBlank(item.time)) {
							var time = new Date(item.time)
							templateData.time = moment(item.time).format('YYYY-MM-DD hh:mm:ss')
						}

						var odd,
							total = 0
						$.each(item.matchData.betData, function(o, otem) {
							if (otem.teamID == item.teamID) {
								odd = otem.total
							}
							total += otem.total
						})
						templateData.teams.selected.odd = (1 / (odd / total)).toFixed(2)
						templateData.teams.selected.er = parseInt(templateData.amount * parseFloat(templateData.teams.selected.odd))

						$stats.find('.content.recent-bets-container table tbody').mustache('account-stats-recent-bets', templateData, {
							method: 'append'
						})
					})

					bind(id)
				})
				break
			case 'coinflips':
				socket.emit('coinflip.user.getHistory', function(err, data) {
					if (err) {
						tAlert('error', err, 'Coinflip History')
						return
					}

					if (data.length > 20)
						data.length = 20

					$.each(data, function(i, item) {
						function isCreator() {
							if (item.creator === user.id) return true
							else return false
						}

						var templateData = {
							id: item.id,
							side: function() {
								var sides = ['ct', 't']
								if (isCreator) {
									return sides[item.team].toUpperCase()
								} else {
									var rSides = [sides[1], sides[0]]
									return rSides[item.team].toUpperCase()
								}
							},
							wager: item.wager,
							time_created: moment(item.startTime).format('YYYY-MM-DD HH:mm:ss'),
							time_completed: function() {
								if (item.hasOwnProperty('endTime')) {
									return moment(item.endTime).format('YYYY-MM-DD HH:mm:ss')
								} else {
									return '-'
								}
							},
							status: function() {
								if (item.hasOwnProperty('winner')) {
									if (item.winner == user.id) {
										return 'won'
									} else if (item.hasOwnProperty('endTime')) {
										return 'lost'
									}
								}
								if (item.live) {
									return 'pending'
								}

								return 'expired'
							}
						}

						$stats.find('.content.recent-coinflips-container table tbody').mustache('account-stats-recent-coinflips', templateData, {
							method: 'append'
						})
					})

					bind(id)
				})
				break
			case 'roulette':
				socket.emit('roulette.user.getRecent', function(err, data) {
					if (err) {
						tAlert('error', err, 'Roulette History')
						return
					}

					if (data.length > 20)
						data.length = 20

					$.each(data, function(i, item) {
						_.forEach(item.betData, function(bet) {
							var templateData = {
								id: bet.id,
								gameid: bet.gameID,
								selection: function() {
									if (bet.selection == 2) return 'blue'
									else if (bet.selection == 1) return 'black'
									else return 'red'
								},
								wager: bet.total,
								time: moment(bet.time).format('YYYY-MM-DD HH:mm:ss'),
								status: function() {
									var winningSelection
									if (item.winningOption == 0)
										winningSelection = 2
									else if (isOdd(item.winningOption))
										winningSelection = 1
									else
										winningSelection = 0

									if (winningSelection == bet.selection) return 'won'
									else return 'lost'
								}
							}

							$stats.find('.content.recent-roulette-container table tbody').mustache('account-stats-recent-roulette', templateData, {
								method: 'append'
							})
						})
					})

					bind(id)
				})
				break
			case 'steam':
				const OFFER_STATE = {
					// 'Invalid': 1,
					// 'Active': 2, // This trade offer has been sent, neither party has acted on it yet.
					// 'Accepted': 3, // The trade offer was accepted by the recipient and items were exchanged.
					// 'Countered': 4, // The recipient made a counter offer
					// 'Expired': 5, // The trade offer was not accepted before the expiration date
					// 'Cancelled': 6, // The sender cancelled the offer
					// 'Declined': 7, // The recipient declined the offer
					// 'InvalidItems': 8, // Some of the items in the offer are no longer available (indicated by the missing flag in the output)
					// 'CreatedNeedsConfirmation': 9, // The offer hasn't been sent yet and is awaiting further confirmation
					// 'CanceledBySecondFactor': 10, // Either party canceled the offer via email/mobile confirmation
					// 'InEscrow': 11, // The trade has been placed on hold

					'1': 'Invalid/Error',
					'2': 'Active/Pending',
					'3': 'Accepted',
					'4': 'Countered',
					'5': 'Expired',
					'6': 'Cancelled',
					'7': 'Declined',
					'8': 'InvalidItems',
					'9': 'CreatedNeedsConfirmation',
					'10': 'CanceledBySecondFactor',
					'11': 'InEscrow'
				}

				socket.emit('market.getTradeHistory', function(err, data) {
					if (err) {
						tAlert('error', err, 'Steam Transactions History')
						return
					}

					if (data.length > 20)
						data.length = 20

					$.each(data, function(i, item) {
						var templateData = {
							id: item.id,
							type: function() {
								if (item.type == 1) {
									return 'withdraw'
								} else if (item.type == 0) {
									return 'deposit'
								}
							},
							items: item.itemData,
							itemsLength: item.items.length,
							time: moment(item.time).format('YYYY-MM-DD HH:mm:ss'),
							status: function() {
								if (item.sent_offers[0] && item.sent_offers.length > 0) {
									return OFFER_STATE[item.sent_offers[0].offerState]
								}
							}
						}

						$stats.find('.content.recent-steam-transactions-container table tbody').mustache('account-stats-recent-steam-transactions', templateData, {
							method: 'append'
						})
					})

					bind(id)
				})
				break
		}
	}

	function bind(id) {
		$('.ui.accordion').find('.content[data-id="' + id + '"]').removeClass('loading')
	}

	function steam() {
		if (user.steam) {
			var $el = $('.sidebar-action .deposit .steam-inventory')
			$el.find('i.refresh.icon').addClass('loading')

			var cart = []
			$el.find('.stats .items-value, .stats .item-count, .stats .items-value-hc').text('0')

			$el.find('.inventory').empty()

			socket.emit('market.userInventory', function(err, data) {
				$el.find('i.refresh.icon').removeClass('loading')

				if (err) {
					tAlert('error', err, 'Steam Inventory')
					return
				}

				if (data.length == 0) {
					tAlert('error', 'No items that match our criteria were found.', 'Steam Inventory')
					return
				}

				data = _.sortBy(data, function(item) {
					return parseFloat(item.price)
				}).reverse()

				$.each(data, function(i, item) {
					var skin = /(★ )?(StatTrak™ )?(.+) \| (.+) \((.+)\)/.exec(item.id)
					var skin_name

					if (!$.isBlank(/\((.+)\)/.exec(item.id))) {
						skin_name = item.id.replace(/\((.+)\)/.exec(item.id)[0], '')
					} else {
						skin_name = item.id
					}

					var templateData = {
						assetid: item.assetid,
						price: item.price,
						icon: item.icon_url,
						name: skin_name,
						stattrak: function() {
							if (skin) {
								return skin[2]
							}
						},
						condition: function() {
							if (skin) {
								return skin[5]
							}
						},
						color: item.quality_color
					}

					$el.find('.inventory').mustache('modal-deposit-item', templateData, {
						method: 'append'
					})
				})

				$el.find('.inventory .item').click(function() {
					var id = $(this).attr('data-id')
					if ($.inArray(id, cart) != -1) {
						$(this).removeClass('selected')
						cart.splice($.inArray(id, cart), 1)
					} else {
						cart.push(id)
						$(this).addClass('selected')
					}

					$el.find('.stats .item-count').text(cart.length)

					var totalVal = 0
					$.each($el.find('.inventory .item.selected'), function(i, item) {
						totalVal += parseFloat($(item).attr('data-price'))
					})

					$el.find('.stats .items-value').text(totalVal.toFixed(2).toLocaleString())
					$el.find('.stats .items-value-hc').text(parseInt(totalVal * 100).toLocaleString())
				})
			})

			$el.find('.sort input').off().on('input', function() {
				var searchTerm = $(this).val().toLowerCase()

				$.each($el.find('.inventory .item'), function(i, item) {
					if ($(item).find('.meta .inner').text().toLowerCase().indexOf(searchTerm) != -1) {
						$(item).show()
					} else {
						$(item).hide()
					}
				})
			})

			$el.find('.send-trade-btn').off().click(function() {
				if (cart.length < 1) {
					tAlert('error', 'No items selected.', 'Item Deposit')
					return
				}

				socket.emit('market.request', 0, cart, function(err, data) {
					if (err) {
						tAlert('error', err, 'Item Deposit')
					}
					if (data) {
						tAlert('success', 'Your trade request has been received, you will receive a trade offer soon.', 'Steam Trade')
						$el.find('.inventory .item.selected').each(function(i, item) {
							item.remove()
						})
						cart = []
						$el.find('.stats .items-value, .stats .item-count, .stats .items-value-hc').text('0')
					}
				})
			})

			$el.find('i.refresh.icon').off().click(steam)
		} else {
			tAlert('error', 'No steam account is linked with this account.', 'Steam Inventory')
		}
	}

	// settings

	function settingsLoad(callback) {
		if (callback && typeof(callback) === 'function') callback()
	}

	function settingsUpdate() {

	}

	return {
		init: init,
		stats: loadStats,
		loadSteamInventory: steam
	}
})()

var admin = (function() {
	var $globalScope
	var initialized = false

	function init() {
		if (initialized) return
		initialized = true

		$globalScope = $('.inner-content.admin')

		bind('init')
	}

	function bind(type) {
		if (type == 'init') {
			var $quickStats = {
				users: $globalScope.find('.quick-stats .value.users'),
				deposits: $globalScope.find('.quick-stats .value.deposits'),
				withdraws: $globalScope.find('.quick-stats .value.withdraws'),
				dailyreward: $globalScope.find('.quick-stats .value.dailyreward'),
				profit: $globalScope.find('.quick-stats .value.profit')
			}

			$.ajax({
				type: 'GET',
				url: '/api/candybar',
				dataType: 'json',
				success: function(data) {
					console.log(data)
				}
			})
		}
	}

	return {
		init: init
	}
})()

var stats = (function() {
	var $globalScope,
		initialized = false

	function init() {
		$globalScope = $('.inner-content.stats')
		bind('init')

		load('leaderboards-general')

		$globalScope.find('.stats-menu .item, .history-menu .item, .leaderboards-menu .item').tab({
			onLoad: function(tab) {
				if (tab == 'history') load($globalScope.find('.history-menu .item.active').data('tab'))
				else if (tab == 'leaderboards') load($globalScope.find('.leaderboards-menu .item.active').data('tab'))
				else load(tab)
			}
		})

		if (initialized) return
		initialized = true
	}

	function bind(type) {
		switch (type) {
			case 'init':
				socket.emit('api.overallPublicStats', function(err, data) {
					if (err) {
						tAlert('error', err, 'Stats')
						return
					}

					$globalScope.find('.statistic .active-users').text(data.activeToday.toLocaleString())
					$globalScope.find('.statistic .won').html(data.wonToday.toLocaleString() + ' <i class="hc"></i>')
					$globalScope.find('.statistic .games').text(data.gameCountToday.toLocaleString())
					$globalScope.find('.statistic .new-users').text(data.joinedToday.toLocaleString())
				})
				break
			case 'stats':
				$globalScope.find('table td[data-steamid]').off().click((e) => userprofiles.show(e))
				break
		}
	}

	function load(type) {
		var $activeTab = $globalScope.find('.tab[data-tab="' + type + '"]')
		$activeTab.addClass('loading').find('table tbody').empty()

		switch (type) {
			case 'leaderboards-general':
				socket.emit('api.steam.topDeposit', function(err, data) {
					if (err) {
						tAlert('error', err, 'Stats')
						return
					}
					if (!data) return
					if (data.length > 10)
						data.length = 10

					_.each(data, function(entry, i) {
						entry.rank = i + 1
						entry.total = parseInt(entry.itemValue * 100).toLocaleString()
						$activeTab.find('table.deposits').mustache('stats-ld-deposits-listing', entry, {
							method: 'append'
						})
					})
					bind('stats')
					$activeTab.removeClass('loading')
				})
				socket.emit('api.steam.topWithdrawal', function(err, data) {
					if (err) {
						tAlert('error', err, 'Stats')
						return
					}
					if (!data) return
					if (data.length > 10)
						data.length = 10

					_.each(data, function(entry, i) {
						entry.rank = i + 1
						entry.total = parseInt(entry.itemValue * 100).toLocaleString()
						$activeTab.find('table.withdraws').mustache('stats-ld-withdraws-listing', entry, {
							method: 'append'
						})
					})
					bind('stats')
				})
				break

			case 'leaderboards-roulette':
				socket.emit('roulette.topBets', function(err, data) {
					if (err) {
						tAlert('error', err, 'Stats')
						return
					}

					if (!data) return
					if (data.length > 10)
						data.length = 10

					_.each(data, function(entry, i) {
						entry.rank = i + 1
						entry.total = entry.total.toLocaleString()
						$activeTab.find('table').mustache('stats-ld-roulette-listing', entry, {
							method: 'append'
						})
					})
					bind('stats')
					$activeTab.removeClass('loading')
				})
				break
			case 'leaderboards-coinflip':
				socket.emit('coinflip.topFlips', function(err, data) {
					if (err) {
						tAlert('error', err, 'Stats')
						return
					}
					if (!data) return
					if (data.length > 10)
						data.length = 10

					_.each(data, function(entry, i) {
						entry.rank = i + 1
						entry.total = (entry.wager * 2).toLocaleString()

						entry.users.map(usermap => {
							if (usermap.id == entry.creator) {
								entry.creatorname = usermap.username
								entry.creatorid = usermap.steam.steamid
							}
						})

						$activeTab.find('table').mustache('stats-ld-coinflip-listing', entry, {
							method: 'append'
						})
					})
					bind('stats')
					$activeTab.removeClass('loading')
				})
				break

			case 'history-roulette':
				socket.emit('roulette.cleanHistory', function(err, data) {
					if (err) {
						tAlert('error', err, 'Stats')
						return
					}
					_.each(data, function(entry) {
						entry.total = entry.total.toLocaleString()
						$activeTab.find('table').mustache('stats-roulette-listing', entry, {
							method: 'append'
						})
					})
					bind('stats')
					$activeTab.removeClass('loading')
				})
				break
			case 'history-coinflip':
				socket.emit('coinflip.getHistory', function(err, data) {
					if (err) {
						tAlert('error', err, 'Stats')
						return
					}
					_.each(data, function(entry) {
						entry.total = entry.wager * 2

						if (entry.winningTeam === 0)
							entry.winningTeam = 'CT'
						else
							entry.winningTeam = 'T'

						entry.total = entry.total.toLocaleString()

						$activeTab.find('table').mustache('stats-coinflip-listing', entry, {
							method: 'append'
						})
					})
					bind('stats')
					$activeTab.removeClass('loading')
				})
				break
		}
	}

	return {
		init: init
	}
})()

var userprofiles = (function() {

	function show(e) {
		var steamid = $(e.currentTarget).attr('data-steamid')
		if (steamid === null || steamid === '') return

		socket.emit('user.pullBasicData', steamid, function(err, data) {
			if (err) {
				tAlert('error', err, 'User Profile')
				return
			}

			var info = data

			info.coinflip.totalCount = data.coinflip.wonCount + data.coinflip.lostCount
			info.roulette.totalCount = data.roulette.wonCount + data.roulette.lostCount
			info.matchBet.totalCount = data.matchBet.wonCount + data.matchBet.lostCount
			info.overall.total = data.overall.won + data.overall.lost
			info.overall.percentage = (data.overall.won / info.overall.total * 100).toFixed(1)

			const USER_ROLES = {
				'0': 'User',
				'1': 'Moderator',
				'2': 'Admin',
				'3': 'Admin'
			}

			info.user.role = USER_ROLES[data.user.admin]
			$('#userProfileModal').mustache('user-profile-modal', info, {
				method: 'html'
			})

			$('#userProfileModal').finish().css({
				top: e.pageY + 'px',
				left: (e.pageX + 20) + 'px'
			}).show(function() {
				if (!isElementInViewport($(this))) $(this).css('top', parseInt($(this).css('top')) - $(this).height())
			})

			$('#userProfileModal .close-btn').off().click(function() {
				$('#userProfileModal').hide(100)
			})
		})
	}

	return {
		show: show
	}
})()

// games

var coinflip = (function() {
	var $globalScope

	var initialized = false,
		inGame = false

	function init() {
		bind('init')

		if (initialized) return
		initialized = true

		socket.on('coinflip.start', function(data) {
			if (route.getPage() != 'games') return
			createListing(data)
		})

		socket.on('coinflip.end', function(data) {
			if (route.getPage() != 'games') return

			var $el = $globalScope.find('.listing[data-id="' + data.id + '"]')

			$el.attr('data-timestamp-end', Date.now())

			$el.find('.status span').removeClass('joinable').addClass('progress').html('<i class="circle icon"></i> In Progress')
			$el.find('.status span').off().click(function() {
				watch(data.id)
			})

			if (user.id == data.creator) {
				tAlert('info', '<c id="coinflipNotification" data-id="' + data.id + '"></c>Your coinflip for ' + parseInt(data.wager * 2) + ' <i class="hc"></i> has just begun, click this notification to watch it.', 'Coinflip')
			}

			setTimeout(function() {
				$.each(data.userData, function(i, item) {
					if (data.winner == item.id) {
						var sides = ['ct', 't'],
							side

						if (data.creator == item.id) {
							side = sides[data.team]
						} else {
							var rSides = [sides[1], sides[0]]
							side = rSides[data.team]
						}

						$el.find('.status span')
							.removeClass('progress').addClass('winner')
							.html(item.username + ' <img src="/assets/img/games/coinflip/' + side + '.png">')
					}
				})

				// notify winner
				if (data.winner == user.id) {
					tAlert('success', 'You have received ' + parseInt(data.winnerTotal) + ' <i class="hc"></i> from winning a coinlfip.', 'Coinflip', true)
					if (!localSettings.noSounds) {
						$.playSound('/assets/sounds/win/win' + getRandomInt(1, 3))
					}
				}

				// remove listing
				setTimeout(function() {
					$el.fadeOut(function() {
						$(this).remove()
						updateStats()

						// add to history
						var templateData = {
							id: data.id,
							secret: data.secret,
							total: data.wager * 2,
							wager: data.winnerTotal.toLocaleString(),
							avatar: function() {
								var avatar
								$.each(data.userData, function(o, otem) {
									if (otem.id == data.winner) {
										avatar = otem.avatarURL
									}
								})
								return avatar
							},
							winnerID: data.winner,
							name: function() {
								var name
								$.each(data.userData, function(o, otem) {
									if (otem.id == data.winner) {
										name = otem.username
									}
								})
								return name
							}
						}

						$('.inner-content.games .inner.coinflip .info .history table').mustache('coinflip-history-listing', templateData, {
							method: 'prepend'
						})
						bind('history')

						if ($('.inner-content.games .inner.coinflip .info .history table').find('.listing').length > 8) {
							$('.inner-content.games .inner.coinflip .info .history table').find('.listing').last().remove()
						}
					})
				}, 10000)
			}, 14000)
		})

		socket.on('coinflip.timeout', function(data) {
			if (route.getPage() != 'games') return
			$globalScope = $('.inner-content.games .inner.coinflip .games-container table')
			$globalScope.find('[data-id="' + data.id + '"]').remove()
		})
	}

	function getLive() {
		socket.emit('coinflip.getLive', function(err, data) {
			if (err) {
				tAlert('error', err, 'Coinflip')
				return
			}
			$('.inner-content.games .inner.coinflip .games-container table').empty()

			data = _.sortBy(data, 'wager').reverse()
			$.each(data, function(i, item) {
				createListing(item, true)
			})
		})
	}

	function history() {
		$('.inner-content.games .inner.coinflip .info .history table').empty()

		socket.emit('coinflip.getHistory', function(err, data) {
			if (!data) return
			if (data.length > 8)
				data.length = 8

			$.each(data, function(i, item) {
				var templateData = {
					id: item.id,
					wager: item.winnerTotal.toLocaleString(),
					avatar: function() {
						var avatar
						$.each(item.userData, function(o, otem) {
							if (otem.id == item.winner) {
								avatar = otem.avatarURL
							}
						})
						return avatar
					},
					winnerID: item.winner,
					name: function() {
						var name
						$.each(item.userData, function(o, otem) {
							if (otem.id == item.winner) {
								name = otem.username
							}
						})
						return name
					},
					ticket: item.winningTicket,
					secret: item.secret,
					total: item.wager * 2
				}

				$('.inner-content.games .inner.coinflip .info .history table').mustache('coinflip-history-listing', templateData, {
					method: 'append'
				})
				bind('history')
			})
		})
	}

	function createListing(data, sorted) {
		$globalScope = $('.inner-content.games .inner.coinflip .games-container table')

		var teams = ['ct', 't']

		var templateData = {
			id: data.id,
			amount: data.wager,
			amountLocale: data.wager.toLocaleString(),
			side: {
				id: data.team,
				string: teams[data.team]
			},
			expire: data.timeout,
			avatar: data.userData[0].avatarURL,
			name: data.userData[0].username
		}

		if (sorted) {
			$('.inner-content.games .inner.coinflip .games-container table').mustache('coinflip-listing', templateData, {
				method: 'append'
			})
		} else {
			if ($globalScope.find('.listing').length < 1) {
				$('.inner-content.games .inner.coinflip .games-container table').mustache('coinflip-listing', templateData, {
					method: 'append'
				})
			} else {
				$.each($globalScope.find('.listing'), function(i, item) {
					if (parseInt($(item).attr('data-amount')) < data.wager) {
						$(item).mustache('coinflip-listing', templateData, {
							method: 'before'
						})
						return false
					} else if (i == $globalScope.find('.listing').length - 1) {
						$('.inner-content.games .inner.coinflip .games-container table').mustache('coinflip-listing', templateData, {
							method: 'append'
						})
					}
				})
			}
		}

		bind('main')
		updateStats()
	}

	function bind(type) {
		if (type == 'main') {
			var $el = $('.inner-content.games .inner.coinflip .games-container table')

			$el.find('.listing').each(function(i, item) {
				var timeout = moment($(item).attr('data-expire')).format('HH:mm')
				if ($(item).find('.status span').hasClass('joinable') && $(item).find('.name span').text() == user.name) {
					$(item).find('.status span')
						.removeClass('joinable')
						.addClass('progress')
						.text('Your Coinflip')
						.attr('data-tooltip', 'Expires at: ' + timeout)
				}
			})

			$el.find('.status span').click(function() {
				var id = $(this).parents('.listing').attr('data-id')
				if (!user.id) return // not logged in
				if ($(this).hasClass('progress')) return
				if ($(this).parents('.listing').find('.name span').text() == user.name) return
				join(id)
			})
		} else if (type == 'history') {
			var $el = $('.inner-content.games .inner.coinflip .info .history table tr')
			$el.find('.wager').click(function() {
				var id = $(this).parents('.listing').attr('data-id')
				watch(id)
			})
		} else if (type == 'init') {
			$('.inner-content.games .inner.coinflip .howto').off().click(() => {
				modal.open('help-coinflip')
			})
			// $('.inner-content.games .inner.coinflip .provably-fair').off().click(() => { modal.open('provably-fair') })
			$('.inner-content.games .inner.coinflip .provably-fair').off().click(() => {
				route.change('stats')
			})
		}
	}

	function join(id) {
		if (route.getPage() != 'games') return

		var data = {
			coinflip: {
				id: id
			}
		}
		modal.open('coinflip-join', data)
	}

	function watch(id) {
		var data = {
			coinflip: {
				id: id
			}
		}
		modal.open('coinflip-watch', data)
	}

	function create() {
		if (route.getPage() != 'games') return

		modal.open('coinflip-create')
	}

	function updateStats() {
		$el = $('.inner-content.games .inner.coinflip .stats')

		var totalValue = 0
		var totalCount = 0

		$.each($el.parents().find('.games-container').find('.listing'), function(i, item) {
			totalValue += parseInt($(item).attr('data-amount'))
			totalCount++
		})

		$el.find('.total-count').text(totalCount)
		$el.find('.total-value').text(totalValue.toLocaleString())

		$('.inner-content.games .games-menu .item[data-tab="coinflip"] .status').html('<i class="hc"></i> ' + totalValue.toLocaleString())
	}

	function setState(state) {
		if (state == null) return
		inGame = state
	}

	return {
		init: init,
		load: getLive,
		history: history,
		create: create,
		join: join,
		watch: watch,
		inGame: function() {
			return inGame
		},
		setState: setState
	}
})()

var roulette = (function() {
	var $globalScope
	var initialized = false

	const numbers = [0, 11, 6, 3, 10, 1, 12, 5, 14, 7, 4, 13, 2, 9, 8]
	var currentNumbers = numbers
	var rolling = false
	var entries = []
	var timerVal,
		timer,
		hash

	function init() {
		$globalScope = $('.inner-content.games .inner.roulette')
		bind('init')
		if (initialized) return
		initialized = true

		socket.on('roulette.update', function(data) {
			if (data.hasOwnProperty('winningOption')) {
				roll(data.winningOption)
			}
		})
		socket.on('roulette.newbet', function(data) {
			if (rolling) return

			var entryData = {
				user: data.userData,
				selection: data.selection,
				amount: data.total,
				amountLocale: data.total.toLocaleString()
			}

			var existing = false
			_.forEach(entries, function(entry) {
				if (entry.user.id == entryData.user.id && entry.selection == entryData.selection) {
					existing = true
					entry.amount += entryData.amount
					entry.amountLocale = entry.amount.toLocaleString()
				}
			})

			if (!existing) {
				entries.push(entryData)
			}

			createListings()
		})
	}

	function bind(type) {
		if (type == 'init') {
			$('.inner-content.games .inner.roulette .howto').off().click(() => {
				modal.open('help-roulette')
			})
			// $('.inner-content.games .inner.roulette .provably-fair').off().click(() => { modal.open('provably-fair')})
			$('.inner-content.games .inner.roulette .provably-fair').off().click(() => {
				route.change('stats')
			})

			$globalScope.find('.wager .button').off().click(function() {
				var $input = $globalScope.find('.wager input')
				if ($(this).attr('data-value') == 'clear' || $(this).attr('data-value') == 'max' || $(this).attr('data-value') == 'half') {
					switch ($(this).attr('data-value')) {
						case 'clear':
							$input.val('')
							break
						case 'half':
							var val = parseInt($input.val())
							$input.val(parseInt(val / 2))
							break
						case 'max':
							if (user.balance > 5000) $input.val('5000')
							else $input.val(user.balance)
							break
					}
				} else {
					var category = $(this).attr('data-value').split(' ')[0]
					var value = parseInt($(this).attr('data-value').split(' ')[1])
					var inputVal = parseInt($input.val())

					if (category == '*') {
						if (!inputVal) return
						$input.val(inputVal * value)
					}
					if (category == '+') {
						if (!inputVal) {
							$input.val(value)
							return
						}
						$input.val(inputVal + value)
					}
					if (category == '-') {
						if (!inputVal || inputVal <= 0 || (inputVal - value) < 0) return
						$input.val(inputVal - value)
					}
				}
			})

			$globalScope.find('.bet-panels .panel .header').off().click(function() {
				enter(parseInt($(this).parent().attr('data-selection')))
			})
		} else if (type == 'listing') {

		}
	}

	function getLive() {
		reset()

		socket.emit('roulette.getActive', function(err, data) {
			if (err) {
				tAlert('error', err, 'Roulette')
				return
			}

			timerVal = parseInt(data.timeLeft)
			//hash = data.hash

			_.forEach(data.bets, function(entry) {
				var entryData = {
					user: entry.userData,
					selection: entry.selection,
					amount: entry.total,
					amountLocale: entry.total.toLocaleString()
				}

				var existing = false
				_.forEach(entries, function(entry) {
					if (entry.user.id == entryData.user.id && entry.selection == entryData.selection) {
						existing = true
						entry.amount += entryData.amount
						entry.amountLocale = entry.amount.toLocaleString()
					}
				})

				if (!existing) {
					entries.push(entryData)
				}
			})
			if (entries.length > 0) createListings()
			updateStats()
		})
	}

	function createListings() {
		if (rolling) return

		_.forEach(entries, function(entry) {
			var $selectedColor = $globalScope.find('.bet-panels .panel .segment[data-selection="' + entry.selection + '"] table.entries')

			if ($selectedColor.find('.listing').length < 1) {
				$selectedColor.mustache('roulette-entry', entry, {
					method: 'append'
				})
			} else if ($selectedColor.find('.listing .name[data-id="' + entry.user.id + '"]').length > 0) {
				var $element = $selectedColor.find('.listing .name[data-id="' + entry.user.id + '"]').parent()
				$element.attr('data-amount', entry.amount)
				$element.find('.wager').html(entry.amountLocale + ' <i class="hc"></i>')
			} else {
				$selectedColor.mustache('roulette-entry', entry, {
					method: 'append'
				})
			}

			$selectedColor.find('.listing').sort(function(a, b) {
					return +b.dataset.amount - +a.dataset.amount
				})
				.appendTo($selectedColor)
		})

		updateStats()
	}

	function updateStats() {
		$elements = {
			listings: $globalScope.find('.bet-panels .panel table.entries'),
			status: $globalScope.find('.roll .overlay .content')
		}

		if (!timer && currentGamesTab == 'roulette') {
			timer = setInterval(function() {
				if (timerVal < 0) {
					$elements.status.text('rolling')
					clearInterval(timer)
					return
				}

				$elements.status.text('rolling in ' + timerVal)
				timerVal--
			}, 1000)
		}

		//$elements.status.parent().find('.hash').text(hash)

		$globalScope.find('.bet-panels .panel .listing .name[data-id="' + user.id + '"]').parent().addClass('own')
		$globalScope.find('.bet-panels .panel .listing').removeClass('highest')
		$globalScope.find('.bet-panels .panel').find('.listing:eq(0)').addClass('highest')

		var totalBets = 0
		$globalScope.find('.bet-panels .panel .segment').each(function(i, item) {
			var total = 0
			$(item).find('.listing').each(function(o, otem) {
				total += parseInt($(otem).attr('data-amount'))
				totalBets += parseInt($(otem).attr('data-amount'))
			})
			$(item).find('.header .total').html(total.toLocaleString() + ' <i class="hc"></i>')
		})

		$('.games-menu .item[data-tab="roulette"] .status').html('<i class="hc"></i> ' + totalBets.toLocaleString())
	}

	function roll(winningNumber) {
		$('.games-menu .item[data-tab="roulette"] .status').html('<i class="hc"></i> 0')
		if (rolling || currentGamesTab != 'roulette' || route.getPage() != 'games') return
		rolling = true

		$el = {
			listings: $globalScope.find('.bet-panels .panel table.entries'),
			status: $globalScope.find('.roll .overlay .content'),
			rollList: $globalScope.find('.roll .list')
		}
		$el.status.text('rolling')
		$el.status.parent().removeClass('on')

		var winningNumberPosition = 0

		while ($el.rollList.children().length <= 75) {
			if (currentNumbers.length == 0)
				currentNumbers = numbers

			var number = currentNumbers[0]
			currentNumbers = _.without(currentNumbers, number)

			if ($el.rollList.children().length >= 45 && winningNumberPosition === 0) {
				if (number == winningNumber)
					winningNumberPosition = $el.rollList.children().length
			}

			var color
			if (number == 0)
				color = 'blue'
			else if (isOdd(number))
				color = 'black'
			else
				color = 'red'

			$el.rollList.append('<div class="number ' + color + '">' + number + '</div>')
		}

		var winningColor
		if (winningNumber == 0)
			winningColor = 'blue'
		else if (isOdd(winningNumber))
			winningColor = 'black'
		else
			winningColor = 'red'

		$el.rollList.find('.number:eq(' + winningNumberPosition + ')').text(winningNumber).removeClass('red blue black').addClass(winningColor)
		var ew = $el.rollList.find('.number:eq(0)').outerWidth()
		$el.rollList.width(ew * $el.rollList.find('.number').length)
		var offset = ew * winningNumberPosition
		offset += getRandomInt(5, ew - 5)

		if (!localSettings.noSounds) {
			$.playSound('/assets/sounds/roulette-roll')
		}

		$el.rollList.animate({
			left: '-=' + offset + 'px'
		}, 8000, 'easeOutQuint', function() {
			if (!rolling) return
			if (roulette.inGame()) updateUserBalance()

			// highlight entries
			var numType
			if (winningNumber == 0)
				numType = 2
			else if (isOdd(winningNumber))
				numType = 1
			else
				numType = 0

			$globalScope.find('.bet-panels .panel .segment[data-selection="' + numType + '"] .listing').addClass('won')
			$globalScope.find('.bet-panels .panel .segment').not('[data-selection="' + numType + '"]').find('.listing').addClass('lost')

			entries.map(usermap => {
				if (usermap.user.id == user.id && usermap.selection == numType) {
					var multiplier
					if (numType < 2)
						multiplier = 2
					else
						multiplier = 14

					if (!localSettings.noSounds) {
						$.playSound('/assets/sounds/win/win' + getRandomInt(1, 3))
					}

					tAlert('success', 'You have won ' + parseInt(usermap.amount * multiplier) + ' <i class="hc"></i> from Roulette', 'Roulette', true)
				}
			})

			setTimeout(function() {
				getLive()
				getHistory()

				if (!localSettings.noSounds) {
					$.playSound('/assets/sounds/game-reset')
				}
			}, 2000)
		})
	}

	function reset() {
		entries = []
		currentNumbers = numbers
		rolling = false
		clearInterval(timer)
		timer = null

		if ($globalScope) {
			$elements = {
				listings: $globalScope.find('.bet-panels .panel table.entries'),
				status: $globalScope.find('.roll .overlay .content'),
				rollList: $globalScope.find('.roll .list')
			}
			$elements.listings.empty()
			$elements.rollList.stop(true, true).empty().removeAttr('style')
			$elements.status.text('waiting').parent().addClass('on')
		}
	}

	function enter(selection) {
		var amount = parseInt($globalScope.find('.wager input').val())
		if (!isInt(amount)) {
			tAlert('error', 'Please enter a valid wager amount.', 'Roulette')
			return
		}

		if (!localSettings.noSounds) {
			$.playSound('/assets/sounds/buy/buy' + getRandomInt(1, 5))
		}

		socket.emit('roulette.join', selection, amount, function(err, data) {
			if (err) {
				tAlert('error', err, 'Roulette')
				return
			}
			if (data) {
				updateUserBalance()

				if (rolling) {
					tAlert('success', 'You have successfully entered the <b>next</b> roll.', 'Roulette', true)
				} else {
					tAlert('success', 'You have successfully entered the current roll.', 'Roulette', true)
				}
			}
		})
	}

	function getHistory() {
		socket.emit('roulette.getRecent', function(err, data) {
			if (err) {
				tAlert('error', err, 'Roulette')
				return
			}

			if (data.length > 10)
				data.length = 10

			var $el = $globalScope.find('.history .list')
			$el.empty()

			_.forEach(data, function(game) {
				var color
				if (game.winningOption == 0)
					color = 'blue'
				else if (isOdd(game.winningOption))
					color = 'black'
				else
					color = 'red'

				$el.append('<div class="number ' + color + '">' + game.winningOption + '</div>')
			})
		})
	}

	return {
		init: init,
		load: getLive,
		history: getHistory,
		reset: reset,
		roll: roll,
		isRolling: function() {
			return rolling
		},
		inGame: function() {
			if (_.includes(entries.map(usermap => {
					return usermap.user.id
				}), user.id)) return true
			else return false
		}
	}
})()

var jackpot = (function() {
	var $globalScope
	var initialized = false

	var status
	const colors = ['493657', 'F1FFFA', 'CE7DA5', 'FFD1BA', '447604', '6CC551', '52AD9C', 'BEE5BF', '47624F']
	var currentColors = colors
	var entries = []
	var timerVal,
		timer

	function init() {
		$globalScope = $('.inner-content.games .inner.jackpot .game')
		bind('init')

		if (initialized) return
		initialized = true

		socket.on('jackpot.newbet', function(data) {
			if (status != 'waiting') return
			console.log(data)
			console.log('new bet called')
			if (_.includes(entries.map(usermap => {
					return usermap.user.id
				}), data.userData.id)) {
				console.log('user has deposited already')
				_.forEach(data.items, function(item) {
					var itemData = {
						price: parseInt(item.price * 100),
						name: item.name,
						icon: item.icon_url
					}

					_.forEach(entries, function(user) {
						if (user.user.id == data.userData.id) {
							user.items.push(itemData)
						}
					})
				})
			} else {
				console.log('user has not deposited before')
				var color = currentColors[Math.floor(Math.random() * currentColors.length)]
				currentColors = _.without(currentColors, color)

				var entryData = {
					user: data.userData,
					color: color,
					items: []
				}

				_.forEach(data.items, function(item) {
					var itemData = {
						price: parseInt(item.price * 100),
						name: item.name,
						icon: item.icon_url,
						shown: false
					}
					entryData.items.push(itemData)
				})
				console.log(entryData)
				entries.push(entryData)
			}
			createListing()
		})

		socket.on('jackpot.change', function(data) {
			if (data.hasOwnProperty('winningUser') && status != 'rolling') {
				roll(data.winningUser)
			}
			if (status == 'waiting') {
				timerVal = parseInt(data.timeLeft)
				updateStats()
			}
		})
	}

	function debugEntry(v) {
		var data
		if (v == '1') {
			data = templateCall
		} else if (v == '2') {
			data = templateCall2
		} else return

		console.log(data)
		console.log('new bet called')
		if (_.includes(entries.map(usermap => {
				return usermap.user.id
			}), data.userData.id)) {
			console.log('user has deposited already')
			_.forEach(data.items, function(item) {
				var itemData = {
					price: parseInt(item.price * 100),
					name: item.name,
					icon: item.icon_url
				}

				_.forEach(entries, function(user) {
					if (user.user.id == data.userData.id) {
						user.items.push(itemData)
					}
				})
			})
		} else {
			console.log('user has not deposited before')
			var color = currentColors[Math.floor(Math.random() * currentColors.length)]
			currentColors = _.without(currentColors, color)

			var entryData = {
				user: data.userData,
				color: color,
				items: []
			}

			_.forEach(data.items, function(item) {
				var itemData = {
					price: parseInt(item.price * 100),
					name: item.name,
					icon: item.icon_url,
					shown: false
				}
				entryData.items.push(itemData)
			})
			console.log(entryData)
			entries.push(entryData)
		}
		createListing()
	}

	function getPot() {
		resetPot()

		socket.emit('jackpot.getLive', function(err, data) {
			if (err) {
				tAlert('error', err, 'Jackpot')
				return
			}

			if (!data) return
			if (data.live)
				status = 'waiting'
			timerVal = parseInt(data.timeLeft)

			$globalScope.find('.status .value.item-count small').text('/' + data.config.rules.round_limit)

			_.forEach(data.users, function(user) {
				var color = currentColors[Math.floor(Math.random() * currentColors.length)]
				currentColors = _.without(currentColors, color)

				var entryData = {
					user: user,
					color: color,
					items: []
				}

				if (_.includes(entries.map(usermap => {
						return usermap.user.id
					}), user.id)) return

				entries.push(entryData)
			})

			_.forEach(data.items, function(item) {
				_.forEach(entries, function(user) {
					if (item.owner == user.user.steam.steamid) {
						var itemData = {
							price: parseInt(item.price * 100),
							name: item.name,
							icon: item.icon_url,
							shown: false
						}

						user.items.push(itemData)
					}
				})
			})

			console.log(entries)
			createListing()
		})
	}

	function createListing() {
		if (entries.length < 1) return

		_.forEach(entries, function(entry) {
			var dupe = false

			if ($globalScope.find('.pot-entries .item[data-userid="' + entry.user.id + '"]').length > 0)
				dupe = true

			var entryData = {
				name: entry.user.username,
				id: entry.user.id,
				avatar: entry.user.avatarURL,
				steamid: entry.user.steam.steamid,
				color: entry.color,
				total: function() {
					var total = 0
					_.forEach(entry.items, function(item) {
						total += item.price
					})
					return total
				},
				totalLocale: function() {
					var total = 0
					_.forEach(entry.items, function(item) {
						total += item.price
					})
					return total.toLocaleString()
				},
				itemcount: entry.items.length
			}

			_.forEach(entry.items, function(item) {
				var itemData = {
					name: item.name,
					color: entry.color,
					icon: item.icon,
					price: item.price,
					priceLocale: item.price.toLocaleString()
				}

				if (!item.shown)
					item.shown = true
				else return

				if ($globalScope.find('.pot-items .item').length < 1) {
					$globalScope.find('.pot-items').mustache('jackpot-item', itemData, {
						method: 'append'
					})
				} else {
					$globalScope.find('.pot-items .item').each(function(i, element) {
						if (parseInt($(element).attr('data-price')) < item.price) {
							$(element).mustache('jackpot-item', itemData, {
								method: 'before'
							})
							return false
						} else if (i == $globalScope.find('.pot-items .item').length - 1) {
							$globalScope.find('.pot-items').mustache('jackpot-item', itemData, {
								method: 'append'
							})
						}
					})
				}
			})

			if (dupe) {
				console.log('[createListing] updating entry instead of creating')
				var $el = $globalScope.find('.pot-entries .item[data-userid="' + entry.user.id + '"]')
				$el.find('.money').html(entryData.totalLocale() + ' <i class="hc"></i>')
				$el.find('.item-count').text(entryData.itemcount + ' item(s)')
				$el.attr('data-amount', entryData.total())
			} else if ($globalScope.find('.pot-entries .item').length < 1) {
				console.log('[createListing] no other entries so appending')
				$globalScope.find('.pot-entries').mustache('jackpot-entry', entryData, {
					method: 'append'
				})
			} else {
				$globalScope.find('.pot-entries .item').each(function(i, item) {
					if (parseInt($(item).attr('data-amount')) < entryData.total()) {
						console.log('[createListing] prepending entry to ' + i + ' entry')
						$(item).mustache('jackpot-entry', entryData, {
							method: 'before'
						})
						return false
					} else if (i == $globalScope.find('.pot-entries .item').length - 1) {
						console.log('[createListing] appending entry after ' + i + ' entry')
						$globalScope.find('.pot-entries').mustache('jackpot-entry', entryData, {
							method: 'append'
						})
					}
				})
			}

			updateStats()
			bind('items')
		})
	}

	function resetPot() {
		entries = []
		currentColors = colors
		status = 'waiting'

		$elements = {
			status: {
				timer: $globalScope.find('.status .value.timer'),
				itemcount: $globalScope.find('.status .value.item-count span'),
				worth: $globalScope.find('.status .value.pot-worth')
			},
			containers: {
				potRoll: $globalScope.find('.pot-roll .entrylist'),
				potItems: $globalScope.find('.pot-items'),
				potEntries: $globalScope.find('.items.pot-entries')
			}
		}

		_.forEach($elements.status, function(value) {
			$(value).text('0')
		})

		_.forEach($elements.containers, function(value) {
			$(value).empty()
		})

		clearInterval(timer)
		$elements.status.timer.text('WAITING')

		$globalScope.find('.timer-progress').progress({
			percent: 0,
			showActivity: true
		})

		$('.pot-roll').hide()
		$('.pot-roll .entrylist').empty().removeAttr('style')
		$('.pot-items').show()
		$('.pot-entries').show()
	}

	function bind(type) {
		if (type == 'init') {
			var $enterButton = $globalScope.find('.enter-btn')
			$enterButton.off().click(function() {
				modal.open('jackpot-enter')
			})

			$('.inner-content.games .inner.jackpot .howto').off().click(() => {
				modal.open('help-jackpot')
			})
			// $('.inner-content.games .inner.jackpot .provably-fair').off().click(() => { modal.open('provably-fair')})
			$('.inner-content.games .inner.jackpot .provably-fair').off().click(() => {
				route.change('stats')
			})

		}
	}

	function updateStats() {
		$status = {
			timer: $globalScope.find('.status .value.timer'),
			itemcount: $globalScope.find('.status .value.item-count span'),
			worth: $globalScope.find('.status .value.pot-worth')
		}

		var total = 0
		var count = 0
		_.forEach(entries, function(entry) {
			_.forEach(entry.items, function(item) {
				total += item.price
				count++
			})
		})

		$status.itemcount.text(count)
		$status.worth.text(total.toLocaleString())

		if (entries.length > 1 && status == 'waiting') {
			clearInterval(timer)
			timer = setInterval(function() {
				if (timerVal < 0) {
					$status.timer.text('ROLLING')
					clearInterval(timer)
					return
				}
				$status.timer.text(timerVal)
				timerVal--
			}, 1000)
		} else {
			$status.timer.text('WAITING')
		}

		var potMax = $globalScope.find('.status .value.item-count small').text().split('/')[1]
		$globalScope.find('.timer-progress').progress({
			percent: parseInt((count / potMax) * 100),
			showActivity: true
		})
	}

	function history() {}

	function roll(winner) {
		if (route.getPage() != 'jackpot' && currentGamesTab != 'jackpot') return

		status = 'rolling'

		var $el = {
			entrylist: $globalScope.find('.pot-roll .entrylist'),
			potroll: $globalScope.find('.pot-roll'),
			items: $globalScope.find('.pot-items'),
			entries: $globalScope.find('.pot-entries')
		}

		var winnerWonItems = $globalScope.find('.status .value.item-count span').text()
		var winnerWonVal = $globalScope.find('.status .value.pot-worth').html()

		while ($el.entrylist.children().length <= 50) {
			var entry = $el.entries.find('.pot-entries .item').eq(getRandomInt(0, $globalScope.find('.pot-entries .item').length - 1)).find('img').attr('src')
			$globalScope.find('.pot-roll .entrylist').append('<img src="' + entry + '">')
		}

		$el.potroll.slideDown()
		$el.items.slideUp(function() {
			$(this).empty()
		})
		$el.entries.slideUp(function() {
			$(this).empty()
		})

		$el.entrylist.find('img:eq(40)').attr('src', winner.avatarURL)
		var ew = $el.entrylist.find('img:eq(0)').width()
		$el.entrylist.width(ew * $el.entrylist.find('img').length)
		var offset = ew * 40
		offset += getRandomInt(5, ew - 5)

		$el.entrylist.animate({
			left: '-=' + offset + 'px'
		}, 8000, 'easeOutQuint', function() {
			// if(winner.id == user.id) {
			//     tAlert('success', 'Congratulations, you\'ve just won '+ winnerWonItems +' items worth $'+ winnerWonVal, 'Jackpot');
			//     if(document.hidden) {
			//         tNotify('Jackpot', 'Congratulations, you\'ve just won '+ winnerWonItems +' items worth $'+ winnerWonVal, '#');
			//     }

			//     $('#confetti').fadeIn();
			//     setTimeout(function(){
			//         $('#confetti').fadeOut();
			//     }, 3500);
			// }

			setTimeout(function() {
				getPot()
			}, 2000)
		})
	}

	return {
		init: init,
		load: getPot,
		reset: resetPot,
		entries: function() {
			return entries
		},
		debug: debugEntry,
		roll: roll
	}
})()

var betting = (function() {
	var $globalScope
	var initialized = false

	var filter = {
		games: ['leagueoflegends', 'counterstrike_go', 'dota2', 'overwatch'],
		type: "upcoming"
	}

	function init() {
		$globalScope = $('.inner-content.games .inner.betting .game')
		bind('init')

		if (initialized) return
		initialized = true
	}

	function load() {
		// filter was changed
		$globalScope.find('.matches-container').addClass('loading').empty()

		if (filter.type == 'live') {
			socket.emit('matches.getLive', filter.games, function(err, data) {
				if (err) {
					tAlert('error', err, 'Matches')
					return
				}
				if (data.length > 30)
					data.length = 30
				createListing(data, filter)
			})
		} else if (filter.type == 'upcoming') {
			socket.emit('matches.getUpcoming', filter.games, function(err, data) {
				if (err) {
					tAlert('error', err, 'Matches')
					return
				}
				if (data.length > 30)
					data.length = 30
				createListing(data, filter)
			})
		} else if (filter.type == 'my') {
			socket.emit('toornament.getUserMatches', function(err, data) {
				if (err) {
					tAlert('error', err, 'Matches')
					return
				}
				if (data.length > 30)
					data.length = 30
				createListing(data, filter)
			})
		}
	}

	function createListing(data, filter) {
		var odd = false

		$.each(data, function(i, item) {
			// if it doesnt have the basics, skip
			if ($.isBlank(item.date)) {
				return
			}

			var start_time = new Date(item.date)

			// set up template
			var templateData = {
				id: item.id,
				odd: odd,
				live: null,
				liveAt: null,
				organizer: null,
				teams: [{
						id: null,
						logo: null,
						name: null,
						country_code: null,
						value: null,
						odds: null,
						percentage: null
					},
					{
						id: null,
						logo: null,
						name: null,
						country_code: null,
						value: null,
						odds: null,
						percentage: null
					}
				],
				game_icon: null,
				format: null
			}

			// get game_icon
			if (!$.isBlank(item.discipline)) {
				switch (item.discipline) {
					case 'counterstrike_go':
						templateData.game_icon = 'https://img.abiosgaming.com/games/flat-rectangular-cs-go-logo.jpg'
						break

					case 'dota2':
						templateData.game_icon = 'https://img.abiosgaming.com/games/flat-rectangular-Dota-logo.jpg'
						break

					case 'leagueoflegends':
						templateData.game_icon = 'https://img.abiosgaming.com/games/flat-rectangular-lol-logo.jpg'
						break

					case 'overwatch':
						templateData.game_icon = 'https://img.abiosgaming.com/games/thin-flat-overwatch-logo.png'
						break

					default:
						return
				}
			}

			// check for organizer
			if (!$.isBlank(item.tournament.full_name)) {
				templateData.organizer = item.tournament.full_name
			} else if (!$.isBlank(item.tournament.name)) {
				templateData.organizer = item.tournament.name
			}

			// format
			if (!$.isBlank(item.match_format)) {
				templateData.format = item.match_format.toUpperCase()
			}

			// format start time
			var diff = (Math.round(new Date(item.date).getTime() / 1000)) - Math.round(Date.now() / 1000)

			if (diff < -10 && filter.type == 'my') return

			if (diff < 0) {
				templateData.live = true
				templateData.liveAt = 'LIVE'
			} else {
				if (diff > 21600) { // over 6 hours, show date
					var weekday = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
					var day = weekday[start_time.getDay()]
					var hours = start_time.getHours()
					var mins = start_time.getMinutes()

					hours = hours < 10 ? '0' + hours : hours
					mins = mins < 10 ? '0' + mins : mins

					templateData.liveAt = day + ', ' + hours + ':' + mins
				} else {
					var h = Math.floor(diff / 3600) // Get whole hours
					if (h > 1) {
						templateData.liveAt = 'Live in ' + h + 'h'
					} else {
						diff -= h * 3600
						var m = Math.floor(diff / 60) // Get remaining minutes

						templateData.liveAt = 'Live in ' + m + 'm'
					}
				}
				templateData.live = false
			}

			// get teams if available
			if (!$.isBlank(item.opponents)) {
				for (var o = 0; o < item.opponents.length; o++) {
					if (!$.isBlank(item.opponents[o].participant)) {
						if (item.opponents[o].participant.id !== null) {
							templateData.teams[o].id = item.opponents[o].participant.id
						}
						if (!$.isBlank(item.opponents[o].participant.name)) {
							templateData.teams[o].name = item.opponents[o].participant.name
						}
						if (!$.isBlank(item.opponents[o].participant.logo)) {
							if (!$.isBlank(item.opponents[o].participant.logo.extra_small_square)) {
								templateData.teams[o].logo = item.opponents[o].participant.logo.extra_small_square
							}
						}
						if (!$.isBlank(item.opponents[o].participant.country)) {
							templateData.teams[o].country_code = (item.opponents[o].participant.country).toLowerCase()
						}
					}
				}
			}

			// check for bets
			var totalValue = 0
			if (!$.isBlank(item.betData)) {
				for (var o = 0; o < item.betData.length; o++) {
					if (item.betData[o].id !== null) {
						for (var e = 0; e < templateData.teams.length; e++) {
							if (templateData.teams[e].id == item.betData[o].teamID) {
								totalValue += item.betData[o].total
								templateData.teams[o].value = item.betData[o].total
							}
						}
					}
				}
			}

			if (totalValue > 0) {
				templateData.teams[0].odds = (1 / (templateData.teams[0].value / totalValue)).toFixed(3)
				templateData.teams[1].odds = (1 / (templateData.teams[1].value / totalValue)).toFixed(3)

				if (templateData.teams[0].odds == Infinity)
					templateData.teams[0].odds = '1.000'
				if (templateData.teams[1].odds == Infinity)
					templateData.teams[1].odds = '1.000'

				templateData.teams[0].percentage = ((1 / templateData.teams[0].odds) * 100).toFixed(2)
				templateData.teams[1].percentage = ((100 - (1 / templateData.teams[0].odds) * 100)).toFixed(2)
			} else {
				templateData.teams[0].percentage = (50).toFixed(2)
				templateData.teams[1].percentage = (50).toFixed(2)
				templateData.teams[0].odds = '1.000'
				templateData.teams[1].odds = '1.000'
			}

			// display product
			$globalScope.find('.matches-container').mustache('matches-listing-row', templateData, {
				method: 'append'
			})
			if (odd) {
				odd = false
			} else {
				odd = true
			}
		})

		// remove loading icon
		$globalScope.find('.matches-container').removeClass('loading')

		// animate listings
		$globalScope.find('.matches-container .row-card:hidden').transition({
			animation: 'fade',
			duration: 500,
			interval: 100
		})

		// animate/activate odds bars
		$globalScope.find('.matches-container .ui.progress').progress({
			showActivity: false,
			autoSuccess: false
		})

		// bind card clicks to match pages
		bind('listing')
	}

	function bind(type) {
		if (type == 'init') {
			var gameFilterCooldown

			$globalScope.find('.type .ui.dropdown').dropdown({
				onChange: function(value) {
					filter.type = value
					load()
				}
			})

			$globalScope.find('.games .ui.dropdown').dropdown({
				useLabels: false,
				onChange: function(value) {
					if (!value) {
						$globalScope.find('.games .ui.dropdown .text').text('4')
						filter.games = ['leagueoflegends', 'counterstrike_go', 'dota2', 'overwatch']
					} else {
						if ((value.split(',')).length == 1) {
							$globalScope.find('.games span.plural').hide()
						} else {
							$globalScope.find('.games span.plural').show()
						}
						filter.games = value.split(',')
					}

					clearTimeout(gameFilterCooldown)
					gameFilterCooldown = setTimeout(function() {
						load()
					}, 500)
				},
				message: {
					count: '{count}'
				}
			})

			$('.inner-content.games .inner.betting .howto').off().click(() => {
				modal.open('help-betting')
			})
		}

		if (type == 'listing') {
			$globalScope.find('.matches-container .match.row-card').click(function() {
				// tAlert('error', 'Match betting is currently disabled while we improve it, thank you for your patience.', 'Match Betting')
				// return

				var $el = $(this).find('.match-info .teams')
				var matchData = {
					bet: {
						matchid: $(this).attr('data-id'),
						teams: [{
								id: $el.find('.team.left').attr('data-id'),
								logo: $el.find('.team.left').attr('data-logo'),
								name: $el.find('.team.left').attr('data-name'),
								odds: $el.find('.team.left').attr('data-odds')
							},
							{
								id: $el.find('.team.right').attr('data-id'),
								logo: $el.find('.team.right').attr('data-logo'),
								name: $el.find('.team.right').attr('data-name'),
								odds: $el.find('.team.right').attr('data-odds')
							}
						]
					}
				}
				modal.open('bet-submit', matchData)
			})
		}
	}

	return {
		init: init,
		load: load
	}
})()

// Extra
function formatTime(date) {
	var hours = date.getHours()
	var minutes = date.getMinutes()
	var seconds = date.getSeconds()
	hours = hours < 10 ? '0' + hours : hours
	minutes = minutes < 10 ? '0' + minutes : minutes
	seconds = seconds < 10 ? '0' + seconds : seconds
	var strTime = hours + ':' + minutes + ':' + seconds
	return strTime
}

function updateUserBalance() {
	if (user.id) {
		socket.emit('user.get', function(err, data) {
			$('.acc-balance').text(data.credits.toLocaleString())
			user.balance = data.credits
		})
	}
}

function formatDate(date_n) {
	var date = new Date(date_n)

	var year = date.getFullYear()
	var month = date.getMonth()
	var day = date.getDate()
	var hours = date.getHours()
	var minutes = date.getMinutes()
	var seconds = date.getSeconds()
	month = month < 10 ? '0' + month : month
	day = day < 10 ? '0' + day : day
	hours = hours < 10 ? '0' + hours : hours
	minutes = minutes < 10 ? '0' + minutes : minutes
	seconds = seconds < 10 ? '0' + seconds : seconds

	var strTime = year + '-' + month + '-' + day + ' ' + hours + ':' + minutes + ':' + seconds
	return strTime
}

function tAlert(type, text, title, noSound) {
	switch (type) {
		case 'error':
			toastr.error(text, title)
			if (!localSettings.noSounds && !noSound) {
				$.playSound('/assets/sounds/error')
			}
			break

		case 'success':
			toastr.success(text, title)
			if (noSound) return
			if (!localSettings.noSounds) {
				$.playSound('/assets/sounds/success')
			}
			break

		case 'info':
			toastr.info(text, title)
			if (noSound) return
			if (!localSettings.noSounds) {
				$.playSound('/assets/sounds/info')
			}
			break

		default:
			console.error('ERROR: Alert not defined.')
	}
}

function tNotify(title, text, link) {
	if (document.hasFocus()) return
	if (!localSettings.notifications) return

	var notification = new Notification(title, {
		icon: './assets/img/notification.png',
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

function hexToRgb(hex) {
	var bigint = parseInt(hex, 16)
	var r = (bigint >> 16) & 255
	var g = (bigint >> 8) & 255
	var b = bigint & 255

	return r + ',' + g + ',' + b
}

function getRandomInt(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min
}

function isElementInViewport(el) {
	if (typeof jQuery === 'function' && el instanceof jQuery) {
		el = el[0]
	}
	var rect = el.getBoundingClientRect()
	return (
		rect.top >= 0 &&
		rect.left >= 0 &&
		rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) && /* or $(window).height() */
		rect.right <= (window.innerWidth || document.documentElement.clientWidth) /* or $(window).width() */
	)
}

function isInt(n) {
	return Number(n) === n && n % 1 === 0
}

function isFloat(n) {
	return Number(n) === n && n % 1 !== 0
}

function openLink(link) {
	var win = window.open(link, '_blank')
	win.focus()
}

function isOdd(num) {
	return (num % 2) == 1
}

jQuery.isBlank = function(obj) {
	if (!obj || $.trim(obj) === '') return true
	if (obj.length && obj.length > 0) return false

	for (var prop in obj)
		if (obj[prop]) return false
	return true
}
