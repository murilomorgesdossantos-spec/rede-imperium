import { io } from 'https://cdn.socket.io/4.7.4/socket.io.esm.min.js'

let session = localStorage.getItem('checkout-session')
if (!session) localStorage.setItem('checkout-session', (session = crypto.randomUUID()))

const CentralCart = {
  host: location.host,
  /**
   *
   * @param {string} path
   * @param {Object} data
   * @param {'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' } method
   * @returns {Promise<{status: number, data?: object}>}
   */
  fetch: async function (path = '', data, method) {
    const options = {}
    if (data) {
      options.body = JSON.stringify(data)
      options.headers = {
        'Content-Type': 'application/json',
      }
    }
    if (method) options.method = method

    return fetch(location.protocol + '//' + this.host + path, options).then(async (res) => {
      const response = { status: res.status }

      try {
        const data = await res.json()
        response.data = data
      } catch { }

      if (res.ok) return response

      return Promise.reject(response)
    })
  },

  cartAdd: async function (package_id, options = {}) {
    return this.fetch(`/cart/add/${package_id}`, { options }, 'POST')
  },

  cartRemove: async function (package_id) {
    return this.fetch(`/cart/remove/${package_id}`, {}, 'POST')
  },

  cartSetOptions: async function (package_id, options = {}) {
    return this.fetch(`/cart/set/${package_id}`, { options }, 'POST')
  },

  cartSetQuantity: async function (package_id, quantity) {
    return this.fetch(`/cart/set/${package_id}/${quantity}`, {}, 'POST')
  },

  cartClear: async function () {
    return this.fetch(`/cart/clear`, {}, 'POST')
  },

  attachCoupon: async function (code) {
    return this.fetch(`/cart/coupon/${code}`, {}, 'PUT')
  },

  detachCoupon: async function () {
    return this.fetch(`/cart/coupon`, {}, 'DELETE')
  },

  getRoblox: async function (username) {
    return this.fetch(`/rest/roblox?username=${username}`, undefined, 'GET')
  },

  _applications: {},
  requestDiscord: function () {
    return new Promise((resolve) => {
      window.open(`/oauth/discord/${session}`, '_blank', 'width=640;height=640')

      this._applications.discord = function (data) {
        const avatar_url = data.avatar
          ? `https://cdn.discordapp.com/avatars/${data.id}/${data.avatar}.png`
          : `https://cdn.discordapp.com/embed/avatars/${Math.floor(Math.random() * 5) + 1}.png`

        resolve({
          id: data.id,
          display_name: data.username,
          avatar_url,
        })
      }
    })
  },

  requestGoogle: function () {
    return window.location.href = `/oauth/google`
  },

  requestOtp: function (email) {
    return this.fetch('/auth/otp', { email }, 'POST')
  },

  verifyOtp: function (email, code) {
    return this.fetch('/auth/verify', { email, code }, 'POST')
  },

  logout: function () {
    return this.fetch('/logout', undefined, 'GET')
  },

  /**
   *
   * @param {Object} data
   * @param {string} data.gateway
   * @param {string} data.client_email
   * @param {string} data.client_identifier
   * @param {string} data.client_name
   * @param {string} data.client_phone
   * @param {string} data.client_document
   * @param {string} data.client_discord
   * @param {string} data.terms
   * @returns
   */
  checkout: async function (data) {
    return this.fetch('/cart/checkout', data, 'POST')
  },

  /**
   * 
   * @param {string} order_id 
   * @returns 
   */
  getOrderStatus: async function (order_id) {
    return this.fetch(`/order_status/${order_id}`, undefined, 'GET')
  },
}

if (['/cart', '/checkout'].includes(location.pathname)) {
  const is_local =
    location.hostname.endsWith('.localhost') ||
    location.hostname === 'localhost' ||
    location.hostname === '127.0.0.1'

  const socket = io(is_local ? 'ws://localhost:3394' : 'wss://ws.centralcart.io', {
    transports: ['websocket'],
    auth: {
      'session_id': session,
      'x-extension': 'checkout',
    },
  })

  socket.on(`DiscordResponse.${session}`, (message) => {
    CentralCart._applications.discord(message)
  })
}

window.CentralCart = CentralCart
