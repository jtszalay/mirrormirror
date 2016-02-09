<template lang="jade">
  div#clock.item.basic
    span.date {{ date }}
    br
    span.time {{ time }}
</template>

<script>
import moment from 'moment'

export default {
  data () {
    return {
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
      self.date = moment().format('dddd MMM Do YYYY')
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
  },
  watch: {
    'time': function () {
      this.$dispatch('mirror', {'target': 'mirror', 'origin': 'clock', 'directive': 'updateLayout'})
    }
  }
}
</script>

<style lang="stylus">
.date
    font-size 3vw

.time
    font-size 4vw
</style>