<template lang="jade">
  div#lifx
</template>

<script>
import { LIFX_APIKEY } from '../js/local.config.js'

var Small = {
  'zero': 0,
  'one': 1,
  'two': 2,
  'three': 3,
  'four': 4,
  'five': 5,
  'six': 6,
  'seven': 7,
  'eight': 8,
  'nine': 9,
  'ten': 10,
  'eleven': 11,
  'twelve': 12,
  'thirteen': 13,
  'fourteen': 14,
  'fifteen': 15,
  'sixteen': 16,
  'seventeen': 17,
  'eighteen': 18,
  'nineteen': 19,
  'twenty': 20,
  'thirty': 30,
  'forty': 40,
  'fifty': 50,
  'sixty': 60,
  'seventy': 70,
  'eighty': 80,
  'ninety': 90
}

var Magnitude = {
  'thousand': 1000,
  'million': 1000000,
  'billion': 1000000000,
  'trillion': 1000000000000,
  'quadrillion': 1000000000000000,
  'quintillion': 1000000000000000000,
  'sextillion': 1000000000000000000000,
  'septillion': 1000000000000000000000000,
  'octillion': 1000000000000000000000000000,
  'nonillion': 1000000000000000000000000000000,
  'decillion': 1000000000000000000000000000000000
}

var a, n, g

function text2num (s) {
  a = s.toString().split(/[\s-]+/)
  n = 0
  g = 0
  a.forEach(feach)
  return n + g
}

function feach (w) {
  var x = Small[w]
  if (x !== null) {
    g = g + x
  } else if (w === 'hundred') {
    g = g * 100
  } else {
    x = Magnitude[w]
    if (x !== null) {
      n = n + g * x
      g = 0
    } else {
      alert('Unknown number: ' + w)
    }
  }
}

export default {
  data () {
    return {
      // note: changing this line won't causes changes
      // with hot-reload because the reloaded component
      // preserves its current state and we are modifying
      // its initial state.
      speechCommands: {
        'turn on (:selector) (the) lights': function (selector) { console.log('turn on all lights'); this.turnOnLights(selector) }.bind(this),
        'turn off (:selector) (the) lights': function (selector) { console.log('turn off all lights'); this.turnOffLights(selector) }.bind(this),
        'wake up': function () { console.log('turn on all lights'); this.turnOnLights() }.bind(this),
        'good morning': function () { console.log('turn on all lights'); this.turnOnLights() }.bind(this),
        'good night': function () { console.log('turn on all lights'); this.turnOffLights() }.bind(this),
        'toggle (:selector) (the) lights': function (selector) { console.log('toggle all lights'); this.toggleLights(selector) }.bind(this),
        'set light color :color': function (color) { console.log('toggle all lights'); this.setColor(color) }.bind(this),
        'set light brightness :brightness (percent)': function (brightness) { console.log('toggle all lights'); this.setBrightness(brightness) }.bind(this),
        'set light level :brightness (percent)': function (brightness) { console.log('toggle all lights'); this.setBrightness(brightness) }.bind(this)
      },
      settings: {
        'async': true,
        'crossDomain': true,
        'headers': {
          'authorization': 'Basic ' + btoa(LIFX_APIKEY + ':'),
          'cache-control': 'no-cache'
        },
        'processData': false,
        'contentType': false,
        'mimeType': 'multipart/form-data'
      }
    }
  },
  methods: {
    addSpeechCommands: function () {
      var self = this
      self.$dispatch('relay', {'target': 'speech', 'origin': 'lifx', 'directive': 'addcommands', 'message': self.speechCommands})
    },
    // Light methods
    toggleLights: function (selector = 'all') {
      var form = new FormData()
      form.append('duration', '5')

      var settings = window.$.extend(true, {}, this.settings)
      settings['url'] = 'https://api.lifx.com/v1/lights/' + selector + '/toggle'
      settings['method'] = 'POST'
      settings['data'] = form

      window.$.ajax(settings).done(function (response) {
        console.log(response)
      })
    },
    turnOffLights: function (selector = 'all') {
      var form = new FormData()
      form.append('duration', '5')
      form.append('power', 'off')

      var settings = window.$.extend(true, {}, this.settings)
      settings['url'] = 'https://api.lifx.com/v1/lights/' + selector + '/state'
      settings['method'] = 'PUT'
      settings['data'] = form

      window.$.ajax(settings).done(function (response) {
        console.log(response)
      })
    },
    turnOnLights: function (selector = 'all') {
      var form = new FormData()
      form.append('duration', '5')
      form.append('power', 'on')

      var settings = window.$.extend(true, {}, this.settings)
      settings['url'] = 'https://api.lifx.com/v1/lights/' + selector + '/state'
      settings['method'] = 'PUT'
      settings['data'] = form

      window.$.ajax(settings).done(function (response) {
        console.log(response)
      })
    },
    setColor: function (color, selector = 'all') {
      var form = new FormData()
      form.append('color', color)

      var settings = window.$.extend(true, {}, this.settings)
      settings['url'] = 'https://api.lifx.com/v1/lights/' + selector + '/state'
      settings['method'] = 'PUT'
      settings['data'] = form

      window.$.ajax(settings).done(function (response) {
        console.log(response)
      })
    },
    setBrightness: function (brightness, selector = 'all') {
      var form = new FormData()
      form.append('brightness', isNaN(text2num(brightness)) ? brightness / 100 : text2num(brightness) / 100)

      var settings = window.$.extend(true, {}, this.settings)
      settings['url'] = 'https://api.lifx.com/v1/lights/' + selector + '/state'
      settings['method'] = 'PUT'
      settings['data'] = form

      window.$.ajax(settings).done(function (response) {
        console.log(response)
      })
    }
  },
  created: function () {
    this.addSpeechCommands()
  },
  events: {
    'lifx': function (msg) {
      this.$emit(msg['directive'], msg)
    },
    'turnOffLights': function (msg) {
      this.turnOffLights()
    },
    'turnOnLights': function (msg) {
      this.turnOnLights()
    },
    'toggleLights': function (msg) {
      this.toggleLights()
    }
  }
}
</script>

<style lang="stylus">

</style>