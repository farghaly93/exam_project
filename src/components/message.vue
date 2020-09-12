<template>
    <transition name="slide">
        <div class="modal-mask">
            <div class="alert alert-info alert-dismissible">
                <a @click="closeMessage" href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a>
                <strong>Message!</strong> <p class="text-center" style="color:#fff"><slot name="message"/></p>
            </div>
        </div>
    </transition>
</template>


<script>
export default {
    mounted() {
        setTimeout(() => {
            this.closeMessage();
        }, 1800)
    },
  methods: {
    closeMessage() {
      this.$store.dispatch('closeMessage');
    }
  }
}
</script>

<style scoped>
    .modal-mask {
        width: 50%;
        transition: opacity 0.8s ease;
        z-index: 10000;
        margin-top: 23px;
        position: fixed;
        margin-left: 25%
}


/*
 * The following styles are auto-applied to elements with
 * transition="modal" when their visibility is toggled
 * by Vue.js.
 *
 * You can easily play with the modal transition by editing
 * these styles.
 */

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
</style>