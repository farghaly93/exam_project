<template>
    <div>
        <label style="font-size:30px;color:555;">Next exam instructions</label>
        <v-textarea
        v-model="instructions"
        clearable
        clear-icon="cancel"
        label="Text"
        auto-grow
        palce-holder="This is clearable text."
        ></v-textarea>
        <v-btn @click="sendInstructions">Submit</v-btn>
    </div>
</template>

<script>
import axios from 'axios'

export default {
    created() {
        axios.get('/getAdminData').then(res => {
            this.instructions = res.data.adminData.instructions;
        })
    },
    data() {
        return {
            instructions: ''
        }
    },
    methods: {
        sendInstructions() {
            axios.post('/sendInstructions', {instructions: this.instructions}).then(res => {
                if(res.data.done) {
                    this.$store.dispatch('writemessage', 'Next exam instructions sent successfully');
                } 
            })
        }
    }
}
</script>