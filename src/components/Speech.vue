<template lang="jade">
  div#speech
    span {{ userSaid }}
</template>

<script>
import '../js/annyang'
import '../js/speechkitt.js'

export default {

  data () {
    return {
      listening: false,
      debug: false,
      userSaid: '',
      speechCommands: {
        /* '*allSpeech': function (allSpeech) {
          console.debug('catchall', allSpeech)
        } */
      },
      registeredCommands: []
    }
  },
  created: function () {
    var self = this
    if (window.annyang) {
      var annyang = window.annyang
      var SpeechKITT = window.SpeechKITT

      // Add our commands to annyang
      annyang.addCommands(this.speechCommands)
      for (var command in this.speechCommands) {
        console.debug('registered', command)
        self.registeredCommands.push(command)
      }

      // Tell KITT to use annyang
      SpeechKITT.annyang()

      // Define a stylesheet for KITT to use
      SpeechKITT.setStylesheet(require('../css/flat.css'))

      SpeechKITT.setInstructionsText('Try saying...')
      // self.showRandomCommand()
      setInterval(self.showRandomCommand, 11 * 1000)

      // Render KITT's interface
      SpeechKITT.vroom()

      SpeechKITT.toggleRecognition()

      annyang.addCallback('resultMatch', function (userSaid, commandText, phrases) {
        setTimeout(function () { self.userSaid = '' }, 4 * 1000)
        // console.log(userSaid); // sample output: 'hello'
        // console.log(commandText); // sample output: 'hello (there)'
        // console.log(phrases); // sample output: ['hello', 'halo', 'yellow', 'polo', 'hello kitty']
      })

      annyang.addCallback('resultNoMatch', function (userSaid, commandText, phrases) {
        setTimeout(function () { self.userSaid = '' }, 4 * 1000)
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
  methods: {
    showRandomCommand: function () {
      var rand = this.registeredCommands[Math.floor(Math.random() * this.registeredCommands.length)]
      window.SpeechKITT.setSampleCommands([rand])
    }
  },
  events: {
    'speech': function (msg) {
      console.debug('speech', msg)
      this.$emit(msg['directive'], msg)
    },
    'addcommands': function (msg) {
      window.annyang.addCommands(msg['message'])
      for (var command in msg['message'].valueOf()) {
        console.debug('registered', command)
        this.registeredCommands.push(command)
      }
    }
  }
}
</script>

<style>

</style>