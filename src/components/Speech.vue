<template lang="jade">
  div#speech
    span {{ userSaid }}
</template>

<script>
import '../js/annyang'
import '../js/speechkitt.min.js'

export default {

  data () {
    return {
      // note: changing this line won't causes changes
      // with hot-reload because the reloaded component
      // preserves its current state and we are modifying
      // its initial state.
      listening: false,
      debug: true,
      userSaid: '',
      speechCommands: {
        '*allSpeech': function (allSpeech) {
          console.debug('catchall', allSpeech)
        }
      }
    }
  },
  created: function () {
    var self = this
    if (window.annyang) {
      var annyang = window.annyang
      var SpeechKITT = window.SpeechKITT

      // Add our commands to annyang
      annyang.addCommands(this.speechCommands)

      // Tell KITT to use annyang
      SpeechKITT.annyang()

      // Define a stylesheet for KITT to use
      SpeechKITT.setStylesheet(require('../css/flat.css'))

      // Render KITT's interface
      SpeechKITT.vroom()

      SpeechKITT.toggleRecognition()

      annyang.addCallback('resultMatch', function (userSaid, commandText, phrases) {
        setTimeout(function () { self.userSaid = '' }, 4000)
        // console.log(userSaid); // sample output: 'hello'
        // console.log(commandText); // sample output: 'hello (there)'
        // console.log(phrases); // sample output: ['hello', 'halo', 'yellow', 'polo', 'hello kitty']
      })

      annyang.addCallback('resultNoMatch', function (userSaid, commandText, phrases) {
        setTimeout(function () { self.userSaid = '' }, 4000)
        // console.log(userSaid); // sample output: 'hello'
        // console.log(commandText); // sample output: 'hello (there)'
        // console.log(phrases); // sample output: ['hello', 'halo', 'yellow', 'polo', 'hello kitty']
      })

      annyang.addCallback('interimResult', function (userSaid, commandText, phrases) {
        self.userSaid = userSaid
        // console.log(userSaid) // sample output: 'hello'
        // console.log(commandText); // sample output: 'hello (there)'
        // console.log(phrases); // sample output: ['hello', 'halo', 'yellow', 'polo', 'hello kitty']
      })

      annyang.addCallback('error', function (e) {
        console.error(e) // sample output: 'hello'
      })

      annyang.debug(this.debug)
    }
  },
  events: {
    'speech': function (msg) {
      this.$emit(msg['directive'], msg)
    },
    'addcommands': function (msg) {
      window.annyang.addCommands(msg['message'])
    }
  }
}
</script>


<style>

</style>