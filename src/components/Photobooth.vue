<template lang="jade">
  div.photobooth
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
        }.bind(this)
      }
    }
  },
  methods: {
    addSpeechCommands: function () {
      var self = this
      self.$dispatch('relay', {'target': 'speech', 'origin': 'photobooth', 'directive': 'addcommands', 'message': self.speechCommands})
    },
    takePhoto: function () {
      var self = this
      self.$dispatch('relay', {'target': 'camera', 'origin': 'photobooth', 'directive': 'getFrame'})
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
      console.log(msg)
    }
  }
}
</script>


<style lang="stylus">

</style>