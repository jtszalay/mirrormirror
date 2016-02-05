<template lang="jade">
  div#facerecognition(v-show='hidden')
    span {{ face }}
    br
    img#annotated_frame(width='430px' v-bind="{src:annotated_face}")
</template>

<script>
export default {
  data () {
    return {
      speechCommands: {

      },
      hidden: false,
      socket: null,
      annotated_face: '',
      face: '',
      defaultTok: 1,
      defaultNumNulls: 20,
      tok: 1, // defaultTok
      people: [],
      defaultPerson: -1,
      images: [],
      identitiesFound: [],
      training: false,
      numNulls: 0,
      sentTimes: [],
      receivedTimes: [],
      refreshTime: 24 * 3600 * 1000 // hours * seconds in an hour * mill
    }
  },
  methods: {
    createSocket: function () {
      var self = this
      var address = window.location.hostname
      var socket = socket = new WebSocket('wss:' + address + ':9001')
      socket.binaryType = 'arraybuffer'
      socket.onopen = function () {
        console.debug('facerecognition socket connect: ', address)
        socket.send(JSON.stringify({'type': 'NULL'}))
        console.time('startPage')
      }
      socket.onmessage = function (e) {
        console.info(e)
        var j = JSON.parse(e.data)
        if (j.type === 'NULL') {
          console.info('null')
          self.receivedTimes.push(new Date())
          self.numNulls++
          if (self.numNulls === self.defaultNumNulls) {
            self.sendState()
            self.sendFrameLoop()
            console.timeEnd('startPage')
          } else {
            self.socket.send(JSON.stringify({'type': 'NULL'}))
            self.sentTimes.push(new Date())
          }
        } else if (j.type === 'PROCESSED') {
          console.info('PROCESSED')
          self.tok++
        } else if (j.type === 'DB_LIST') {
          console.info('DB_LIST')
          // alert('DB_LIST: ' + j.list.length);
          // console.log(j)
          var loopCnt = 0
          console.time('addtimer')
          for (var i = 0; i < j.list.length; i++) {
            loopCnt++
            var db_info = j.list[i]
            self.images.push({
              hash: db_info.hash,
              identity: db_info.identity,
              image: db_info.path,
              representation: db_info.representation
            })
            self.people[db_info.identity] = db_info.name
          };
          console.timeEnd('addtimer')
          console.log('loop times: %d, and images: %d', loopCnt, self.images.length)
          console.time('redrawPeople')
          self.defaultPerson = self.people.length - 1
          // redrawPeople()
          console.timeEnd('redrawPeople')
        } else if (j.type === 'NEW_IMAGE') {
          console.info('NEW_IMAGE')
          self.images.push({
            hash: j.hash,
            identity: j.identity,
            image: j.path,
            representation: j.representation
          })
          // redrawPeople()
          self.people[j.identity] = j.name
        } else if (j.type === 'IDENTITIES') {
          console.info('IDENTITIES')
          /*
          var h = 'Last updated: ' + (new Date()).toTimeString()
          h += '<ul>'
          */
          var len = j.identities.length
          self.identitiesFound = []
          var identity = ''
          if (len > 0) {
            var idIdx
            if (len === 1) {
              idIdx = j.identities[0]
              if (idIdx !== -1) {
                identity = self.people[idIdx]
              } else if (idIdx === -1) {
                identity = 'Unknown'
              }
              self.face = identity
              // console.log(identity)
              self.$dispatch('mirror', {'target': 'mirror', 'origin': 'facerecognition', 'directive': 'setUser', 'message': {'user': identity}})
            } else {
              identity = 'Unknown'
              self.$dispatch('mirror', {'target': 'mirror', 'origin': 'facerecognition', 'directive': 'setUser', 'message': {'user': identity}})
            }
            for (var k = 0; i < len; i++) {
              // var identity = ''
              idIdx = j.identities[k]
              if (idIdx !== -1) {
                // identity = self.people[idIdx]
                self.identitiesFound.push(self.people[idIdx])
                // h += '<li>' + identity + '</li>';
              } else if (idIdx === -1) {
                self.identitiesFound.push('Unknown')
                self.face = 'Unknown'
                // h += '<li>Unknown Person</li>';
              }
            }
          } else {
            self.identitiesFound.push('Nobody')
            identity = 'Nobody'
            self.$dispatch('mirror', {'target': 'mirror', 'origin': 'facerecognition', 'directive': 'setUser', 'message': {'user': identity}})
            self.face = 'Nobody'
            // h += '<li>Nobody detected.</li>';
          }
          // console.log('identitiesFound: ', self.identitiesFound)
          /*
          h += '</ul>'
          window.$('#peopleInVideo').html(h);
          */
        } else if (j.type === 'ANNOTATED') {
          console.info('ANNOTATED')
          self.annotated_face = j['content']
          /*
          window.$('#detectedFaces').html(
            '<img src=\'' + j['content'] + '\' width=\'430px\'></img>'
          )*/
        } else {
          console.error('Unrecognized message type: ' + j.type)
        }
      }
      socket.onerror = function (e) {
        console.debug('Error creating WebSocket connection to ' + address)
        console.debug('facerecognition socket error: ', e)
      }
      socket.onclose = function (e) {
        console.debug('facerecognition socket closed: ', e)
      }
      self.socket = socket
    },
    sendFrameLoop: function () {
      var self = this
      if (self.socket === null || self.socket.readyState !== self.socket.OPEN ||
        // !vidReady ||
        self.numNulls !== self.defaultNumNulls) {
        return
      }

      if (self.tok > 0) {
        self.getFrame()
      }
      setTimeout(function () {window.requestAnimFrame(self.sendFrameLoop)}, 250)
      return self
    },
    sendState: function () {
      var self = this
      var msg = {
        'type': 'ALL_STATE',
        'images': self.images,
        'people': self.people,
        'training': self.training
      }
      self.socket.send(JSON.stringify(msg))
    },
    addSpeechCommands: function () {
      var self = this
      self.$dispatch('relay', {'target': 'speech', 'origin': 'facerecognition', 'directive': 'addcommands', 'message': self.speechCommands})
    },
    getFrame: function () {
      var self = this
      self.$dispatch('relay', {'target': 'camera', 'origin': 'facerecognition', 'directive': 'getFrame'})
    }
  },
  created: function () {
    this.createSocket()
    this.addSpeechCommands()
  },
  events: {
    'facerecognition': function (msg) {
      this.$emit(msg['directive'], msg)
    },
    'receiveFrame': function (msg) {
      var self = this
      console.debug(msg)
      var frameType = 'FRAME'
      /* if (self.training) {
          frameType = 'TrainingFRAME'
      } */
      var outmsg = {
        'type': frameType,
        'dataURL': msg['message']['dataURL'],
        'identity': self.defaultPerson
      }
      // console.log(msg)
      self.socket.send(JSON.stringify(outmsg))
      self.tok--
    }
  }
}
</script>

<style lang="stylus">
</style>