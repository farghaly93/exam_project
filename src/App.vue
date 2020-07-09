<template>
  <div id="app">
        <app-register v-if="showModal" />
    <v-app  id="inspire">
      <router-view name="header"/>
      <div class="">
        <transition name="slide" mode="out-in">
          <router-view style="margin-bottom:120px;margin-right:10px;margin-left:10px;"></router-view>
        </transition>
      </div>
            
    </v-app>
  </div>
</template>

<script>
  import Header from './components/header/header.vue'
  import Footer from './components/footer.vue'
  import axios from 'axios'
  import AppRegister from './components/register.vue'

  export default {
   created() {
      this.$store.dispatch('autoSignin');
      axios.get('/addVisitor').then(res => {
      });
      
    },
    data() {
      return {
        users: []
      }
    },
    computed: {
      tags() {
        return this.$store.getters.tags;
      },
      showModal() {
        return this.$store.getters.showModal;
   },
    },
    name: 'app',
    components: {
      'app-header': Header,
      appFooter: Footer,
      AppRegister
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
    text-align: center;
    font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
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