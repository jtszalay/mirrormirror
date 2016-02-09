<template lang="jade">
  div#utils
    speech
    camera
    facerecognition
    lifx
  div#app
    clock
    photobooth
    weather
    greeting
  div#covers
    logocover
    sleepcover
    
</template>

<script>
import speech from './components/speech'
import clock from './components/clock'
import camera from './components/camera'
import photobooth from './components/photobooth'
import sleepcover from './components/sleepcover'
import logocover from './components/logocover'
import facerecognition from './components/facerecognition'
import weather from './components/weather'
import lifx from './components/lifx'
import greeting from './components/greeting'

export default {
  data () {
    return {
      state: 'default',
      context: 'default',
      user: ''
    }
  },
  components: {
    speech, logocover, clock, camera, sleepcover, photobooth, facerecognition, weather, lifx, greeting
  },
  events: {
    'relay': function (msg) {
      console.debug('relay', msg)
      this.$broadcast(msg['target'], msg)
    },
    'mirror': function (msg) {
      this.$emit(msg['directive'], msg)
    },
    'setContext': function (msg) {
      console.debug('Set context', msg)
    },
    'getContext': function (msg) {
      console.debug('Get context', msg)
    },
    'setState': function (msg) {
      console.debug('Set State', msg)
    },
    'getState': function (msg) {
      console.debug('Get State', msg)
    },
    'setUser': function (msg) {
      console.debug('Set User', msg)
      console.log(msg['message']['user'])
      if (this.user !== msg['message']['user']) {
        this.user = msg['message']['user']
        msg['target'] = '*'
        msg['origin'] = 'mirror'
        this.$broadcast('*', msg)
      }
    },
    'getUser': function (msg) {
      console.debug('Get User', msg)
    },
    'updateLayout': function (msg) {
      window.Vue.nextTick(function () {
        window.$('#app').isotope('layout')
      })
    }
  },
  'ready': function () {
    window.$('#app').isotope({
      // options
      itemSelector: '.item',
      percentPosition: true,
      layoutMode: 'masonry',
      masonry: {
        columnWidth: '.item',
        gutter: 10
      }
    })
    /*
    window.$('#app').packery({
      itemSelector: '.item',
      gutter: 10
    })
    window.$('#app').find('.item').each(function (i, itemElem) {
      // make element draggable with Draggabilly
      var draggie = new window.Draggabilly(itemElem)
      // bind Draggabilly events to Packery
      window.$('#app').packery('bindDraggabillyEvents', draggie)
    }) */
  }
}
</script>

<style lang="stylus">
@import url('https://fonts.googleapis.com/css?family=Roboto:400,100,100italic,700,300');

body {
	background-color: black;
  color: #fff;
  font-family: 'Roboto-Light', 'HelveticaNeue-UltraLight', 'Open Sans', sans-serif;
  font-weight: 300;
  height: 100%;
}
.item {
  width: 25%;
  margin-bottom: 10px;
}
</style>