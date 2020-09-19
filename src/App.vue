<template>
  <div id="app">
    <app-message v-if="message">
        <h3 slot="message">{{message}}</h3>
    </app-message>
    <app-register v-if="showModal" />
    <v-app  id="inspire">
      <router-view name="header"/>
        <transition name="slide" mode="out-in">
          <router-view ></router-view>
        </transition>
      <router-view name="footer"/>    
    </v-app>
  </div>
</template>

<script>
  import axios from 'axios'
  import AppRegister from './components/register.vue'
  import messageVue from './components/message.vue'

  export default {
   created() {
      this.$store.dispatch('autoSignin');
      axios.get('/addVisitor').then(res => {
      });
      axios.get('/getAdminData').then(res => {
          this.$store.dispatch('putAdminData', res.data.adminData);
          //document.getElementsByClassName('main')[0].style.backgroundImage = `url(${this.adminData.imageUrl})`;
      })
    },
    data() {
      return {
        users: []
      }
    },
    computed: {
      showModal() {
        return this.$store.getters.showModal;
      },
      message() {
        return this.$store.getters.message;
      }
    },
    name: 'app',
    components: {
      AppRegister,
      appMessage: messageVue
    },
    watch: {
      showModal(val) {
        console.log(val);
      }
 }
  }
</script>

<style scope lang="scss">
  body, html {
    /* padding: 5px; */
    font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
    direction: rtl;
    text-align: right !important;
  }
  .chat {
    position: fixed;
    right: 0;
    bottom: 41px;
    z-index:1;
  }
  .slide-leave-active {
        transition: opacity .2s ease;
        opacity: 0;
        animation: slide-out .2s ease-out forwards;
    }

    .slide-leave {
        opacity: 1;
        transform: translateX(0);
    }

    .slide-enter-active {
        animation: slide-in .2s ease-out forwards;
    }

    @keyframes slide-out {
        0% {
            transform: translateY(0);
        }
        100% {
            transform: translateY(-30px);
        }
    }

    @keyframes slide-in {
        0% {
            transform: translateY(-30px);
        }
        100% {
            transform: translateY(0);
        }
    }
    .tag {
      color: rgb(38, 37, 48);
      cursor: pointer;
      &:hover {
        color: red;
      }
      .active {
        color: red
      }
    }
</style>