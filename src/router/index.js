import Vue from 'vue'
import VueRouter from 'vue-router'
import Categories from '../views/categories.vue'
import Dashboard from '../views/dashboard.vue'
import Exam from '../views/exam.vue'
import MainDashboard from '../views/admin/mainDashboard.vue'
import Redirector from '../views/redirector.vue'
import Header from '../components/header/header.vue'
import Footer from '../components/footer.vue'
import AddExam from '../views/admin/addExam.vue'
import Register from '../components/userform.vue'
import Users from '../views/admin/users.vue'
import Exams from '../views/admin/exams.vue'
import AdminData from '../views/admin/adminData.vue'
import Answers from '../views/admin/answers.vue'
import LiveVideo from '../views/broadcasting.vue'
import UploadVideo from '../views/admin/upload_video.vue'
import AdminVideos from '../views/admin/videos.vue'
import Videos from '../components/examPage/videos.vue'
import Students_grades from '../views/admin/students_grades.vue'
import NextExamInstructions from '../views/admin/nextExamInstructions.vue'
import store from '../store/index'
Vue.use(VueRouter)

const routes = [
  { path: '/',  components: {default: Categories, }  },
  { path: '/exam', components: {default: Exam, 'header': Header, 'footer': Footer}, beforeEnter: (to, from, next) => {
    if(localStorage.getItem('token')) {
      if(localStorage.getItem('role') == 1) {
        next('/dashboard');
    }
      next();
    } else {
        next('/register/register');
    }
  }},
  { path: '/liveVideo', components: {default: LiveVideo, 'header': Header, 'footer': Footer} },
  { path: '/register/:way', components: {default: Register, 'header': Header, 'footer': Footer}},
  { path: '/videos', components: {default: Videos, 'header': Header, 'footer': Footer}},
  { path: '/updateUserInfo/:update', components: {default: Register, 'header': Header, 'footer': Footer}},
  //{ path: '/redirector/:path', component: Redirector },
  
  { path: '/dashboard',
   components:{default: Dashboard},
   children: [{
     path: '',
     component: MainDashboard
   },{
     path: 'addExam',
     component: AddExam
   },{
    path: 'users',
    component: Users
  },{
    path: 'exams',
    component: Exams
  },{
    path: 'editExam/:id',
    component: AddExam
  },{
    path: 'answers',
    component: Answers
  },{
    path: 'redirector/:path',
    component: Redirector
  },{
    path: 'nextExamInstructions',
    component: NextExamInstructions
  },{
    path: 'adminData',
    component: AdminData
  },{
    path: 'uploadVideo',
    component: UploadVideo,
    props: true
  },{
    path: 'uploadVideo/:id',
    component: UploadVideo,
    props: true
  },{
    path: 'videos',
    component: AdminVideos
  },{
    path: 'students_grades',
    component: Students_grades
  }]
  , beforeEnter: (to, from, next) => {
    if(localStorage.getItem('role') == 1) {
      next();
    } else {
      next('/');
      store.state.itemsStore.showModal = true;
    }
  } },

  // {
  //   // route level code-splitting
  //   // this generates a separate chunk (about.[hash].js) for this route
  //   // which is lazy-loaded when the route is visited.
  //   component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  // }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
