<template>
    <div class="container">
        <div class="stage">
            <label>Select stage</label>
            <select @change="filterExams" class="form-control" v-model="stage">
                <option value="one">One</option>
                <option value="two">Two</option>
                <option value="three">Three</option>
            </select>
        </div>
        <div class="Year">
            <label>Select Year</label>
            <select @change="filterExams" class="form-control" v-model="year">
                <option v-for="y in years" :key="y" :value="y">{{y}}</option>
            </select>
        </div>
        <app-modal v-if="modal">
            <h3 class="login" slot="header">Write "confirm" to confirm delete</h3>
            <div class="modalBody" slot="body">
                <input type="text" class="form-control" ref="password"/>
                <button @click="deleteExam" class="btn btn-primary">Confirm</button>
                <button @click="modal=false" class="btn btn-primary">close</button>
            </div>
        </app-modal>
        <h3 class="center">Exams</h3>
<!-- Card deck -->
        <v-row class="mb-6">
            <v-col v-for="(exam, i) in exams" :key="i" :md="4" :sm="12">
                <v-card
                class="mx-auto col-md-3"
                slot="progress"
                max-width="400"
                :loading="loading"
                >
                <v-img
                    class="white--text align-end"
                    height="200px"
                    src="https://img2.arabpng.com/20180419/hkw/kisspng-ssc-mts-exam-test-computer-icons-educational-entra-test-paper-5ad919071997b8.5830873915241771591048.jpg"
                >
                    <v-card-title>{{exam.year}}</v-card-title>
                </v-img>
            
                <v-card-title>{{exam.stage}}</v-card-title>
                <v-card-subtitle>{{exam.number}}</v-card-subtitle>
            
                <v-card-actions>
                    <v-btn
                    color="#3f608e"
                    text
                    @click="()=>editExam(exam._id)"
                    >
                    explore
                    </v-btn>
            
                    <v-btn
                    color="#af2828e3"
                    text
                    @click="()=>{examId=exam._id;modal=true}"
                    >
                    Delete
                    </v-btn>
                </v-card-actions>
                </v-card>
            </v-col>
        </v-row>
    </div>
</template>

<script>
import axios from 'axios';
import Modal from '../../components/modal.vue';
export default {
    components: {
        appModal: Modal,
    },
    created() {
        this.loading = true;
        this.year = new Date().getFullYear();
        axios.get('/fetchExams').then(res => {
            this.exams = res.data.exams;
            this.loading = false
        })
        const years = [];
        for(let y = new Date().getFullYear(); y>=2020; y--) {
            years.push(y);
        }
        this.years = years;
    },
    data() {
        return {
            exams: [],
            modal: false,
            examId: '',
            loading: false,
            years: [],
            year: 2020,
            stage: 'one'
        }
    },
    methods: {
        editExam(id) {
            this.$router.push('/dashboard/editExam/'+id);
        },
        filterExams() {  
            this.loading = true;
            axios.get('/filterExams/'+this.year+'/'+this.stage).then(res => {
                this.exams = res.data.exams;
                this.loading = false
            })
        },
        deleteExam() {
            if(this.$refs.password.value === 'confirm') {
                axios.get('/deleteExam/'+this.examId).then(res => {
                    this.exams = res.data.exams
                    this.modal = false;
                });
            } else {
               this.$store.dispatch('writemessage', 'password isn\'t correct...'); 
            }
        }
    }
}
</script>

<style scoped lang="scss">
   .card{
  margin: 5% 0%;
}

.card-body{
  margin: 0% 0% 0% 3%;
  padding: 6% 0%;
}


</style>