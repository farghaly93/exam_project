<template>
    <div class="row" style="background-color:#666;margin-top:60px;padding:20px;">
        <h2 style="color:#fff;" class="col-md-12 text-center">البث المباشر</h2>
        <div v-if="role==1" class="col-md-2">
            <div class="viewers" style="height:500px;overflow-y:scroll;padding:10px;" ref="viewers">
                <div v-for="user in stage_users" :key="user._id" :class="viewers.includes(user._id)?'active':'deactive'">
                    <div style="font-size:14px;color:#fff;">{{user.fullname}}</div>
                    <div style="font-size:12px;color:#fff;font-weight:bold;">{{user.phone}}</div>
                </div>
            </div>
        </div>
            <div :class="role==1?'col-md-6':'col-md-8'">
                <div v-if="role == 1">
                    <select class="form-control" @change="getStagrUsers" ref="stage">
                        <option value="one">الصف الأول الثانوي</option>
                        <option value="two">الصف الثاني الثانوي</option>
                        <option value="three">الصف الثالث الثانوي</option>
                    </select>
                    
                    <div style="display:flex;flex-direction:row;justify-content:space-between">
                        <div class="">
                            <div class="btn-group" role="group" aria-label="Basic example">
                                <button :disabled="live" class="btn btn-primary" @click="start_live">Start live</button>
                                <button :disabled="!live" class="btn btn-danger" @click="stop_live">Stop live</button>
                                <button type="button" class="btn btn-secondary">{{live_timer}}</button>
                            </div>
                        </div>
                        <div class="">
                            <vue-record-video ref="rec" v-if="role==1" v-show="false" @stream="recording" @result="finish_record"  />
                            <div v-if="role == 1" class="btn-group" role="group" aria-label="Basic example">
                                <button style="color:red;" v-if="record==='stop'||record==='pause'" type="button" id="button_play" class="btn" @click="start_record">
                                    <i class="fa fa-circle"></i>
                                </button>
                                <button v-if="record==='start'||record==='resume'" type="button" id="button_play" class="btn" @click='pause_record'>
                                    <i class="fa fa-pause"></i>
                                </button>
                                
                                <button type="button" id="button_stop" class="btn" @click='stop_record'>
                                    <i class="fa fa-stop"></i>
                                </button>
                                <button type="button" class="btn btn-secondary">{{time}}</button>
                            </div>
                        </div>
                    </div>
                </div>
                    <iframe width="100%" height="420" :src="'https://www.youtube.com/embed/live_stream?channel='+youtubeSecret" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                
                <div v-if="role==1" class="col-md-12">
                    <!-- <video ref="vid" autoplay/> -->
                    <p ref="broadcaster"></p>
                </div>
            </div>
            <div class="col-md-4">
                <h4>Comments</h4>
                <textarea style="width:90%" ref="comment" class="form-control"/>
                <hr/>
                <ul style="height: 500px;overflow-y:scroll" ref="comments"></ul>
            </div>
        </div>
</template>

<script>
import io from 'socket.io-client'
import { Stream } from 'stream';
import {url} from '../main'
import Axios from 'axios';
export default {
    mounted() {
        const comment = this.$refs.comment;
        comment.addEventListener('keypress', (e) => {
            if(e.keyCode =='13') {
                this.socket.emit('do comment', {username: this.username,  comment: comment.value});
                comment.value = '';
                }
            })

        this.socket.on('COMMENT', comm => {
            const li = document.createElement('li');
            li.innerHTML = `<strong style="color:#1119">${comm.username}</strong> <p style="color:#fff;font-size:17px;">${comm.comment}</p><hr/>`;
            this.$refs.comments.prepend(li);
        });


        if(this.role == 1) {
           this.socket.on('new user', (user) => {
               this.viewers.push(user.userId);
               console.log(this.viewers);
           });
           this.socket.on('quit', (user) => {
               const index = this.viewers.findIndex((viewer) => {return viewer == user.userId});
               const viewers = [...this.viewers]
               viewers.splice(index, 1);
              this.viewers = viewers;
           })
        }


        else if(this.role == 0) {
            this.socket.emit('register as user', {userId: this.userId, room: this.stage});
            this.socket.on('not allowed', () => {
                this.$router.replace('/exam');
            })
            this.socket.on("finish", () => {
                this.$router.replace('/exam');
            });


        }
    },
    destroyed() {
        this.socket.emit('quit', {userId: this.userId, room: this.stage});
    },
    computed: {
        username() {
            return this.$store.getters.username;
        },
        role() {
            return this.$store.getters.role;
        },
        userId() {
            return this.$store.getters.userId;
        },
        stage() {
            return this.$store.getters.stage;
        },
        youtubeSecret() {
            return this.$store.getters.adminData.youtubeSecret;
        }
    },
    data() {
        return {
            // socket: io('deutsch-lehrer.herokuapp.com'),
            socket: io('localhost:5000'),
            room: 'one',
            user: false,
            viewers: [],
            rtcPeerConnections: [],
            ready_toReceive: false,
            comments: [],
            allowed: true,
            duration: 0,
            live_duration: 0,
            record: 'stop',
            resume_count: false,
            live: false,
            time: '00:00:00',
            live_timer: '00:00:00',
            stage_users: [],
        }
    },
    methods: {
        start_live() {
            this.room = this.$refs.stage.value;
            this.socket.emit('add_boradcaster', this.room);
            this.live = true;
            const interval = setInterval(() => {
                if(this.live) this.live_duration++;
                else {
                    clearInterval(interval);
                    
                    }
                this.live_timer = new Date(this.live_duration*1000).toISOString().substr(11, 8);
            }, 1000)
        },
        stop_live() {
            this.socket.emit('stop');
            this.live = false;
            this.live_duration = 0;
            this.live_timer = '';
        },
        start_record() {
            const rec = this.$refs.rec;
            this.resume_count = true;
            if(this.record === 'stop') {
            rec.start();
            this.record = 'start'
            } else if(this.record === 'pause') {
                rec.resume();
                this.record = 'resume'
            }
        },
        pause_record() {
            const rec = this.$refs.rec;
            rec.pause();
            this.record = 'pause'
            this.resume_count = false;
        },
        stop_record() {
            const rec = this.$refs.rec;
            rec.stop();
            this.record = 'stop'
            this.resume_count = false;
            this.duration = 0;
            this.time = '00:00:00';
        },
        finish_record(data) {    
            var a = document.createElement('a');
            const url = URL.createObjectURL(data);
            a.download = 'live-video.mp4'
            a.href = url;
            a.click();
            URL.revokeObjectURL(url);
        },
        recording(video) {
           this.count();
        },
        count() {
            const count = setInterval(()=>{
            if(this.resume_count) this.duration++;
            this.time = new Date(this.duration * 1000).toISOString().substr(11, 8);
            if(this.record==='stop') clearInterval(count);
            }, 1000)
        },
        getStagrUsers() {
            const stage = this.$refs.stage.value;
            Axios.get('/getStageUsers/'+stage).then(res => {
                this.stage_users = res.data.users;
            })
        }
    }
}
</script>

<style lang="scss" scoped>
    .viewers {
        height: 300px;
        li {
            margin: 7px;
            color: #fff;
            font-weight: bolder;
            background-color: rgba(100, 112, 119, 0.747);
            text-align: center;
        }
    }
        .deactive {
            background-color:rgb(68, 97, 128);
            padding:10px 18px;
            margin-top:6px;
            border-radius:15px;
        }
        .active {
            background-color: green;
            padding:10px 18px;
            margin-top:6px;
            border-radius:15px;
        }
</style>