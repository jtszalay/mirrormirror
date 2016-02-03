<template lang="jade">
  div#clock
    span.date {{ date }}
    br
    span.time {{ time }}
</template>

<script>
import moment from 'moment'

export default {
  data () {
    return {
      // note: changing this line won't causes changes
      // with hot-reload because the reloaded component
      // preserves its current state and we are modifying
      // its initial state.
      date: '',
      time: '',
      speechCommands: {
        'what is today': function () {console.debug(moment().format('dddd MMMM Do YYYY'))},
        'what time is it': function () {console.debug(moment().format('HH:mm:ss'))}
      },
      refreshTime: 1000
    }
  },
  methods: {
    updateWidget: function () {
      var self = this
      self.date = moment().format('dddd MMMM Do YYYY')
      self.time = moment().format('HH:mm:ss')
    },
    addSpeechCommands: function () {
      var self = this
      self.$dispatch('relay', {'target': 'speech', 'origin': 'clock', 'directive': 'addcommands', 'message': self.speechCommands})
    }
  },
  created: function () {
    this.updateWidget()
    this.addSpeechCommands()
    setInterval(function () {
      this.updateWidget()
    }.bind(this), this.refreshTime)
  }
}
</script>


<style lang="stylus">
.date
    font-size 42px

.time
    font-size 110px
</style>