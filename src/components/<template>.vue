<template lang="jade">
  div.widget
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
      refreshTime: 24*3600*1000 // hours * seconds in an hour * mill
    }
  },
  methods: {
    updateWidget: function () {
      var self = this
      
    },
    addSpeechCommands: function () {
      var self = this
      self.$dispatch('relay', {'target': 'speech', 'origin': 'widget', 'directive': 'addcommands', 'message': self.speechCommands})
    }
  },
  created: function () {
    this.updateWidget()
    this.addSpeechCommands()
    setInterval(function () {
      this.updateWidget()
    }.bind(this), this.refreshTime)
  },
  events: {
    'widget': function (msg) {
      this.$emit(msg['directive'], msg)
    }
  }
}
</script>


<style lang="stylus">

</style>