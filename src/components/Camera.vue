<template lang="jade">
  div#camera
    video#videoel(width="400" height="300" preload="auto" loop  v-show='hidden')
</template>

<script>
window.requestAnimFrame = (function () {
  return window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    function (/* function FrameRequestCallback */ callback, /* DOMElement Element */ element) {
      return window.setTimeout(callback, 1000 / 60)
    }
})()

navigator.getUserMedia = navigator.getUserMedia ||
  navigator.webkitGetUserMedia ||
  navigator.mozGetUserMedia ||
  navigator.msGetUserMedia

window.URL = window.URL ||
  window.webkitURL ||
  window.msURL ||
  window.mozURL

export default {
  data () {
    return {
      state: false,
      hidden: false
    }
  },
  methods: {
    getFrame: function () {
      var self = this
      var vid = self.$el.firstChild
      var canvas = document.createElement('canvas')
      canvas.width = vid.width
      canvas.height = vid.height
      var cc = canvas.getContext('2d')
      cc.drawImage(vid, 0, 0, vid.width, vid.height)
      // var apx = cc.getImageData(0, 0, vid.width, vid.height)
      var dataURL = canvas.toDataURL('image/jpeg', 0.6)
      return dataURL
    },
    umSuccess: function (stream) {
      var vid = document.getElementById('videoel')
      if (vid.mozCaptureStream) {
        vid.mozSrcObject = stream
      } else {
        vid.src = (window.URL && window.URL.createObjectURL(stream)) ||
          stream
      }
      vid.play()
    }
  },
  created: function () {
    if (navigator.getUserMedia) {
      var videoSelector = {video: true}
      navigator.getUserMedia(videoSelector, this.umSuccess, function () {
        alert('Error fetching video from webcam')
      })
    } else {
      alert('No webcam detected.')
    }
  },
  events: {
    'camera': function (msg) {
      this.$emit(msg['directive'], msg)
    },
    'getFrame': function (msg) {
      this.$dispatch('relay', { 'target': msg['origin'], 'origin': 'camera', 'directive': 'receiveFrame', 'message': { 'dataURL': this.getFrame() } })
    }
  }
}
</script>


<style lang="stylus">
#videoel
  transform: rotateY(180deg)
  -webkit-transform:rotateY(180deg) /* Safari and Chrome */
  -moz-transform:rotateY(180deg) /* Firefox */
</style>