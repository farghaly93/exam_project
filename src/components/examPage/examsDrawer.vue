<template>
     <v-navigation-drawer
      v-model="drawer"
      overlay-opacity=".5"
      app
      
    >
	<nav class="examsNav" id="sidebar">
        <ul class="list-unstyled components mb-5">
          <v-divider/> 
          <li class="">
            <router-link :aria-disabled="live" :class="online?'live':'offline'" to="/liveVideo">الدرس الاون لاين<strong style="color:red;margin-left:46px;" v-if="online">Live</strong></router-link>
          </li>
          <li class="active">
            <a @click="lessonsHandler" href="#"><span class="fa fa-home mr-3"></span> الدروس</a>
          </li>
          <li class="active">
            <a @click="getInstructions" href="#"><span class="fa fa-home mr-3"></span> {{'تعليمات الامتحان القادم'}}</a>
          </li>
          <v-divider/>
          <v-divider/> 
	  		  <h1><a href="#" class="logo">الأمتحانات</a></h1>
          <li v-if="unSolvedExamsNumbers.length===0" class="active">
            <a href="#"><span class="fa fa-edit mr-3"></span>في انتظار الامتحان القادم</a>
          </li>
          <li v-for="exam in unSolvedExamsNumbers" :key="exam" class="active">
            <a @click="()=>currentExamHandler(exam)" href="#"><span class="fa fa-home mr-3"></span> أمتحان رقم {{exam}}</a>
          </li>
          <v-divider/>
          <v-divider/>
          <br>
          <h1><a href="#" class="logo"> الامتحانات السابقة</a></h1>
          <li 
            :class="[exam.number===currentExamNumber?'current':'']"
             @click="() => {getExamResult(exam)}" v-for="exam in exams" :key="exam._id"  
          >
              <a href="#"><span :class="[exam.done?'fa fa-edit': 'fa fa-user']" class="mr-3"></span> {{'نتيجة أمتحان رقم'}} ({{exam.number}})</a>
          </li>
          <v-divider/> 
        </ul>

    </nav>
    </v-navigation-drawer>
    
</template>

<script>
import $ from 'jquery'
import io from 'socket.io-client'
import axios from 'axios'
export default {
    mounted() {
      this.refreshExamsList();
      this.socket.on('live', stage => {
          if(stage==localStorage.getItem('stage')) {
            this.online = !this.online;
            if(!this.live) this.online = false;
            this.live = true;
          }
      })
      this.socket.on('finish', () => {
            this.online = false;
            this.live = false;
          })
        },
    created() {
    },
    props: [
        'currentExamHandler',
        'exams', 
        'currentExamNumber', 
        'getExamResult', 
        'currentExam', 
        'drawer',
        'lessonsHandler',
        'getInstructions',
        'refreshExamsList',
        'unSolvedExamsNumbers'
        ],
        data() {
          return {
            socket: io('deutsch-lehrer.herokuapp.com'),
            // socket: io('localhost:5000'),
            live: false,
            online: false,
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
        background: #767a80;
        border-bottom: 1px solid #7b8088; 
        text-decoration:none;}
    #sidebar ul li.active > a {
      background: transparent;
      color: #fff; 
      font-weight: bolder;
      font-size: 17px;
      }
      #sidebar .current > a {
        color: #fff;
        background: #7c8591;
        border-bottom: 2px solid #40454b; 
        text-decoration:none;
      }
      #sidebar .current > a:hover {
        background: #7c8591;
      }
      #sidebar ul li.active > a:hover {
        background: #525a64;
        border-bottom: 1px solid #7d8288; }
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