<template>
<div id="">
    <v-navigation-drawer
      class="drawer"
      v-model="drawer"
      overlay-opacity=".5"
      app
    >
        <div style="margin-top:50px;text-align:center;">
            <h3 style="color:#3f6a94;font-weight:bold;" class="text-center">الأمتحانات </h3>
            <h4 @click="() => {isResult = false; if(examDone) {getInstructions()}}" class="examTab">{{examDone?'تعليمات الامتحان القادم': 'قم بحل الامتحان الحالي'}}</h4>
            <p :class="exam.done?'': 'toCorrect'" @click="() => {getExamResult(exam)}" class="examTab" v-for="exam in exams" :key="exam._id">({{exam.solution.number}})أمتحان رقم</p>
        </div>
    </v-navigation-drawer>
    <Grades-drawer/>

  <!--CONTENT-->
  <v-content>
    <v-container fluid>
      <h2 v-if="notFound">No exams yet...</h2>
      <div style="text-align:center;" v-if="examDone && !isResult">
          <h4>بأنتظار الامتحان القادم</h4>
          <h4 v-for="(instruction, i) in instructions.split('-')" :key="i">{{instruction}} - {{i+1}}</h4>
      </div>
      <button @click="()=>{startExamHandler()}" class="btn btn-primary" style="text-align:center;" v-if="!examDone && !isResult && !startExam">Start Exam.</button>
      <div v-if="isResult">
        <div style="text-align:center;margin-bottom:30px;color:#6b364a;font-weight:bold">
            <h3>Exam {{examResult.solution.number}}</h3>
            <h4>{{examResult.solution.stage}} Stage Year {{examResult.solution.year}}</h4>
            <h2 style="color:red">{{mark}} / {{fullMark}}</h2>
            <h2 v-if="!examResult.done" style="color:blue">ما زال الأمتحان قيد التصحيح</h2>
        </div>
        <div v-for="(section, s) in examResult.solution.sections" :key="s" class="section">
            <h4 style="margin:20px;text-decoration:underline;color:#555">{{section.type}}</h4>
            <div style="margin-left: 40px;" v-for="(question, q) in section.questions" :key="q"  class="question">
                <h3>{{question.question}}?</h3>
                <h4 style="font-weight:bold;color:#2f6b3f;margin-left:20px;">{{question.answer}}</h4>
                <input disabled @change="calculateMark()" type="number" v-model="question.degree" placeholder="degree" min="0" :max="question.fullDegree"><p>{{question.fullDegree}}</p>
                <input disabled style="color:#da4545;font-weight:bold" type="text" v-model="question.correction" placeholder="correction"/>
            </div>
        </div>
      </div>
      <section v-if="!notFound && !examDone && !isResult && startExam">
        <v-system-bar/>
        <div style="text-align:center;margin-bottom:30px;color:#6b364a;font-weight:bold">
            <h2 style="color: #113e65;position:fixed;left:50%;right:0">{{timer}}</h2>
            <h3>Exam {{exam.number}}</h3>
            <h4>{{exam.stage}} Stage Year {{exam.year}}</h4>
        </div>
        <div v-for="(section, s) in exam.sections" :key="s" class="section">
            <h4 style="margin:20px;text-decoration:underline;color:#555">{{section.type}}</h4>
            <div style="margin-left: 40px;" v-for="(question, q) in section.questions" :key="q"  class="question">
                <h3>{{question.question}}?</h3>
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
                });
            });
            
            if(!localStorage.getItem('timer')) {
                localStorage.setItem('timer',new Date(new Date().getTime()+3600000));
            }
            axios.get('/getStudentExams/'+this.$store.getters.userId).then(res => {
                this.exams = res.data.exams;
                this.getInstructions();
            })

        if(localStorage.getItem('answers')) {
            this.solutionModel = JSON.parse(localStorage.getItem('answers'));
            console.log(this.solutionModel);
        }

        },
        mounted() {
            this.$store.dispatch('loadFilters', this.$route.params.cat);
            this.$store.dispatch('getwishlist');
            this.$store.dispatch('filterItems', {category: this.$route.params.cat});
        },
        data() {
            return {
                drawer2: true,
                startExam: false,
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
                pageData: {
                    nextDisabled: false,
                    prevDisabled: false
                }
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
                setTimeout(() => {
                    localStorage.removeItem('timer');
                    localStorage.removeItem('answers');
                    this.sendAnswers();
                    clearInterval(counter);

                }, new Date(localStorage.getItem('timer')).getTime()- new Date().getTime() )
                
                const counter = setInterval(() => {
                    const time = Math.ceil(new Date(localStorage.getItem('timer')).getTime()- new Date().getTime());
                    let minutes = time / 60000;
                    minutes = minutes < 1?0: parseFloat(minutes).toFixed(0);
                    let seconds = parseFloat((time%60000)/1000).toFixed(0);
                    if(seconds < 10) seconds = '0'+seconds;
                    this.timer = `${minutes}:${seconds}`;

                    localStorage.setItem('answers', JSON.stringify(this.solutionModel));

                }, 1000);
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
                    }
                })
            },
            getExamResult(exam) {
                this.isResult = true;
                this.examResult = exam;
            },
            startExamHandler() {
                this.startExam = true;
                this.setTimer();
            },
            getInstructions() {
                axios.get('/getAdminData').then(res => {
                    this.instructions = res.data.adminData.instructions;
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

<style scoped>
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
    .examTab {
        font-weight: bolder;
        font-size: 25px;
        color: #0c344c;
        cursor: pointer;
        -webkit-text-stroke-color: aliceblue;
    }
    .drawer {
        background-image: linear-gradient(#aab5be, rgb(176, 183, 184), rgb(250, 252, 252))
    }
    .toCorrect {
        color: rgb(117, 117, 4);
    }
</style>