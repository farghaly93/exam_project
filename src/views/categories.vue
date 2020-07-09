<template>
    <div>
        <div class="overlay">
            <img :src="adminData.imageUrl"/>
        </div>
        <video playsinline="playsinline" autoplay="autoplay" muted="muted" loop="loop">
            <source src="../mp4/bg.mp4" type="video/mp4">
        </video>

        <div class="masthead">
            <div class="masthead-bg"></div>
            <div class="container h-100">
                <div class="row h-100">
                    <div class="col-12 my-auto">
                        <div class="masthead-content text-white py-5 py-md-0">
                            <h1 class="mb-3">{{adminData.name}}</h1>
                            <p class="mb-5">0{{adminData.phone}}</p>
                            <p class="mb-5">{{adminData.address}}</p>
                            <p class="mb-5">{{adminData.career}}</p>
                            <div class="input-group input-group-newsletter">
                            <div class="input-group-append">
                                <button @click="()=>{this.$router.push('/exam')}" class="btn btn-secondary" type="button" id="submit-button">دخول</button>
                            </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="social-icons">
            <ul class="list-unstyled text-center mb-0">
            <li class="list-unstyled-item">
                <a blank :href="adminData.gmail">
                <i class="fab fa-google"></i>
                </a>
            </li>
            <li class="list-unstyled-item">
                <a target="_blank" :href="adminData.facebook">
                <i class="fab fa-facebook-f"></i>
                </a>
            </li>
            <li class="list-unstyled-item">
                <a blank :href="adminData.email">
                <i class="fab fa-email"></i>
                </a>
            </li>
            </ul>
        </div>
    </div>

</template>

<script>
import axios from 'axios'
export default {
    created() {
        axios.get('/getAdminData').then(res => {
            this.adminData = res.data.adminData;
        })
    },
    data() {
        return {
            adminData: {}
        }
    }
}
</script>

<style scoped>
    @import url('../scss/coming-soon.min.css');
    /* @import url('../bootstrap/css/bootstrap.min.css'); */
    @import url('https://fonts.googleapis.com/css?family=Source+Sans+Pro:200,200i,300,300i,400,400i,600,600i,700,700i,900,900i');
    @import url('https://fonts.googleapis.com/css?family=Merriweather:300,300i,400,400i,700,700i,900,900i');
</style>