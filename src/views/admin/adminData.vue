<template>
    <v-container>
        <v-label>Site name</v-label>
        <v-text-field
            placeholder="Site name"
            v-model = "siteName"
        />
        <v-label>Name</v-label>
        <v-text-field
            placeholder="Name"
            v-model = "name"
        />
        <v-label>Phone number</v-label>
        <v-text-field
            placeholder="Phone"
            v-model = "phone"
        />
        <v-label>Address</v-label>
        <v-text-field
            placeholder="Address"
            v-model = "address"
        />
        <v-label>Career</v-label>
        <v-text-field
            placeholder="Career"
            v-model = "career"
        />
        <v-label>Facebook</v-label>
        <v-text-field
            placeholder="Facebook"
            v-model = "facebook"
        />
        <v-label>Linkedin</v-label>
        <v-text-field
            placeholder="Linkedin"
            v-model = "twitter"
        />
        <v-label>Email</v-label>
        <v-text-field
            placeholder="Email"
            v-model = "email"
        />
        <v-label>Whatsapp</v-label>
        <v-text-field
            placeholder="Whatsapp"
            v-model = "whatsapp"
        />
        <v-label>Youtube secret</v-label>
        <v-text-field
            placeholder="Youtube secret"
            v-model = "youtubeSecret"
        />
        <v-btn @click="submit">Update</v-btn>
    </v-container>
</template>

<script>
import axios from 'axios'
export default {
    created() {
        axios.get('/getAdminData').then(res => {
            this.siteName = res.data.adminData.siteName;
            this.name = res.data.adminData.name;
            this.phone = res.data.adminData.phone;
            this.address = res.data.adminData.address;
            this.career = res.data.adminData.career;
            this.facebook = res.data.adminData.facebook;
            this.gmail = res.data.adminData.linkedin;
            this.email = res.data.adminData.email;
            this.whatsapp = res.data.adminData.whatsapp;
            this.youtubeSecret = res.data.adminData.youtubeSecret;
        });
    },
    data() {
        return {
            siteName: '',
            name: '',
            phone: 0,
            address: '',
            career: '',
            facebook: '',
            linkedin: '',
            email: '',
            whatsapp: '',
            youtubeSecret: ''
        }
    },
    methods: {
        submit() {
            axios.patch('/updateadminData', {
                siteName: this.siteName,
                name: this.name,
                phone: this.phone,
                address: this.address,
                career: this.career, 
                facebook: this.facebook, 
                gmail: this.gmail, 
                email: this.email, 
                whatsapp: this.whatsapp,
                youtubeSecret: this.youtubeSecret
                }).then(res => {
                    console.log(res)
                    if(res.data.done) {
                        this.$store.dispatch('writemessage', 'Admin data updated successfully...');
                    }
                });
        }
    }
}
</script>