<template lang="jade">
  div#logocover
    img(src='../assets/cover.png')
</template>

<script>
export default {
  data () {
    return {
      state: false,
      speechCommands: {
        'mirror mirror (on the wall)': function () {
          this.showCover()
        }.bind(this),
        'who is the fairest of them all': function () {
          this.hideCover()
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
      window.$('#logocover > img').fadeIn(3500)
      console.debug('Show Logo Cover')
    },
    hideCover: function () {
      this.state = false
      window.$('#logocover > img').fadeOut(3500)
      console.debug('Hide Logo Cover')
    },
    toggleCover: function () {
      this.state = !this.state
      window.$('#logocover > img').fadeToggle(3500)
      console.debug('toggle Cover')
    }
  },
  created: function () {
    this.addSpeechCommands()
  }
}
</script>

<style lang="stylus">
#logocover > img {
  display: none;
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