<template>
  <div style="margin-top:100px;">
    <!-- <vue-record-audio @stream="onStream" @result="onResult1" /> -->
    <vue-record-video @stream="onStream" @result="onResult" />
    <video ref="vid" autoplay/>
    <video ref="vid2" autoplay/>
    <a ref="a"/>
  </div>
</template>

<script>
import io from 'socket.io-client'
export default {
    mounted() {
      // this.socket = io.connect('localhost:800');
      navigator.mediaDevices.getUserMedia({video: true, audio: true}).then(stream => {
         this.$refs.vid.srcObject = stream;
      })
    },
    data() {
      return {
        socket: io.connect('localhost:800'),
        imageBase64: null,
        videoUrl: null,
      }
    },
    methods: {
      onResult(data) {
        this.$refs.vid2.src = URL.createObjectURL(data);
      const blobToBase64 = function(blob, cb) {
        var reader = new FileReader();
        reader.readAsDataURL(data);
        reader.onload = function() {
          var dataUrl = reader.result;
          cb(dataUrl);
        }
      }
        blobToBase64(data, (base64) => { // encode
          // var a = document.createElement('a');
          // a.download = 'test.webc'
          // a.href = base64;
          // a.click();
          this.socket.emit('VIDEO', base64);
        })
      },
      onStream(stream) {
        console.log(stream);
        // this.socket.emit('VIDEO', stream);
      }
    },
    components:{
    }
}
</script>























var Peer = require('simple-peer')
var video = document.querySelector('video')

// get video/voice stream
navigator.mediaDevices.getUserMedia({
  video: true,
  audio: true
}).then(gotMedia).catch((err) => {console.error(err)})

function gotMedia(stream)  {
  if(localStorage.getItem('role')==1) {
    var peer1 = new Peer({ initiator: true, stream: stream })
    var peer2 = new Peer()
  } else {
    var peer2 = new Peer({ initiator: true, stream: stream })
    var peer1= new Peer()
  }

  peer1.on('signal', data => {
    peer2.signal(data)
  })

  peer2.on('signal', data => {
    peer1.signal(data)
  })

  peer2.on('stream', stream => {    
    if ('srcObject' in video) {
      video.srcObject = stream
    } else {
      video.src = window.URL.createObjectURL(stream) // for older browsers
    }

    video.play()
  })
  peer1.on('stream', stream => {    
    if ('srcObject' in video) {
      video.srcObject = stream
    } else {
      video.src = window.URL.createObjectURL(stream) // for older browsers
    }

    video.play()
  })
}
    },
    computed: {
        role() {
          return this.$store.getters.role;
        }