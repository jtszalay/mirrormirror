<template lang="jade">
  div.logoCover
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
        'Mirror, Mirror': function () {
          this.showCover
        }.bind(this)
      }
    }
  },
  methods: {
    updateWidget: function () {
      var self = this
      
    },
    addSpeechCommands: function () {
      var self = this
      self.$dispatch('relay', {'target': 'speech', 'origin': 'logocover', 'directive': 'addcommands', 'message': self.speechCommands})
    },
    showCover: function () {
      console.log('Show Logo Cover')
    },
    hideCover: function () {
      console.log('Hide Logo Cover')
    },
    toggleCover: function () {
      console.log('toggle Cover')
    }
  },
  created: function () {
    this.addSpeechCommands()
  }
}
</script>


<style lang="stylus">

</style>