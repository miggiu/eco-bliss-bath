const { defineConfig } = require('cypress')

module.exports = defineConfig({
  e2e: {
    baseUrl: 'http://localhost:4200',
  },
  env: {
    api_url: 'http://localhost:8081',
    login_url: '/login',
    products_url: '/products',
    cart_url: '/cart',
  },
})
