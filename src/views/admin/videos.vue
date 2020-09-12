<template>
  <div class="container">
      <div>
          <select @change="getVideos">
              <option value="one">الصف الأول الثانوي</option>
              <option value="two">الصف الثاني الثانوي</option>
              <option value="three">الصف الثالث الثانوي</option>
          </select>
      </div>
      <div class="videos">
          <div v-for="vid in videos" :key="vid._id">
              <div>{{vid.number}}</div>
              <div>{{vid.name}}</div>
              <div>{{vid.stage}}</div>
              <video controls>
                  <source :src="vid.videoPath" type="video/mp4"/>
              </video>
              <div class="controls">
                  <i style="cursor:pointer" @click="()=>edit(vid._id)" class="fa fa-edit"/>
                  <i @click="()=>deleteVid(vid.publicId, vid.stage)" class="fa fa-remove"/>
              </div>
          </div>
      </div>
  </div>  
</template>

<script>
import axios from 'axios'
export default {
    data() {
        return {
            videos: [],
            id: ''
        }
    },
    methods: {
        getVideos(event) {
            axios.get('/fetchVideos/'+event.target.value).then( res => {
                this.videos = res.data.videos;
            });
        },
        edit(id) {
            this.$router.push({path: '/dashboard/uploadVideo/'+id});
        },
        deleteVid(id, stage) {
            axios('/deleteVideo/'+id+'/'+stage).then(res => {
                this.videos = res.data.videos
            })
        }
    }
}
</script>