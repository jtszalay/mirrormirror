<template lang="jade">
  div#logoCover
    img#cover(src='../assets/cover.png' v-show='state')
</template>

<script>

export default {
  data () {
    return {
      // note: changing this line won't causes changes
      // with hot-reload because the reloaded component
      // preserves its current state and we are modifying
      // its initial state.
      state: false,
      speechCommands: {
        'mirror mirror (on the wall)': function () {
          this.showCover()
        }.bind(this)
      }
    }
  },
  methods: {
    addSpeechCommands: function () {
      var self = this
      self.$dispatch('relay', {'target': 'speech', 'origin': 'logocover', 'directive': 'addcommands', 'message': self.speechCommands})
    },
    showCover: function () {
      this.state = true
      console.debug('Show Logo Cover')
    },
    hideCover: function () {
      this.state = false
      console.debug('Hide Logo Cover')
    },
    toggleCover: function () {
      this.state = !this.state
      console.debug('toggle Cover')
    }
  },
  created: function () {
    this.addSpeechCommands()
  }
}
</script>


<style lang="stylus">
#cover {
  background-color: black;
  position: absolute;
  margin: auto;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  width: 100%;
  z-index: 999;
}
</style>