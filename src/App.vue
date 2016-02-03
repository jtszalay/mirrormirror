<template lang="jade">
  div#app
    clock
    camera
    weather
    speech
    photobooth
</template>

<script>
import Speech from './components/Speech'
import Clock from './components/Clock'
import Camera from './components/Camera'
import Weather from './components/Weather'
import Photobooth from './components/Photobooth'

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
    Speech, Clock, Camera, Weather, Photobooth
  },
  events: {
    'relay': function (msg) {
      console.debug('relay', msg)
      this.$broadcast(msg['target'], msg)
    },
    'mirror': function (msg) {
      this.$emit(msg['directive'], msg)
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