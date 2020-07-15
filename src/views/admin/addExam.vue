
<template>
    <div>
        <div class="row">
            <div class="col-md-3">
                <label>السنة الدراسية</label>
                <div class="row">
                    <input class="form-control col-md-6" min="2020" type="number" v-model.number="year" />
                    <p class="col-md-6">/{{year+1}}</p> 
                </div>
            </div>
            <div class="stage col-md-3">
                <label>Select stage</label>
                <select class="form-control" v-model="stage">
                    <option value="one">One</option>
                    <option value="two">Two</option>
                    <option value="three">Three</option>
                </select>
            </div>
            <div class="number col-md-3">
                <label>Exam number</label>
                <input class="form-control" type="number" v-model.number="number" />
            </div>
            <div class="col-md-3">
                <label>Number of Questions sections</label>
                <input class="form-control" type="number" min="1" max="10" v-model.number="numberOfQuestionsSections"/>
            </div>
        </div>
        <div v-if="edit" class="questionsSection">
            <h2>Edit exam1</h2>
            <edit-exam :section="sections[section-1]" @concatArraysOfQuestions="concatArraysOfQuestionsHandler" v-for="section in numberOfQuestionsSections" :key="section"/>
        </div>
        <div v-if="!edit" class="questionsSection">
            <questions-section @concatArraysOfQuestions="concatArraysOfQuestionsHandler" v-for="quesSec in numberOfQuestionsSections" :key="quesSec"/>
        </div>
        <Loading v-if="loading"/>
        <button style="padding:12px 70px;" class="btn btn-primary" @click="addExam">Add exam</button>
    </div>
</template>

<script>
import axios from 'axios'
import QuestionsSection from '../../components/admin/QuestionsSection.vue'
import EditExam from '../../components/admin/editExam.vue'
import Loading from '../../components/loading.vue'
import { eventBus } from '../../main.js'
export default {
    created() {
        if(this.$route.params.id) {
            this._id = this.$route.params.id;
            axios.get('/fetchExam/'+this._id).then(res => {
                this.edit = true;
                this.sections = res.data.exam.sections;
                this.numberOfQuestionsSections = res.data.exam.sections.length;
                console.log('Heeellllllloooooooooo',this.sections[0]);

                this.stage = res.data.exam.stage;
                this.number = res.data.exam.number;
            });
        }
    },
    components: {
        QuestionsSection,
        EditExam,
        Loading
    },
    data() {
        return {
            numberOfQuestionsSections: 1,
            allQuestions: [],
            stage: 'one',
            sections: [],
            edit: false,
            _id: '',
            number: 1,
            loading: false,
            year: 2020
        }
    },
    watch: {
        numberOfQuestionsSections(val) {
            for(let i=0;i<val; i++) {
                this.sections[i] = this.sections[i] || {type: '', questions: [{question: '', choices: []}]};
            }
        },
        stage(val) {
            axios.get('/filterExams/'+this.year+'/'+val).then(res => {
                this.number = res.data.exams.length+1;
            })
        }
    },
    computed: {

    },
    methods: {
        concatArraysOfQuestionsHandler(questions) {
            console.log('questions', questions);
            this.allQuestions.push(questions);
            this.allQuestions = [...new Set(this.allQuestions)];
        },
        addExam() {
            this.loading = true;
            eventBus.$emit('collectQuestions');
            //console.log(this.allQuestions);
            const exam = {year: this.year, stage: this.stage, number: this.number, sections: this.allQuestions};
            if(this.edit) { 
                axios.post('/editExam/'+this._id, exam).then(res => {
                    this.$store.dispatch('writemessage', 'Exam uploaded succefully');
                    this.allQuestions = [];
                    this.loading = false;
                    console.log(res.data.done);
                });
                return;
            }
            axios.post('/uploadQuestions', exam).then(res => {
                this.allQuestions = [];
                this.loading = false;
                this.$store.dispatch('writemessage', 'Exam uploaded succefully');
                console.log(res.data.done);
            })
        }
    }
}
</script>

<style lang="scss">
    
</style>