<template>
    <div style="margin-top:80px;">
        <h1>Farghaly</h1>
        
<iframe width="560" height="315" src="https://www.youtube.com/embed/live_stream?channel=UCbDz-xkvrRLhEOc2EIuhtAg" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
<div v-if="role == 1" class="col-md-12">
                <select @change="getStagrUsers" ref="stage">
                    <option value="1">الصف الأول الثانوي</option>
                    <option value="2">الصف الثاني الثانوي</option>
                    <option value="3">الصف الثالث الثانوي</option>
                </select>
                <button :disabled="live" class="btn btn-primary" @click="start_live">Start live</button>
                <button :disabled="!live" class="btn btn-danger" @click="stop_live">Stop live</button>
                <div>{{live_timer}}</div>
            </div>
            <div class="col-md-6">
                <video ref="vid" autoplay/>
                <vue-record-video ref="rec" v-if="role==1" v-show="false" @stream="recording" @result="finish_record"  />
                <div class="container">
                    <hr/>
                    <div v-if="role == 1" class="player text-center">
                        <button style="color:red;" v-if="record==='stop'||record==='pause'" type="button" id="button_play" class="btn" @click="start_record">
                            <i class="fa fa-circle"></i>
                        </button>
                        <button v-if="record==='start'||record==='resume'" type="button" id="button_play" class="btn" @click='pause_record'>
                            <i class="fa fa-pause"></i>
                        </button>
                        
                        <button type="button" id="button_stop" class="btn" @click='stop_record'>
                            <i class="fa fa-stop"></i>
                        </button>
                        <div>{{time}}</div>
                    </div>
                </div>
                <p ref="broadcaster"></p>
                <ul class="viewers" style="overflow-y:scroll" ref="viewers">
                    <li v-for="user in stage_users" :key="user._id" :class="user._id">{{user.fullname}}</li>
                </ul>
            </div>
            <div class="col-md-6">
                <h4>Comments</h4>
                <input style="width:90%" ref="comment" type="text" class="form-control" placeholder="leave comment"/>
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
        if(this.role == 1) {
            this.user = true;
            this.socket.on('new user', data => {
                this.rtcPeerConnections[data.user.id] = new RTCPeerConnection(this.iceServers);
                const stream = this.$refs.vid.srcObject;
                stream.getTracks().forEach(track => {
                    this.rtcPeerConnections[data.user.id].addTrack(track, stream)
                })
                this.rtcPeerConnections[data.user.id].onicecandidate = (event) => {
                    if (event.candidate) {
                    console.log("sending ice candidate");
                    console.log(event);
                    this.socket.emit("candidate", data.user.id, {
                        type: "candidate",
                        label: event.candidate.sdpMLineIndex,
                        id: event.candidate.sdpMid,
                        candidate: event.candidate.candidate,
                    });
                    }
                };

                this.rtcPeerConnections[data.user.id]
                    .createOffer()
                    .then((sessionDescription) => {
                        console.log('SDP', sessionDescription);
                    this.rtcPeerConnections[data.user.id].setLocalDescription(sessionDescription);
                    this.socket.emit("offer", data.user.id, {
                        type: "offer",
                        sdp: sessionDescription,
                        broadcaster: {room: this.room, name: this.username},
                    });
                    })
                    .catch((error) => {
                    console.log(error);
                    });
                    let lis = this.$refs.viewers.querySelectorAll('li');
                    lis.forEach(li => {
                        if(data.user.userId === li.getAttribute('class')) {
                            li.setAttribute('style', "background-color: green");
                        };
                    })
                });
                this.socket.on("answer", (viewerId, event) => {
                    this.rtcPeerConnections[viewerId].setRemoteDescription(
                        new RTCSessionDescription(event)
                    );
                });

        }



        else if(this.role == 0) {
            switch (this.stage) {
                case 'one': this.room = '1';
                    break;
                case 'two': this.room = '2';
                    break;
                case 'three': this.room = '3';
                    break;
                default:
                    break;
            };
            this.user = false;
            this.socket.emit('register as user', {room: this.room, name: this.username, userId: this.userId});
            this.socket.on('not allowed', forbidden => {
                if(forbidden) {
                    // alert('انتا لسه مادفعتش اللي عليك يا حلو...');
                    // this.allowed = false;
                    // this.$router.go(-1);
                }
            });
            if(this.allowed) {
                this.socket.on("offer",  (broadcaster, sdp) => {
                this.$refs.broadcaster.innerText = broadcaster.name + "is broadcasting...";

                this.rtcPeerConnections[broadcaster.id] = new RTCPeerConnection(this.iceServers);

                this.rtcPeerConnections[broadcaster.id].setRemoteDescription(sdp);

                this.rtcPeerConnections[broadcaster.id]
                    .createAnswer()
                    .then((sessionDescription) => {
                    this.rtcPeerConnections[broadcaster.id].setLocalDescription(
                        sessionDescription
                    );
                    this.socket.emit("answer", {
                        type: "answer",
                        sdp: sessionDescription,
                        room: this.room,
                    });
                });

                this.rtcPeerConnections[broadcaster.id].ontrack = (event) => {
                    this.ready_toReceive = true;
                    this.$refs.vid.srcObject = event.streams[0];
                };

                this.rtcPeerConnections[broadcaster.id].onicecandidate = (event) => {
                    if (event.candidate) {
                    console.log("sending ice candidate");
                    console.log(event);
                    this.socket.emit("candidate", broadcaster.id, {
                        type: "candidate",
                        label: event.candidate.sdpMLineIndex,
                        id: event.candidate.sdpMid,
                        candidate: event.candidate.candidate,
                    });
                    }
                };
                });
            }
        }
        this.socket.on("candidate",  (id, event) => {
        var candidate = new RTCIceCandidate({
            sdpMLineIndex: event.label,
            candidate: event.candidate,
        });
        this.rtcPeerConnections[id].addIceCandidate(candidate);
        });




        this.socket.on('COMMENT', comm => {
            const li = document.createElement('li');
            li.innerHTML = `<strong>${comm.username}</strong> <p>${comm.comment}</p>`;
            this.$refs.comments.prepend(li);
        });

        this.socket.on("finish", (finish) => {
            console.log('finish');
            if(finish) {
                alert('انتهى البث');
            }
        });

        const comment = this.$refs.comment;
        comment.addEventListener('keypress', (e) => {
            if(e.keyCode =='13') {
                this.socket.emit('do comment', {username: this.username,  comment: comment.value});
                comment.value = '';
            }
        })

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
        }
    },
    data() {
        return {
            socket: io('deutsch-lehrer.herokuapp.com'),
            // socket: io('localhost:5000'),
            room: 1,
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
            iceServers: {
                iceServers: [
                    {'urls': 'stun:stun.l.google.com:19302'},
                    {'urls':'stun:stun1.l.google.com:19302'},
                    {'urls':'stun:stun2.l.google.com:19302'},
                    {'urls':'stun:stun3.l.google.com:19302'},
                    {'urls':'stun:stun4.l.google.com:19302'},
                    // {urls:'stun:stun01.sipphone.com'},
                    // {url:'stun:stun.ekiga.net'},
                    // {url:'stun:stun.fwdnet.net'},
                    // {url:'stun:stun.ideasip.com'},
                    // {url:'stun:stun.iptel.org'},
                    // {url:'stun:stun.rixtelecom.se'},
                    // {url:'stun:stun.schlund.de'},
                    // {url:'stun:stunserver.org'},
                    // {url:'stun:stun.softjoys.com'},
                    // {url:'stun:stun.voiparound.com'},
                    // {url:'stun:stun.voipbuster.com'},
                    // {url:'stun:stun.voipstunt.com'},
                    // {url:'stun:stun.voxgratia.org'},
                    // {url:'stun:stun.xten.com'},
                    // {url:'stun:stun.fwdnet.net'},
                    // {url:'stun:stun.voxgratia.org'},
                    // {url:'stun:sstun.xten.com'},
                    // {url:'stun:numb.viagenie.ca'},
                    // {url:'stun:stun.stunprotocol.prg'},
                    // {url:'stun:stun.counterpath.com'},
                    // {url:'stun:stun.services.mozilla.com'},
                    // {url:'stun:stun.sipgate.net'},
                    // {url:'stun:stun4.l.google.com:19302'},
                    // {url:'stun:stunserver.org'},
                    // {url:'stun:stun.softjoys.com'},
                    // {url:'stun:stun.voiparound.com'},
                    // {url:'stun:stun.voipbuster.com'},
                    // {url:'stun:stun.voipstunt.com'},
                    // {url:'stun:stun.voxgratia.org'},
                    // {url:'stun:stun.xten.com'},
                    // {
                    //     url: 'turn:numb.viagenie.ca',
                    //     credential: 'muazkh',
                    //     username: 'webrtc@live.com'
                    // },
                    // {
                    //     url: 'turn:192.158.29.39:3478?transport=udp',
                    //     credential: 'JZEOEt2V3Qb0y27GRntt2u2PAYA=',
                    //     username: '28224511:1379330808'
                    // },
                    // {
                    //     url: 'turn:192.158.29.39:3478?transport=tcp',
                    //     credential: 'JZEOEt2V3Qb0y27GRntt2u2PAYA=',
                    //     username: '28224511:1379330808'
                    // }
                ],
            },
        }
    },
    methods: {
        start_live() {
            this.room = this.$refs.stage.value;
            navigator.mediaDevices.getDisplayMedia({video: true, audio: true}).then(stream => {
                this.socket.emit('add_boradcaster', this.room);
               this.$refs.vid.srcObject = stream;
                this.live = true;
                const interval = setInterval(() => {
                    if(this.live) this.live_duration++;
                    else clearInterval(interval);
                    this.live_timer = new Date(this.live_duration*1000).toISOString().substr(11, 8);
                }, 1000)
            }).catch(err => {
                console.log(err);
            });
        },
        stop_live() {
            navigator.mediaDevices.getUserMedia({video: true, audio: true}).then(stream => {
                this.socket.emit('stop live', true);
                stream.getTracks().forEach(function(track) {
                    track.stop();
                });
                this.live = false;
                this.live_duration = 0;
                this.live_timer = '';
            }).catch(err => {
                console.log(err);
            });
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
            a.download = 'live-video.webc'
            a.href = base64;
            a.click();
            URL.revokeObjectURL(data)
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
            let stagee;
            if(stage==='1') stagee='one';
            if(stage==='2') stagee='two';
            if(stage==='3') stagee='three';
            Axios.get('/getStageUsers/'+stagee).then(res => {
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
            padding: 3px 20px;
            background-color: rgba(100, 112, 119, 0.747);
            text-align: center;
        }
    }
</style>