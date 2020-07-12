<template>
    <v-container>
        <v-text-field
            placeholder="Name"
            v-model = "name"
        />
        <v-text-field
            placeholder="Phone"
            v-model = "phone"
        />
        <v-text-field
            placeholder="Addresse"
            v-model = "address"
        />
        <v-text-field
            placeholder="Career"
            v-model = "career"
        />
        <v-text-field
            placeholder="Facebook"
            v-model = "facebook"
        />
        <v-text-field
            placeholder="Gmail"
            v-model = "gmail"
        />
        <v-text-field
            placeholder="Email"
            v-model = "email"
        />
        <v-text-field
            placeholder="Iamge Url"
            v-model = "imageUrl"
        />
        <v-btn @click="submit">Update</v-btn>
    </v-container>
</template>

<script>
import axios from 'axios'
export default {
    created() {
        axios.get('/getAdminData').then(res => {
            this.name = res.data.adminData.name;
            this.phone = res.data.adminData.phone;
            this.address = res.data.adminData.address;
            this.career = res.data.adminData.career;
            this.facebook = res.data.adminData.facebook;
            this.gmail = res.data.adminData.gmail;
            this.email = res.data.adminData.email;
            this.imageUrl = res.data.adminData.imageUrl;
        });
    },
    data() {
        return {
            name: '',
            phone: 0,
            address: '',
            career: '',
            facebook: '',
            gmail: '',
            email: '',
            imageUrl: ''
        }
    },
    methods: {
        submit() {
            axios.patch('/updateadminData', {
                name: this.name,
                phone: this.phone,
                address: this.address,
                career: this.career, 
                facebook: this.facebook, 
                gmail: this.gmail, 
                email: this.email, 
                imageUrl: this.imageUrl
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