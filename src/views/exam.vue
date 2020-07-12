<template>
<div id="">
    <div v-if="loading" style="background-color: #6c757de3;height:100%;width:100%;position:absolute;z-index:13;padding-top:auto"><app-loading/></div>
    <v-navigation-drawer
      v-model="drawer"
      overlay-opacity=".5"
      app
    >
        <div class="card drawer">
            <article class="card-group-item">
                <header class="card-header">
                    <h6 class="title">الأمتحانات</h6>
                </header>
                <div class="drawer-content">
                    <div style="padding: 33px" class="card-body">
                        <button @click="() => {isResult = false; if(examDone) {getInstructions()}}" class="btn btn-primary">{{examDone?'تعليمات الامتحان القادم': 'قم بحل الامتحان الحالي'}}</button>
                        <div  class="examTab" :class="[exam.done?'': 'toCorrect', exam.solution.number===currentExamNumber?'current':'']"  @click="() => {getExamResult(exam)}" v-for="exam in exams" :key="exam._id">{{currentExam}}({{exam.solution.number}})</div>
                    </div> <!-- card-body.// -->
                </div>
            </article> <!-- card-group-item.// -->
		</div>

    </v-navigation-drawer>
    <Grades-drawer/>

  <!--CONTENT-->
  <v-content>
    <v-container fluid>
      <h2 v-if="notFound">No exams yet...</h2>
      <v-alert
      style="text-align:center"
       v-if="examDone"
      dense
      type="info"
    >
      <strong>بأنتظار الامتحان القادم</strong>
    </v-alert>
      <div v-if="examDone && !isResult">
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
      <button @click="()=>{startExamHandler()}" class="btn btn-primary startExam" v-if="!examDone && !isResult && !startExam">Start Exam.</button>
      
      <!-----------------------------Exams REsults--------------------->
      
      <div class="examResults"  v-if="isResult">
        <div style="text-align:center;margin-bottom:30px;color:rgb(19, 30, 56);font-weight:bold">
            <h3>Exam {{examResult.solution.number}}</h3>
            <h4>Stage <strong>{{examResult.solution.stage}}</strong> Year <Strong>{{examResult.solution.year}}</strong></h4>
            <h2 style="color:rgb(196, 26, 26);font-weight:bolder;">({{mark}} / {{fullMark}})</h2>
            <h2 v-if="!examResult.done" style="color:#60845b">(ما زال الأمتحان قيد التصحيح)</h2>
        </div>

        <div v-for="(section, s) in examResult.solution.sections" :key="s" class="section">
            <h4 class="sectionType">{{section.type}}:</h4>
            <div v-for="(question, q) in section.questions" :key="q" class="questions" :class="section.questions[q].correction?'wrong':''">
                <div class="examResultsQuestionAndDegree">
                    <strong>{{q+1}}-</strong><h5> {{question.question}}?</h5>
                    <!-- <i :class="question.correction===''?'fa fa-check check': 'fa fa-times times'" aria-hidden="true"></i> -->
                    <h4>{{question.degree}}/{{question.fullDegree}}</h4>
                </div>
                <div class="underQuestion">
                    <p class="answer"><strong>Answer:</strong> {{question.answer}}</p>
                    <p v-if="question.correction!==''" class="correction"><strong>Correction:</strong> {{question.correction}}<p/>
                </div>
            </div>
        </div>
      </div>

    <!--------------------------------Exam Results ---------------------------->


      <section class="exam" v-if="!notFound && !examDone && !isResult && startExam">
        <v-system-bar/>
        <div style="text-align:center;margin-bottom:30px;color:#6b364a;font-weight:bold">
            <h2 class="timer" :class="timerAlert?'timerAlert': 'timerRegular'">{{timer}}</h2>
            <h3>Exam {{exam.number}}</h3>
            <h4>Stage <strong>{{exam.stage}}</strong> Year <Strong>{{exam.year}}</strong></h4>
        </div>
        <div v-for="(section, s) in exam.sections" :key="s" class="section">
            <h4 style="margin:20px;text-decoration:underline;color:#555">{{section.type}}</h4>
            <div style="margin-left: 40px;" v-for="(question, q) in section.questions" :key="q"  class="question">
                <h3><strong>{{q+1}}</strong>-{{question.question}}?</h3>
                <v-textarea
                 v-if="question.choices.length===0"
                 v-model="solutionModel.sections[s].questions[q].answer"
                 label="The Answer"
                 auto-grow
                 outlined
                 rows="3"
                 row-height="25"
                 shaped
                ></v-textarea>
                <v-radio-group v-if="question.choices.length>0" v-model="solutionModel.sections[s].questions[q].answer">
                    <v-radio
                    style="margin-left: 20px;"
                        v-for="(choice, c) in question.choices"
                        :key="c"
                        :label="choice"
                        :value="choice"
                    ></v-radio>
                </v-radio-group>
            </div>
        </div>
        <button @click="submitAnswers" type="button" class="btn btn-primary">Submit answers</button>
        <v-divider/>
      </section>
    </v-container>
  </v-content>
