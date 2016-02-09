<template lang="jade">
  div#greeting.item
    h1 {{ greeting }}
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
      },
      greeting: '',
      refreshTime: 24 * 3600 * 1000 // hours * seconds in an hour * mill
    }
  },
  methods: {
    addSpeechCommands: function () {
      var self = this
      self.$dispatch('relay', {'target': 'speech', 'origin': 'greeting', 'directive': 'addcommands', 'message': self.speechCommands})
    }
  },
  created: function () {
    this.addSpeechCommands()
  },
  events: {
    'greeting': function (msg) {
      this.$emit(msg['directive'], msg)
    },
    '*': function (msg) {
      if (msg['directive'] === 'setUser' && msg['message']['user'] === 'Nobody') {
        this.greeting = ''
      } else if (msg['directive'] === 'setUser' && msg['message']['user'] === 'Unknown') {
        this.greeting = 'Hello!'
      } else if (msg['directive'] === 'setUser' && msg['message']['user']) {
        this.greeting = 'Hello, ' + msg['message']['user'] + '!'
      }
    }
  }
}
</script>

<style lang="stylus">

</style>