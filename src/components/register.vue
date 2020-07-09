<template>
    <app-modal>
        <h3 class="login" slot="header">Register</h3>
       <app-userform :way="way" slot="body"/>
    </app-modal>
</template>
<script>
    import modalVue from './modal.vue';
    import loading from './loading.vue';
    import Userform from './userform.vue';
    export default {
        created() {
            console.log(this.$route.params.update)
            if(this.$route.params.update) this.way = 'update'
        },
        data() {
            return {
                way: 'register'
            }
        },
        components: {
            appModal: modalVue,
            appLoading: loading,
            appUserform: Userform
        },
    }
</script>







