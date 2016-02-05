<template lang="jade">
  div#sleepcover
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
        'go to sleep': function () {
          console.debug('go to sleep')
          this.showCover()
        }.bind(this),
        'wake up': function () {
          console.debug('wake up')
          this.hideCover()
        }.bind(this),
        'good night': function () {
          console.debug('good night. go to sleep')
          this.showCover()
        }.bind(this),
        'good morning': function () {
          console.debug('wake up. good morning.')
          this.hideCover()
        }.bind(this)
      }
    }
  },
  methods: {
    addSpeechCommands: function () {
      var self = this
      self.$dispatch('relay', {'target': 'speech', 'origin': 'sleepcover', 'directive': 'addcommands', 'message': self.speechCommands})
    },
    showCover: function () {
      this.state = true
      window.$('#sleepcover').fadeIn(3500)
      console.debug('Show sleep Cover')
    },
    hideCover: function () {
      this.state = false
      window.$('#sleepcover').fadeOut(3500)
      console.debug('Hide sleep Cover')
    },
    toggleCover: function () {
      this.state = !this.state
      window.$('#sleepcover').fadeToggle(3500)
      console.debug('Toggle sleep Cover')
    }
  },
  created: function () {
    this.addSpeechCommands()
  },
  events: {
    '*': function (msg) {
      if (msg['directive'] === 'setUser' && msg['message']['user'] === 'Nobody') {
        this.state = this.state// true
      }
    }
  }
}
</script>

<style lang="stylus">
#sleepcover {
  display: none;
  background-color: black;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 998;
}
</style>