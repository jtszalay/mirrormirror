<template lang="jade">
  div#app
    h1 Hello, {{ user }}
    speech
    weather
    logocover
    sleepcover
    clock
    camera
    photobooth
    facerecognition
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

export default {
  data () {
    return {
      state: 'default',
      context: 'default',
      user: ''
    }
  },
  components: {
    speech, logocover, clock, camera, sleepcover, photobooth, facerecognition, weather
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
    }
  }
}
</script>

<style>
body {
	background-color: black;
  color: #fff;
  font-family: 'HelveticaNeue-UltraLight', 'Open Sans', sans-serif;
  font-weight: 300;
}
</style>