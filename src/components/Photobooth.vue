<template lang="jade">
  div#photobooth
    img
</template>

<script>

export default {
  data () {
    return {
      // note: changing this line won't causes changes
      // with hot-reload because the reloaded component
      // preserves its current state and we are modifying
      // its initial state.
      speechCommands: {
        'take a photo': function () {
          this.takePhoto()
        }.bind(this),
        'clear photo': function () {
          this.clearPhoto()
        }.bind(this),
        'take a selfie': function () {
          this.takePhoto()
        }.bind(this)
      }
    }
  },
  methods: {
    addSpeechCommands: function () {
      var self = this
      self.$dispatch('relay', {'target': 'speech', 'origin': 'photobooth', 'directive': 'addcommands', 'message': self.speechCommands})
    },
    playShutter: function () {
      var shutter = new Audio()
      shutter.autoplay = false
      shutter.src = navigator.userAgent.match(/Firefox/) ? require('../assets/shutter.ogg') : require('../assets/shutter.mp3')
      shutter.play()
    },
    takePhoto: function () {
      var self = this
      self.playShutter()
      self.$dispatch('relay', {'target': 'camera', 'origin': 'photobooth', 'directive': 'getFrame'})
    },
    clearPhoto: function () {
      var self = this
      self.$el.firstChild.src = ''
    }
  },
  created: function () {
    this.addSpeechCommands()
  },
  events: {
    'photobooth': function (msg) {
      this.$emit(msg['directive'], msg)
    },
    'receiveFrame': function (msg) {
      console.debug(msg)
      this.$el.firstChild.src = msg['message']['dataURL']
    }
  }
}
</script>


<style lang="stylus">

</style>