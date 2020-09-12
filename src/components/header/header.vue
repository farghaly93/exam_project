<template>
  <div>
    <app-message v-if="message">
        <h3 slot="message">{{message}}</h3>
    </app-message>
    <v-app-bar
      clipped-right
        app
        color="#566673de"
        dark
        shrink-on-scrol
      >
        <v-app-bar-nav-icon @click.stop="toggleDrawer"></v-app-bar-nav-icon>
        <v-toolbar-title><router-link to="/"><h4 style="color:#fff">{{admindata.siteName}}</h4></router-link></v-toolbar-title>
        <v-spacer></v-spacer>
        <v-toolbar-title class="links">
          <h5 style="cursor:pointer" to="" v-if="!token" class="link"  @click="$router.push('/register/register')"><strong>Register</strong></h5>
          <router-link active-class="active" class="link" v-if="role==='1'" to="/dashboard"><strong>Dashboard</strong></router-link>
          <router-link active-class="active" class="link" to="/liveVideo"><strong>Live lesson</strong></router-link>
          <router-link active-class="active" class="link" to="/register/update"><strong style="font-size:16px;">{{username}}</strong></router-link>
          <v-icon class="link" v-if="token" @click="logout">mdi-logout</v-icon>
        </v-toolbar-title>

        <v-app-bar-nav-icon right @click.stop="toggleDrawer2"></v-app-bar-nav-icon>
    </v-app-bar>  
     
  </div>
</template>

<script>
import messageVue from '../message.vue';
import {eventBus} from '../../main.js'
import axios from 'axios'
export default {
  updated() {
    console.log('message' , this.token);
  },
 created() {
 },
 data() {
   return {
     cats: []
   }
 },
 computed: {
   showModal() {
     return this.$store.getters.showModal;
   },
   message() {
     return this.$store.getters.message;
   },
   username() {
     return localStorage.getItem('username');
   },
   token() {
     return this.$store.getters.token;
   },
   role() {
     return this.$store.getters.role;
   },
   admindata() {
     return this.$store.getters.adminData;
   }
 },
 components: {
   appMessage: messageVue
 },
 methods: {
   openRegisterModal() {
      this.$store.dispatch('openModal');
   },
   logout() {
     this.$store.dispatch('logout');
   },
   toggleDrawer() {
     this.$store.dispatch('toggleDrawer');
   },
   toggleDrawer2() {
     this.$store.dispatch('toggleDrawer2');
   }
 }
}
</script>

<style scoped lang="scss">
  #header {
    background-image: -webkit-linear-gradient(rgb(63, 62, 66), rgb(98, 95, 99), rgb(176, 175, 180));
    height: 56px;
    display: flex;
    flex-flow: row;
    justify-content: space-between;
    align-items: center;
    background-color: #521751;
    padding: 0 20px;
  }

  .logo {
    font-weight: bold;
    color: white;
  }

  .logo a {
    text-decoration: none;
    color: white;
  }

  nav {
    height: 100%;
  }

  ul {
    list-style: none;
    margin: 0;
    padding: 0;
    height: 100%;
    display: flex;
    flex-flow: row;
    align-items: center;
  }

  li {
    margin: 0 16px;
  }

  li a {
    text-decoration: none;
    color: white;
  }

  li a:hover,
  li a:active,
  li a.router-link-active {
    color: #fa923f;
  }
  .links {
    .link {
      margin: 22px;
      color: #fff;
    }
    .active {
      color:rgb(204, 138, 63);
    }
  }
  @media screen and (max-width: 1000) {
    #header li{
    }
  }
</style>