<template>
    <div id="">
        <div v-if="loading" style="background-color: #6c757de3;height:100%;width:100%;position:absolute;z-index:13;padding-top:auto"><app-loading/></div>
    
        <Exams-drawer 
            :currentExamHandler="currentExamHandler" 
            :currentExamNumber="currentExamNumber"
            :exams="exams"
            :getExamResult="getExamResult"
            :currentExam="currentExam"
            :drawer="drawer"
            :lessonsHandler="lessonsHandler"
            :getInstructions="getInstructions"
            :refreshExamsList="refreshExamsList"
            :unSolvedExamsNumbers="unSolvedExamsNumbers"
        />

        <Grades-drawer/>

    <!--CONTENT-->
    
        <v-content class="content">
            <v-container fluid>                
                <div v-if="currentPage==='instructions'">
                    <v-alert
                    v-for="(instruction, i) in instructions.split('-')" :key="i"
                    color="blue-grey"
                    dark
                    dense
                    icon="mdi-school"
                    prominent
                    >
                    <p style="text-align:right;font-size:25px;">{{instruction}}</p>
                    </v-alert>
                </div>
            <!-----------------------------Exams REsults--------------------->
            
            <app-previous-exams
                v-if="currentPage==='results'"
                :examResult="examResult"
            />

            <!--------------------------------Exam Results ---------------------------->
            <app-exam
                v-if="currentPage==='exam'"
                :number="number_of_exam_to_do"
                :getUserPreviousExams="getUserPreviousExams"
                :refreshExamsList="refreshExamsList"
            />

            <app-lessons
                v-if="currentPage==='lessons'"
            />
        </v-container>
    </v-content>
    </div>
</template>

<script>

    import loading from '../components/loading.vue';
    import GradesDrawer from '../components/examPage/studentsGradesDrawer.vue';
    import ExamsDrawer from '../components/examPage/examsDrawer.vue';
    import Exam from '../components/examPage/exam.vue';
    import PreviousExams from '../components/examPage/previous_exams.vue';
    import Lessons from '../components/examPage/videos.vue';
    import axios from 'axios';
    export default {
        
        created() {
            this.loading = true;
            this.getUserPreviousExams();
        },
        data() {
            return {
                startExam: false,
                currentExam: 'أمتحان',
                currentExamNumber: 0,
                isResult: false,
                examResult: {},
                notFound: false,
                examDone: true,
                exams: [],
                instructions: '-',
                loading: false,
                ready: false,
                lessons: false,
                currentPage: 'instructions',
                number_of_exam_to_do: 1,
                unSolvedExamsNumbers: []
            }
        },
        computed: {
            drawer() {
                return this.$store.getters.drawer;
            },
            userId() {
                return this.$store.getters.userId;
            }
        },
        methods: {
            getUserPreviousExams() {
                axios.get('/getStudentExams/'+this.$store.getters.userId).then(res => {
                    this.exams = res.data.exams;
                    this.getInstructions();
                })
            },
            refreshExamsList() {
                axios.get('/getUnsolvedExams/'+localStorage.getItem('stage')+'/'+localStorage.getItem('userId')).then(res=>{
                    console.log(res.data.unSolvedExamsNumbers);
                    this.unSolvedExamsNumbers = res.data.unSolvedExamsNumbers;
                })
            },
            getExamResult(exam) {
                this.examResult = {};
                this.currentPage = 'results';
                this.examResult = exam;
                this.currentExamNumber = exam.number;
            },
            getInstructions() {
                this.currentExamNumber = 0;
                axios.get('/getAdminData').then(res => {
                    this.instructions = res.data.adminData.instructions || '';
                    this.loading = false;
                    this.ready = true;
                    this.currentPage = 'instructions';
                });
            },
            currentExamHandler(number) {
                this.number_of_exam_to_do = number;
                this.currentPage = '';
                setTimeout(()=>{
                    this.currentPage = 'exam';
                }, 100);
            },
            lessonsHandler() {
                this.currentPage = 'lessons';
            },
            logout() {}
        },
        components: {
            appLoading: loading,
            GradesDrawer,
            ExamsDrawer,
            appExam: Exam,
            appPreviousExams: PreviousExams,
            appLessons: Lessons
        }
    }
</script>

<style lang="scss" scoped>
    .content {
        //background-image: radial-gradient(rgba(45, 202, 223, 0.575), rgba(65, 114, 126, 0.5), rgb(255, 255, 255));
    }
    .mainn {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-items: center;
    }
    .items {
        margin-top: 30px;
        display: flex;
        flex-direction: row;
    }
    .titlee {
        margin: 20px;
        color: rgb(67, 65, 78);
        font-weight: bold;
    }
    
</style>