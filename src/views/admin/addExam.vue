
<template>
    <div>
        <div class="stage">
            <label>Select stage</label>
            <select class="form-control" v-model="stage">
                <option value="one">One</option>
                <option value="two">Two</option>
                <option value="three">Three</option>
            </select>
        </div>
        <div class="number">
            <label>Exam number</label>
            <input class="form-control" type="number" v-model="number" />
        </div>
        <div>
            <label>Number of Questions sections</label>
            <input class="form-control" type="number" min="1" max="10" v-model.number="numberOfQuestionsSections"/>
        </div>
        <div v-if="edit" class="questionsSection">
            <h2>Edit exam1</h2>
            <edit-exam :section="sections[section-1]" @concatArraysOfQuestions="concatArraysOfQuestionsHandler" v-for="section in numberOfQuestionsSections" :key="section"/>
        </div>
        <div v-if="!edit" class="questionsSection">
            <questions-section @concatArraysOfQuestions="concatArraysOfQuestionsHandler" v-for="quesSec in numberOfQuestionsSections" :key="quesSec"/>
        </div>
        <Loading v-if="loading"/>
        <button @click="addExam">Add exam</button>
    </div>
</template>

<script>
import axios from 'axios'
import QuestionsSection from '../../components/admin/QuestionsSection.vue'
import EditExam from '../../components/admin/editExam.vue'
import Loading from '../../components/loading.vue'
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
            loading: false
        }
    },
    watch: {
        numberOfQuestionsSections(val) {
            for(let i=0;i<val; i++) {
                this.sections[i] = this.sections[i] || {type: '', questions: [{question: '', choices: []}]};
            }
        }
    },
    computed: {

    },
    methods: {
        concatArraysOfQuestionsHandler(questions) {
            console.log(questions);
            this.allQuestions.push(questions);
            this.allQuestions = [...new Set(this.allQuestions)];
        },
        addExam() {
            this.loading = true;
            const exam = {year: new Date().getFullYear(), stage: this.stage, number: this.number, sections: this.allQuestions};
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
            })
        }
    }
}
</script>

<style lang="scss">
    
</style>