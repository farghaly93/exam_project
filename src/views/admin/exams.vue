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
                <option v-for="y in years" :key="y" :value="y">{{y}}/{{y+1}}</option>
            </select>
        </div>
        <div class="number">
            <label>Select exam number</label>
            <input @change="filterExams" class="form-control" type="number" v-model="number" min="1"/>
        </div>
        <app-modal v-if="modal">
            <h3 class="login" slot="header">Write "confirm" to confirm delete</h3>
            <div class="modalBody" slot="body">
                <input type="text" class="form-control" ref="password"/>
                <button @click="deleteExam" class="btn btn-primary">Confirm</button>
                <button @click="modal=false" class="btn btn-primary">close</button>
            </div>
        </app-modal><br><br>
        <h3 class="text-center">Exams</h3>
<!-- Card deck -->
        <div class="row">
            <div v-for="(exams, i) of arranged_exams" :key="i" class="col-md-12 text-center">
                <button style="width:80%" class="btn btn-primary" type="button" data-toggle="collapse" :data-target="'#collapseExample'+i" aria-expanded="false" aria-controls="collapseExample">
                    {{i}} النسخ العشوائية لأمتحان رقم
                </button>
                <div class="collapse" :id="'collapseExample'+i">
                    <div class="card card-body">
                        <div class="row">
                            <div class="col-md-3" v-for="(exam, e) in exams" :key="e">
                            <v-card
                                slot="progress"
                                max-width="400"
                                :loading="loading"
                                style="padding:5px"
                                >
                                <v-img
                                    class="white--text align-end"
                                    height="200px"
                                    src="https://img2.arabpng.com/20180419/hkw/kisspng-ssc-mts-exam-test-computer-icons-educational-entra-test-paper-5ad919071997b8.5830873915241771591048.jpg"
                                >
                                </v-img>
                                <v-card-title> 
                                    العام الدراسي
                                    <p>{{exam.year}}/{{exam.year+1}}</p>
                                </v-card-title>
                                <v-card-title v-if="exam.stage==='one'">الصف الأول الثانوي</v-card-title>
                                <v-card-title v-if="exam.stage==='two'">الصف الثاني الثانوي</v-card-title>
                                <v-card-title v-if="exam.stage==='three'">الصف الثالث الثانوي</v-card-title>
                                <v-card-subtitle style="font-size:22px;font-weight:bold">{{exam.number}} امتحان رقم</v-card-subtitle>
                            
                                <v-card-actions>
                                    <v-btn
                                    color="#3f608e"
                                    text
                                    @click="()=>editExam(exam._id)"
                                    >
                                    <v-icon>edit</v-icon>
                                    </v-btn>
                            
                                    <v-btn
                                    color="#af2828e3"
                                    text
                                    @click="()=>{examId=exam._id;modal=true}"
                                    >
                                    <v-icon>delete</v-icon>
                                    </v-btn>
                                </v-card-actions>
                                </v-card>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
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
        // axios.get('/fetchExams').then(res => {
        //     this.exams = res.data.exams;
        //     this.loading = false
        // })
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
            stage: 'one',
            number: null,
            arranged_exams: {}
        }
    },
    methods: {
        editExam(id) {
            this.$router.push('/dashboard/editExam/'+id);
        },
        filterExams() {  
            this.loading = true;
            axios.get('/filterExams/'+this.year+'/'+this.stage+'/'+this.number).then(res => {
                this.exams = res.data.exams;
                this.loading = false
            })
        },
        deleteExam() {
            if(this.$refs.password.value === 'confirm') {
                axios.get('/deleteExam/'+this.examId+'/'+this.year).then(res => {
                    this.exams = res.data.exams
                    this.modal = false;
                });
            } else {
               this.$store.dispatch('writemessage', 'password isn\'t correct...'); 
            }
        }
    }, watch: {
        exams(val) {
            const arranged = {};
            let resume = true;
            let i = 1;
            while(resume) {
            const arr = val.filter(v => {
                return v.number == i
                })
            if(arr.length === 0) {
                resume = false;
                break;
                }
            arranged[i] = arr;
            i++;
            }
            this.arranged_exams = arranged;
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