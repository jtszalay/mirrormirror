import Vue from 'vue'
import App from './App'

global.jQuery = require('jquery')
var $ = global.jQuery
window.$ = $
window.Vue = Vue

/* eslint-disable no-new */
new Vue({
  el: 'body',
  components: { App }
})