</div>
</template>

<script>

    import loading from '../components/loading.vue';
    import GradesDrawer from '../components/studentsGradesDrawer.vue';
    import axios from 'axios';
    export default {
        created() {
            this.loading = true;
            axios.get('/fetchExamForUser/'+new Date().getFullYear()+'/'+this.stage).then(res => {
                if(res.data.exam.length > 0) {
                    this.exam = res.data.exam[0];
                    const examModel = {...this.exam};
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
                axios.get('/testedOrNot/'+this.exam._id+'/'+this.$store.getters.userId).then(res => {
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
                instructions: '',
                loading: false,
                timerAlert: false
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
            stage() {
                return localStorage.getItem('stage');
            },
            fullMark() {
            let mark = 0;
            this.examResult.solution.sections.forEach(sec => {
                sec.questions.forEach(ques => {
                    mark = mark + ques.fullDegree; 
                })
            })
            return mark;
            },
            mark() {
                let mark = 0;
                this.examResult.solution.sections.forEach(sec => {
                    sec.questions.forEach(ques => {
                        mark = mark + +ques.degree; 
                    })
                })
                return mark;
            },
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
                axios.post('/sendSolution', {
                    userId: this.$store.getters.userId,
                    examId: this.exam._id,
                    solution: this.solutionModel
                }).then(res => {
                    if(res.data.done) {
                        this.examDone = true;
                        localStorage.removeItem('timer');
                        this.getUserPreviousExams();
                        this.$store.dispatch('writemessage', 'You sent your answers successfully...')
                    }
                })
            },
            getExamResult(exam) {
                this.isResult = true;
                this.examResult = exam;
                this.currentExamNumber = exam.solution.number;
            },
            startExamHandler() {
                if(!localStorage.getItem('timer')) {
                    localStorage.setItem('timer',new Date(new Date().getTime()+90000));
                }
                this.setTimer();
                this.startExam = true;
            },
            getInstructions() {
                this.currentExamNumber = 0;
                axios.get('/getAdminData').then(res => {
                    this.instructions = res.data.adminData.instructions;
                    this.loading = false;
                });
            },
            logout() {}
        },
        components: {
            appLoading: loading,
            GradesDrawer
        }
    }
</script>

<style lang="scss" scoped>
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
    .drawer {
        background-image: linear-gradient(#aab5be, rgb(176, 183, 184), rgb(250, 252, 252));
        height: 100%;
        .title {
            color: rgb(32, 79, 85);
            text-align: center;
            font-weight: bold;
            font-size: 50px;
        }
        .card-body {
            button {
                width: 100%;
                margin-bottom: 30px;
                font-weight: bold;
            }
            .examTab {
                width: 100%;
                margin: 12px;
                padding: 12px 0px;
                background-color:#35444699;
                color: #fff;
                text-align: center;
                font-size: 20px;
                border-radius: 20px;
                cursor: pointer;
                &:hover {
                    background-color: #64787a99;
                    border: solid 1px #35444699;
                }
            }
            .toCorrect {
                background-color: rgba(40, 92, 29, 0.671);
            }
            .current {
                margin-left: 20%;
            }
        }
    }
    .examResults {
        background-color:rgba(161, 180, 183, 0.07);
        border: solid 1px #999;
        padding: 30px 2px;
        border-radius: 17px;
        .section {
            padding: 10px;
            .sectionType {
                margin:20px;
                text-decoration:underline;
                color:#555
            }
            .questions {
                margin-left: 20px;
                padding: 20px;
                .examResultsQuestionAndDegree {
                    display: flex;
                    flex-direction: row;
                    justify-content: space-between;
                    h5 {
                        flex: 8;
                        font-family:'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif
                    }
                    h4 {
                        flex: 1;
                        font-weight: bolder;
                        color:rgb(196, 26, 26);
                    }
                    i {
                        flex: 1;
                        margin: 3px;
                        .check {
                            background-color: green;
                        }
                        .times {
                            color: red;
                        }
                    }
                }
                .underQuestion {
                    margin-left:20px;
                    font-weight:bold;
                    .answer {
                        color:rgb(75, 116, 167);
                        strong {
                            color:rgb(35, 55, 92)
                        }
                    }
                    .correction {
                        color: rgb(184, 75, 100);
                        strong {
                            color:rgb(196, 26, 26);
                        }
                    }
                }
            }
            .wrong {
                border: solid 1px red;
                border-radius: 30px;
                background-color:#db161621
            }
        }
    }
    .exam {
        .timer {
            width: 100px;
            border-radius: 30px;
            padding: 4px;
            margin-top: 3px;
            color: #113e65;
            position:fixed;
            left:73%;
            right:0;
            border: solid 1px rgb(39, 97, 48);
            box-shadow: #555;
        }
        .timerAlert {
            background-color:rgba(184, 75, 101, 0.548);
            font-size: 39;
        }
        .timerRegular {
            background-color: rgb(167, 233, 178);
            font-size: 32;
        }
    }
</style>