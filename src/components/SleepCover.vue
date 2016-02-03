<template lang="jade">
  div.sleepCover
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
        },
        'wake up': function () {
          console.debug('wake up')
        },
        'good night': function () {
          console.debug('good night. go to sleep')
        },
        'good morning': function () {
          console.debug('wake up. good morning.')
        }
      }
    }
  },
  methods: {
    addSpeechCommands: function () {
      var self = this
      self.$dispatch('relay', {'target': 'speech', 'origin': 'sleepcover', 'directive': 'addcommands', 'message': self.speechCommands})
    },
    showCover: function () {
      console.log('Show Logo Cover')
    },
    hideCover: function () {
      console.log('Hide Logo Cover')
    }
  },
  created: function () {
    this.addSpeechCommands()
  }
}
</script>


<style lang="stylus">
#sleep-cover {
  background-color: black;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 998;
  display: none;
}
</style>