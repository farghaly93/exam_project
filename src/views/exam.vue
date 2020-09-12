<template>
    <div id="">
        <div v-if="loading" style="background-color: #6c757de3;height:100%;width:100%;position:absolute;z-index:13;padding-top:auto"><app-loading/></div>
    
        <Exams-drawer 
            :currentExamHandler="currentExamHandler" 
            :currentExamNumber="currentExamNumber"
            :examDone="examDone"
            :exams="exams"
            :getExamResult="getExamResult"
            :currentExam="currentExam"
            :drawer="drawer"
            :lessonsHandler="lessonsHandler"
        />

        <Grades-drawer/>

    <!--CONTENT-->
    
        <v-content class="content">
            <v-container fluid>
                <h2 class="text-center" v-if="notFound">No exams yet...</h2>
                <v-alert
                    style="text-align:center"
                    v-if="examDone && !lessons"
                    dense
                    type="info"
                >
                <strong>بأنتظار الامتحان القادم</strong>
                </v-alert>

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
                <div v-if="!notFound" class="startQuiz">
                    <button @click="()=>{startExamHandler()}" class="btn btn-primary startExam" v-if="!examDone && !isResult && !startExam && !lessons">ابدأ الأمتحان</button>
                </div>
            <!-----------------------------Exams REsults--------------------->
            
            <app-previous-exams
                v-if="currentPage==='results' && examDone"
                :examResult="examResult"
            />

            <!--------------------------------Exam Results ---------------------------->
            <app-exam
                v-if="!notFound && !examDone && startExam && currentPage==='exam'"
                :exam="exam"
                :solutionModel="solutionModel"
                :submitAnswers="submitAnswers"
                :timer="timer"
                :timerAlert="timerAlert"
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
            axios.get('/fetchExamForUser/'+this.stage+'/'+this.userId).then(res => {
                if(res.data.exam) {
                    this.exam = res.data.exam;
                    const examModel = {...this.exam};
                    this.examTime = this.exam.timer;
                    const solutionModelSections = examModel.sections.map(section => {
                            return {type: section.type, questions: section.questions.map(question => {
                                return {question: question.question, answer: '', degree: 0, fullDegree: question.fullDegree, correction: ''}
                            })}
                        });
                    this.solutionModel = {
                        year: this.exam.year,
                        stage: this.exam.stage, 
                        number: this.exam.number,
                        sections: solutionModelSections
                    };
                } else {
                    this.notFound = true;
                }
                axios.get('/testedOrNot/'+this.exam.stage+'/'+this.exam.number+'/'+this.userId).then(res => {
                    console.log(res.data);
                    if(res.data.tested) {
                        this.examDone = true;
                    } else {
                        this.examDone = false;
                    }
                    this.getUserPreviousExams();
                });
            });
        },
        data() {
            return {
                startExam: false,
                currentExam: 'أمتحان',
                currentExamNumber: 0,
                exam: {},
                isResult: false,
                examResult: {},
                choices: [],
                notFound: false,
                completed: false,
                exams: [],
                solutionModel: {},
                timer: '00:00',
                examDone: true,
                instructions: '-',
                loading: false,
                ready: false,
                timerAlert: false,
                examTime: 0,
                live: false,
                lessons: false,
                currentPage: 'exam'
            }
        },
        computed: {
            drawer() {
                return this.$store.getters.drawer;
            },
            userEmail() {
                return this.$store.getters.userEmail;
            },
            username() {
                return this.$store.getters.username;
            },
            userId() {
                return this.$store.getters.userId;
            },
            stage() {
                return localStorage.getItem('stage');
            }
        },
        methods: {
            setTimer() {
                console.log(new Date(localStorage.getItem('timer')).getTime()- new Date().getTime());
                setTimeout(() => {
                    localStorage.removeItem('timer');
                    this.sendAnswers();
                    clearInterval(counter);

                }, new Date(localStorage.getItem('timer')).getTime()- new Date().getTime() )
                
                const counter = setInterval(() => {
                    const time = Math.ceil(new Date(localStorage.getItem('timer')).getTime()- new Date().getTime());
                    let minutes = Math.floor(time / 60000);
                    minutes = minutes < 1?0: parseFloat(minutes).toFixed(0);
                    let seconds = Math.floor((time%60000)/1000).toFixed(0);
                    if(seconds < 10) seconds = '0'+seconds;
                    this.timer = `${minutes}:${seconds}`;
                    if(minutes < 1 && seconds < 60) {
                        this.timerAlert = !this.timerAlert;
                    }
                }, 1000);
            },
            getUserPreviousExams() {
                axios.get('/getStudentExams/'+this.$store.getters.userId).then(res => {
                    this.exams = res.data.exams;
                    this.getInstructions();
                })
            },
            submitAnswers() {
                let completed = true;
                this.solutionModel.sections.forEach(sec => {
                    sec.questions.map(ques => {
                        if(ques.answer === '') completed = false;
                    })
                })
                if(completed) {
                    this.sendAnswers();
                } else {
                    this.$store.dispatch('writemessage', 'Complete your answers...')
                }
            },
            sendAnswers() {
                if(this.examDone) return;
                this.examDone = true;
                axios.post('/sendSolution', {
                    userId: this.$store.getters.userId,
                    examId: this.exam._id,
                    year: this.solutionModel.year,
                    number: this.solutionModel.number,
                    stage: this.solutionModel.stage,
                    sections: this.solutionModel.sections
                }).then(res => {
                    if(res.data.done) {
                        this.examDone = true;
                        localStorage.removeItem('timer');
                        this.getUserPreviousExams();
                        this.$store.dispatch('writemessage', 'You sent your answers successfully...')
                    } else {
                        this.examDone = false;
                    }
                })
            },
            getExamResult(exam) {
                this.examResult = {};
                this.currentPage = 'results';
                this.examResult = exam;
                this.currentExamNumber = exam.number;
            },
            startExamHandler() {
                if(!localStorage.getItem('timer')) {
                    localStorage.setItem('timer',new Date(new Date().getTime()+this.examTime*60000));
                }
                this.setTimer();
                this.startExam = true;
            },
            getInstructions() {
                this.currentExamNumber = 0;
                axios.get('/getAdminData').then(res => {
                    this.instructions = res.data.adminData.instructions || '';
                    this.loading = false;
                    this.ready = true;
                });
            },
            currentExamHandler() {
                this.currentPage = 'exam';
                 if(this.examDone){
                     this.currentPage = 'instructions'
                    this.getInstructions()
                }
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
    .startQuiz {
        text-align: center;
        button {
            width: 200px;
            height: 200px;
            border-radius: 100px;
            margin-top: 20%;
            font-size: 22px;
            box-shadow:3px 2px 4px #555;
        }
    }
    
</style>