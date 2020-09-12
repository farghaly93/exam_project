<template>
     <v-navigation-drawer
      v-model="drawer"
      overlay-opacity=".5"
      app
      
    >
	<nav class="examsNav" id="sidebar">
	  		<h1><a href="#" class="logo">الأمتحانات</a></h1>
        <ul class="list-unstyled components mb-5">
          <li class="">
            <router-link :class="online?'live':'offline'" to="/liveVideo">الدرس الاون لاين<strong style="color:red;margin-left:46px;" v-if="online">Live</strong></router-link>
          </li>
          <li class="active">
            <a @click="lessonsHandler" href="#"><span class="fa fa-home mr-3"></span> الدروس</a>
          </li>
          <li class="active">
            <a @click="currentExamHandler" href="#"><span class="fa fa-home mr-3"></span> {{examDone?'تعليمات الامتحان القادم': 'قم بحل الامتحان الحالي'}}</a>
          </li>
          <li 
            :class="[exam.number===currentExamNumber?'current':'']"
             @click="() => {getExamResult(exam)}" v-for="exam in exams" :key="exam._id"  
          >
              <a href="#"><span :class="[exam.done?'fa fa-edit': 'fa fa-user']" class="mr-3"></span> {{currentExam}}({{exam.number}})</a>
          </li>
        </ul>

    </nav>
    </v-navigation-drawer>
    
</template>

<script>
import $ from 'jquery'
import io from 'socket.io-client'
export default {
    mounted() {
      // const online = setInterval(() => {
      //   this.online = !this.online;
      //   console.log(this.online);
      //   if(!this.live) {
      //     clearInterval(online);
      //     this.online = false;
      //   }
      // }, 1000);
      this.socket.on('live on', stage => {
        var stagee = stage=='1'?'one':stage=='2'?'two':'three';
          if(stagee==this.$store.getters.stage) {
            console.log('ooooo')
            this.online = !this.online;
          }
      })
      this.socket.on('finish', on => {
          if(on) {
              this.online = false;
            }
          })
        },
    created() {
        console.log(this.examDone)
    },
    props: [
        'currentExamHandler',
        'examDone', 
        'exams', 
        'currentExamNumber', 
        'getExamResult', 
        'currentExam', 
        'drawer',
        'lessonsHandler'
        ],
        data() {
          return {
            socket: io('deutsch-lehrer.herokuapp.com'),
            // socket: io('localhost:5000'),
            live: false,
            online: false
          }
        }
}
</script>


<style lang="scss" scoped>
.live {
  background-color: green;
}
.examNav {
  height: 1000px;
    ::-webkit-scrollbar {
        display: none;
    } 
}
    .examsNav ul{
        height: 1000px;
        overflow-y: scroll;
        li {
            v-progress {
                width: 100px;
            }
        }
    }
    ::-webkit-scrollbar {
        display: none;
    } 
    #sidebar {
  min-width: 250px;
  max-width: 250px;
  background: #4b4c4d;
  color: #fff;
  -webkit-transition: all 0.3s;
  -o-transition: all 0.3s;
  transition: all 0.3s;
  position: relative; }
  #sidebar .h6 {
    color: #fff; }
  #sidebar.active {
    margin-left: -250px; }
    #sidebar.active .custom-menu {
      margin-right: -50px; }
  #sidebar h1 {
    margin-bottom: 20px;
    font-weight: 700;
    font-size: 20px; }
    #sidebar h1 .logo {
      color: #fff;
      display: block;
      padding: 10px 30px;
      background: #2f89fc; }
  #sidebar ul.components {
    padding: 0; }
  #sidebar ul li {
    font-size: 16px; }
    #sidebar ul li > ul {
      margin-left: 10px; }
      #sidebar ul li > ul li {
        font-size: 14px; }
    #sidebar ul li a {
      padding: 15px 30px;
      display: block;
      color: rgb(255, 255, 255);
      font-weight: bolder;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1); }
      #sidebar ul li a:hover {
        color: #fff;
        background: #2f89fc;
        border-bottom: 1px solid #2f89fc; 
        text-decoration:none;}
    #sidebar ul li.active > a {
      background: transparent;
      color: #fff; 
      font-weight: bolder;
      font-size: 17px;
      }
      #sidebar .current > a {
        color: #fff;
        background: #2f89fc;
        border-bottom: 1px solid #2f89fc; 
        text-decoration:none;
      }
      
      #sidebar ul li.active > a:hover {
        background: #2f89fc;
        border-bottom: 1px solid #2f89fc; }
  #sidebar .custom-menu {
    display: inline-block;
    position: absolute;
    top: 10px;
    right: 0;
    margin-right: -50px;
    -webkit-transition: 0.3s;
    -o-transition: 0.3s;
    transition: 0.3s; }
    #sidebar .custom-menu .btn.btn-primary {
      background: transparent;
      border-color: transparent; }
      #sidebar .custom-menu .btn.btn-primary i {
        color: black;
        font-size: 24px; }
      #sidebar .custom-menu .btn.btn-primary:hover, #sidebar .custom-menu .btn.btn-primary:focus {
        background: transparent !important;
        border-color: transparent !important; }

</style>