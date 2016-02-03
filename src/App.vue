<template lang="jade">
  div#app
    speech
    logocover
    sleepcover
    clock
    camera
    photobooth
    weather
</template>

<script>
import speech from './components/speech'
import clock from './components/clock'
import camera from './components/camera'
import photobooth from './components/photobooth'
import sleepcover from './components/sleepcover'
import logocover from './components/logocover'
import weather from './components/weather'

export default {
  data () {
    return {
      // note: changing this line won't causes changes
      // with hot-reload because the reloaded component
      // preserves its current state and we are modifying
      // its initial state.
      state: 'default',
      context: 'default'
    }
  },
  components: {
    speech, logocover, clock, camera, sleepcover, weather, photobooth
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