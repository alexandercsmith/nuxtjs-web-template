require('dotenv').config()
import pkg from './package'
import webpack from 'webpack'
import axios from 'axios'

export default {
  mode: 'spa',

  head: {
    title: pkg.name,
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'keywords', name: 'keywords', content: 'one, two, three' },
      { hid: 'description', name: 'description', content: pkg.description }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css?family=Roboto&display=swap' }
    ]
  },

  env: {
    apiUrl: process.env.API_URL || '',
    cdnUrl: process.env.CDN_URL || ''
  },

  loading: { color: '#fff' },

  loadingIndicator: {
    name: 'pulse',
    color: '#000000',
    background: '#ffffff'
  },

  css: [ '~/assets/app.css' ],

  styleResources: {
    scss: [
      './assets/columns.scss',
      './assets/mixins.scss',
      './assets/vars.scss'
    ]
  },

  plugins: [
    '~/plugins/api.js',
    '~/plugins/icons.js',
    '~/plugins/init.js',
    '~/plugins/seo.js'
  ],

  modules: [
    '@nuxtjs/axios',
    '@nuxtjs/pwa',
    '@nuxtjs/dotenv',
    '@nuxtjs/sitemap',
    '@nuxtjs/toast',
    '@nuxtjs/style-resources',
    ['@nuxtjs/google-analytics', {
      id: process.env.ANALYTICS_ID,
      dev: false
    }]
  ],

  toast: {
    position: 'top-center',
    duration: 5000,
    fullWidth: true,
    fitToWidth: true,
    keepOnHover: true
  },

  generate: {
    routes: function() {
      return axios.get(`${process.env.CDN_URL}/data/blog.json`)
      .then((res) => {
        return res.articles.map((article) => {
          return {
            route: `/blog/${article.slug}`,
            payload: article
          }
        })
      })
    }
  },

  sitemap: {
    hostname: 'https://www._.com',
    gzip: true,
    cacheTime: 1000 * 60 * 15
  },

  build: {
    plugins: [
      new webpack.ProvidePlugin({
        '_': 'lodash'
      })
    ],
    extend(config, ctx) {
      if (ctx.isDev && ctx.isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/,
          options: {
            fix: true
          }
        })
      }
    }
  }
}
