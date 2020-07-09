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







